// File chunking utility for large audio files
// Splits files into chunks that can be processed by the chunked transcription API

const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks (Vercel limit is 4.5MB)
const OVERLAP_SIZE = 512 * 1024; // 512KB overlap to avoid cutting words

/**
 * Generate a unique session ID for chunking operations
 * @returns {string} Unique session identifier
 */
export function generateSessionId() {
  return `chunk-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a file needs to be chunked based on size
 * @param {File} file - The file to check
 * @returns {boolean} True if file needs chunking
 */
export function needsChunking(file) {
  // Use a more conservative threshold to ensure we stay well under Vercel's 4.5MB limit
  return file.size > (CHUNK_SIZE - OVERLAP_SIZE);
}

/**
 * Check if a processed file needs to be chunked based on duration
 * Processed files are compressed, so we need to chunk by duration rather than size
 * @param {File} file - The processed file to check
 * @param {number} estimatedDurationMinutes - Estimated duration in minutes
 * @returns {boolean} True if file needs chunking
 */
export function needsChunkingByDuration(file, estimatedDurationMinutes = null) {
  // If we have duration info, chunk files longer than 10 minutes
  if (estimatedDurationMinutes && estimatedDurationMinutes > 10) {
    return true;
  }
  
  // For processed files, also check if the original filename suggests a long recording
  const filename = file.name.toLowerCase();
  const longRecordingIndicators = ['meeting', 'recording', 'call', 'interview', 'session'];
  const hasLongRecordingIndicator = longRecordingIndicators.some(indicator => 
    filename.includes(indicator)
  );
  
  // If filename suggests a long recording, chunk it
  if (hasLongRecordingIndicator) {
    return true;
  }
  
  // Fall back to size-based chunking
  return needsChunking(file);
}

/**
 * Split an audio file into chunks based on duration (for processed files)
 * @param {File} file - The processed audio file to chunk
 * @param {string} sessionId - Unique session identifier
 * @returns {Promise<Array>} Array of chunk objects
 */
export async function chunkAudioFileByDuration(file, sessionId = null) {
  if (!file) {
    throw new Error('No file provided for duration-based chunking');
  }

  const actualSessionId = sessionId || generateSessionId();
  
  // For processed files, estimate duration and create time-based chunks
  // Assume average bitrate of 64kbps for processed files
  const estimatedBitrate = 64 * 1024; // 64kbps in bytes per second
  const estimatedDurationSeconds = file.size / estimatedBitrate;
  const estimatedDurationMinutes = estimatedDurationSeconds / 60;
  
  console.log('Duration-based chunking for processed file:', {
    filename: file.name,
    size: file.size,
    estimatedDurationSeconds: estimatedDurationSeconds.toFixed(2),
    estimatedDurationMinutes: estimatedDurationMinutes.toFixed(2),
    sessionId: actualSessionId
  });

  // Chunk every 10 minutes of audio
  const CHUNK_DURATION_MINUTES = 10;
  const totalChunks = Math.ceil(estimatedDurationMinutes / CHUNK_DURATION_MINUTES);
  
  // For very long files, limit to reasonable number of chunks
  const maxChunks = 20;
  const finalChunks = Math.min(totalChunks, maxChunks);
  
  const chunks = [];
  const bytesPerChunk = Math.floor(file.size / finalChunks);
  
  for (let i = 0; i < finalChunks; i++) {
    const startByte = i * bytesPerChunk;
    const endByte = i === finalChunks - 1 ? file.size : (i + 1) * bytesPerChunk;
    
    // Create chunk blob
    const chunkBlob = file.slice(startByte, endByte);
    
    // Create new File object with chunk data
    const originalExt = file.name.substring(file.name.lastIndexOf('.'));
    const chunkFileName = `${file.name.replace(originalExt, '')}.duration-chunk${i}${originalExt}`;
    const chunkFile = new File([chunkBlob], chunkFileName, {
      type: file.type,
      lastModified: file.lastModified
    });

    chunks.push({
      chunkIndex: i,
      totalChunks: finalChunks,
      sessionId: actualSessionId,
      originalFilename: file.name,
      chunk: chunkFile,
      startByte,
      endByte: endByte - 1,
      chunkSize: chunkBlob.size,
      isFirstChunk: i === 0,
      isLastChunk: i === finalChunks - 1,
      estimatedDurationMinutes: estimatedDurationMinutes / finalChunks
    });
  }

  console.log('Duration-based chunking completed:', {
    filename: file.name,
    totalChunks: finalChunks,
    sessionId: actualSessionId,
    estimatedDurationMinutes: estimatedDurationMinutes.toFixed(2),
    chunks: chunks.map(c => ({
      index: c.chunkIndex,
      size: c.chunkSize,
      range: `${c.startByte}-${c.endByte}`,
      estimatedDuration: c.estimatedDurationMinutes.toFixed(2) + 'min'
    }))
  });

  return chunks;
}

/**
 * Split an audio file into chunks
 * @param {File} file - The audio file to chunk
 * @param {string} sessionId - Unique session identifier
 * @returns {Promise<Array>} Array of chunk objects
 */
export async function chunkAudioFile(file, sessionId = null) {
  if (!file) {
    throw new Error('No file provided for chunking');
  }

  const actualSessionId = sessionId || generateSessionId();
  
  // If file is small enough, return as single chunk
  if (!needsChunking(file)) {
    return [{
      chunkIndex: 0,
      totalChunks: 1,
      sessionId: actualSessionId,
      originalFilename: file.name,
      chunk: file,
      startByte: 0,
      endByte: file.size - 1,
      chunkSize: file.size,
      isFirstChunk: true,
      isLastChunk: true
    }];
  }

  console.log('Chunking large file for Vercel compatibility:', {
    filename: file.name,
    size: file.size,
    sessionId: actualSessionId,
    chunkSize: CHUNK_SIZE,
    overlapSize: OVERLAP_SIZE
  });

  const chunks = [];
  const totalChunks = Math.ceil(file.size / (CHUNK_SIZE - OVERLAP_SIZE));
  
  for (let i = 0; i < totalChunks; i++) {
    const startByte = i * (CHUNK_SIZE - OVERLAP_SIZE);
    const endByte = Math.min(startByte + CHUNK_SIZE, file.size);
    
    // Create chunk blob
    const chunkBlob = file.slice(startByte, endByte);
    
    // Create new File object with chunk data, preserving original extension
    const originalExt = file.name.substring(file.name.lastIndexOf('.'));
    const chunkFileName = `${file.name.replace(originalExt, '')}.chunk${i}${originalExt}`;
    const chunkFile = new File([chunkBlob], chunkFileName, {
      type: file.type,
      lastModified: file.lastModified
    });

    chunks.push({
      chunkIndex: i,
      totalChunks,
      sessionId: actualSessionId,
      originalFilename: file.name,
      chunk: chunkFile,
      startByte,
      endByte: endByte - 1,
      chunkSize: chunkBlob.size,
      isFirstChunk: i === 0,
      isLastChunk: i === totalChunks - 1
    });
  }

  console.log('File chunking completed:', {
    filename: file.name,
    totalChunks,
    sessionId: actualSessionId,
    chunks: chunks.map(c => ({
      index: c.chunkIndex,
      size: c.chunkSize,
      range: `${c.startByte}-${c.endByte}`
    }))
  });

  return chunks;
}

/**
 * Create FormData for a chunk upload
 * @param {Object} chunkData - Chunk data object from chunkAudioFile
 * @returns {FormData} FormData ready for upload
 */
export function createChunkFormData(chunkData) {
  const formData = new FormData();
  
  // Add the chunk file
  formData.append('file', chunkData.chunk);
  
  // Add metadata
  formData.append('chunkIndex', chunkData.chunkIndex.toString());
  formData.append('totalChunks', chunkData.totalChunks.toString());
  formData.append('sessionId', chunkData.sessionId);
  formData.append('originalFilename', chunkData.originalFilename);
  
  return formData;
}

/**
 * Upload a single chunk to the transcription API
 * @param {Object} chunkData - Chunk data object
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} Transcription result for the chunk
 */
export async function uploadChunk(chunkData, onProgress = null) {
  const formData = createChunkFormData(chunkData);
  
  try {
    console.log('Uploading chunk:', {
      chunkIndex: chunkData.chunkIndex,
      totalChunks: chunkData.totalChunks,
      chunkSize: chunkData.chunkSize,
      sessionId: chunkData.sessionId
    });

    const response = await fetch('/api/transcribe-chunked', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (onProgress) {
      onProgress({
        chunkIndex: chunkData.chunkIndex,
        totalChunks: chunkData.totalChunks,
        progress: ((chunkData.chunkIndex + 1) / chunkData.totalChunks) * 100,
        result
      });
    }

    console.log('Chunk upload successful:', {
      chunkIndex: chunkData.chunkIndex,
      wordCount: result.wordCount,
      duration: result.duration
    });

    return result;

  } catch (error) {
    console.error('Chunk upload failed:', {
      chunkIndex: chunkData.chunkIndex,
      error: error.message
    });
    throw error;
  }
}

/**
 * Upload all chunks in parallel and return results
 * @param {Array} chunks - Array of chunk data objects
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Array>} Array of transcription results
 */
export async function uploadAllChunks(chunks, onProgress = null) {
  console.log('Starting parallel chunk upload:', {
    totalChunks: chunks.length,
    sessionId: chunks[0]?.sessionId
  });

  // Track completed chunks for progress
  let completedChunks = 0;
  const chunkResults = new Array(chunks.length);
  
  // Start progress simulation for smoother UX
  let progressInterval = null;
  if (onProgress) {
    let simulatedProgress = 0;
    progressInterval = setInterval(() => {
      simulatedProgress = Math.min(simulatedProgress + 2, 85); // Gradually increase to 85%
      const baseProgress = 10 + (simulatedProgress * 0.8); // 10-90% range
      onProgress({
        step: 'uploading',
        progress: baseProgress,
        message: `Processing ${chunks.length} in parallel... (${completedChunks}/${chunks.length} completed)`
      });
    }, 1000); // Update every second
  }

  // Create array of promises for parallel processing
  const uploadPromises = chunks.map((chunk, index) => {
    return uploadChunk(chunk, (chunkProgress) => {
      // Store result in correct position
      chunkResults[index] = chunkProgress.result;
      completedChunks++;
      
      if (onProgress) {
        // Clear the simulation interval when we have real progress
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        
        // Calculate progress based on completed chunks
        const progress = (completedChunks / chunks.length) * 100;
        const baseProgress = 10 + (progress * 0.8); // 10-90% range
        onProgress({
          chunkIndex: chunkProgress.chunkIndex,
          totalChunks: chunkProgress.totalChunks,
          progress: baseProgress,
          message: `Processing audio in parallel (${completedChunks}/${chunks.length} completed)`,
          result: chunkProgress.result
        });
      }
    }).catch(error => {
      console.error(`Failed to upload chunk ${index}:`, error);
      throw new Error(`Chunk ${index} upload failed: ${error.message}`);
    });
  });

  try {
    // Wait for all chunks to complete in parallel
    const results = await Promise.all(uploadPromises);
    
    // Clear progress interval if still running
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    console.log('All chunks uploaded successfully:', {
      totalChunks: results.length,
      sessionId: results[0]?.sessionId
    });

    return results;
  } catch (error) {
    // Clear progress interval on error
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    console.error('Parallel chunk upload failed:', error);
    throw error;
  }
}

/**
 * Merge chunk transcription results using the merge API
 * @param {Array} chunkResults - Array of chunk transcription results
 * @param {string} sessionId - Session ID for the chunks
 * @param {string} originalFilename - Original filename
 * @returns {Promise<Object>} Merged transcription result
 */
export async function mergeChunkResults(chunkResults, sessionId, originalFilename) {
  try {
    console.log('Merging chunk results:', {
      chunkCount: chunkResults.length,
      sessionId,
      originalFilename
    });

    const response = await fetch('/api/merge-transcriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chunks: chunkResults,
        sessionId,
        originalFilename
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('Chunk merge successful:', {
      sessionId,
      totalDuration: result.duration,
      totalWords: result.wordCount,
      language: result.language
    });

    return result;

  } catch (error) {
    console.error('Chunk merge failed:', error);
    throw error;
  }
}

/**
 * Process audio file in chunks to avoid Vercel size limits
 * @param {File} file - Audio file to process
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} Processed file result
 */
export async function processAudioInChunks(file, onProgress = null) {
  try {
    console.log('Starting chunked audio processing:', {
      filename: file.name,
      size: file.size
    });

    // Check if file needs chunking for processing
    const PROCESSING_CHUNK_SIZE = 3 * 1024 * 1024; // 3MB chunks for processing
    const needsProcessingChunking = file.size > PROCESSING_CHUNK_SIZE;
    
    if (!needsProcessingChunking) {
      // File is small enough, process normally
      if (onProgress) {
        onProgress({ step: 'processing', progress: 50, message: 'Processing audio file...' });
      }
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Audio processing failed');
      }

      const result = await response.json();
      
      if (onProgress) {
        onProgress({ step: 'complete', progress: 100, message: 'Audio processing completed' });
      }
      
      return result;
    }

    // File is too large, need to chunk for processing
    if (onProgress) {
      onProgress({ step: 'chunking', progress: 10, message: `Splitting large file into processing chunks...` });
    }

    // Create processing chunks
    const processingChunks = [];
    const totalProcessingChunks = Math.ceil(file.size / PROCESSING_CHUNK_SIZE);
    
    for (let i = 0; i < totalProcessingChunks; i++) {
      const startByte = i * PROCESSING_CHUNK_SIZE;
      const endByte = Math.min(startByte + PROCESSING_CHUNK_SIZE, file.size);
      
      const chunkBlob = file.slice(startByte, endByte);
      const chunkFile = new File([chunkBlob], `${file.name}.processing-chunk-${i}`, {
        type: file.type,
        lastModified: file.lastModified
      });
      
      processingChunks.push({
        index: i,
        file: chunkFile,
        startByte,
        endByte
      });
    }

    if (onProgress) {
      onProgress({ step: 'processing', progress: 20, message: `Processing ${totalProcessingChunks} audio chunks...` });
    }

    // Process each chunk in parallel with better error handling
    const processingPromises = processingChunks.map(async (chunk, index) => {
      try {
        const formData = new FormData();
        formData.append('file', chunk.file);

        const response = await fetch('/api/process-audio', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(`Chunk ${index} processing failed: ${errorData.error || 'HTTP ' + response.status}`);
        }

        const result = await response.json();
        
        if (onProgress) {
          const progress = 20 + ((index + 1) / totalProcessingChunks) * 60; // 20-80%
          onProgress({ 
            step: 'processing', 
            progress: progress, 
            message: `Processed chunk ${index + 1}/${totalProcessingChunks}` 
          });
        }
        
        return {
          index,
          result,
          chunkFile: chunk.file,
          success: true
        };
      } catch (error) {
        console.error(`Failed to process chunk ${index}:`, error);
        return {
          index,
          error: error.message,
          chunkFile: chunk.file,
          success: false
        };
      }
    });

    const processedChunks = await Promise.all(processingPromises);

    // Check for failed chunks
    const failedChunks = processedChunks.filter(chunk => !chunk.success);
    const successfulChunks = processedChunks.filter(chunk => chunk.success);
    
    if (failedChunks.length > 0) {
      console.warn(`${failedChunks.length} chunks failed to process:`, failedChunks.map(c => c.error));
      
      // If more than half the chunks failed, throw an error
      if (failedChunks.length > totalProcessingChunks / 2) {
        throw new Error(`Too many chunks failed (${failedChunks.length}/${totalProcessingChunks}). Processing aborted.`);
      }
      
      // If we have at least one successful chunk, continue with those
      if (successfulChunks.length === 0) {
        throw new Error('All chunks failed to process. Please try again.');
      }
    }

    if (onProgress) {
      onProgress({ step: 'reassembling', progress: 80, message: 'Reassembling processed audio...' });
    }

    // For chunked processing, we need to return information about all processed chunks
    // so that transcription can process each chunk individually
    const processedChunkUrls = successfulChunks.map(chunk => chunk.result.processedFileUrl);
    const finalProcessedResult = successfulChunks[0].result;
    
    // Return the first processed file URL for backward compatibility
    // but also include all chunk URLs for proper transcription
    const finalProcessedFileUrl = finalProcessedResult.processedFileUrl;
    
    // Calculate combined statistics from all successful processed chunks
    const totalProcessedSize = successfulChunks.reduce((sum, chunk) => sum + chunk.result.processedSize, 0);
    const avgCompressionRatio = successfulChunks.reduce((sum, chunk) => sum + parseFloat(chunk.result.compressionRatio.replace('%', '')), 0) / successfulChunks.length;
    
    if (onProgress) {
      onProgress({ step: 'complete', progress: 100, message: 'Audio processing completed' });
    }

    console.log('Chunked audio processing completed:', {
      filename: file.name,
      originalSize: file.size,
      processedSize: totalProcessedSize,
      compressionRatio: `${avgCompressionRatio.toFixed(1)}%`,
      chunksProcessed: successfulChunks.length,
      failedChunks: failedChunks.length
    });

    return {
      ...finalProcessedResult,
      processedFileUrl: finalProcessedFileUrl,
      processedChunkUrls: processedChunkUrls, // All processed chunk URLs
      processedSize: totalProcessedSize,
      compressionRatio: `${avgCompressionRatio.toFixed(1)}%`,
      chunkedProcessing: true,
      chunksProcessed: successfulChunks.length,
      failedChunks: failedChunks.length
    };

  } catch (error) {
    console.error('Chunked audio processing failed:', error);
    throw error;
  }
}

/**
 * Transcribe multiple processed chunk URLs
 * @param {Array} processedChunkUrls - Array of processed chunk URLs
 * @param {string} originalFilename - Original filename
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} Final merged transcription result
 */
export async function transcribeProcessedChunks(processedChunkUrls, originalFilename, onProgress = null) {
  try {
    console.log('Starting transcription of processed chunks:', {
      chunkCount: processedChunkUrls.length,
      originalFilename
    });

    if (onProgress) {
      onProgress({ step: 'chunking', progress: 10, message: `Preparing ${processedChunkUrls.length} processed chunks for transcription` });
    }

    // Create chunks for each processed URL
    const chunks = processedChunkUrls.map((url, index) => ({
      chunkIndex: index,
      totalChunks: processedChunkUrls.length,
      sessionId: `processed-chunks-${Date.now()}`,
      originalFilename: originalFilename,
      processedFileUrl: url,
      isFirstChunk: index === 0,
      isLastChunk: index === processedChunkUrls.length - 1
    }));

    // Step 2: Upload all chunks in parallel
    const chunkResults = await uploadAllProcessedChunks(chunks, (chunkProgress) => {
      if (onProgress) {
        // Progress is already calculated in uploadAllProcessedChunks (10-90% range)
        onProgress({ 
          step: 'uploading', 
          progress: chunkProgress.progress, 
          message: chunkProgress.message
        });
      }
    });

    if (onProgress) {
      onProgress({ step: 'merging', progress: 90, message: 'Merging transcription results' });
    }

    // Step 3: Merge results
    const finalResult = await mergeChunkResults(chunkResults, chunks[0].sessionId, originalFilename);

    if (onProgress) {
      onProgress({ step: 'complete', progress: 100, message: 'Transcription completed' });
    }

    console.log('Processed chunks transcription workflow completed:', {
      originalFilename,
      totalDuration: finalResult.duration,
      totalWords: finalResult.wordCount
    });

    return finalResult;

  } catch (error) {
    console.error('Processed chunks transcription workflow failed:', error);
    throw error;
  }
}

/**
 * Upload all processed chunks in parallel and return results
 * @param {Array} chunks - Array of chunk data objects with processedFileUrl
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Array>} Array of transcription results
 */
export async function uploadAllProcessedChunks(chunks, onProgress = null) {
  console.log('Starting parallel processed chunk transcription:', {
    totalChunks: chunks.length,
    sessionId: chunks[0]?.sessionId
  });

  // Track completed chunks for progress
  let completedChunks = 0;
  const chunkResults = new Array(chunks.length);
  
  // Start progress simulation for smoother UX
  let progressInterval = null;
  if (onProgress) {
    let simulatedProgress = 0;
    progressInterval = setInterval(() => {
      simulatedProgress = Math.min(simulatedProgress + 2, 85); // Gradually increase to 85%
      const baseProgress = 10 + (simulatedProgress * 0.8); // 10-90% range
      onProgress({
        step: 'uploading',
        progress: baseProgress,
        message: `Transcribing ${chunks.length} processed chunks in parallel... (${completedChunks}/${chunks.length} completed)`
      });
    }, 1000); // Update every second
  }

  // Create array of promises for parallel processing
  const uploadPromises = chunks.map((chunk, index) => {
    return uploadProcessedChunk(chunk, (chunkProgress) => {
      // Store result in correct position
      chunkResults[index] = chunkProgress.result;
      completedChunks++;
      
      if (onProgress) {
        // Clear the simulation interval when we have real progress
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        
        // Calculate progress based on completed chunks
        const progress = (completedChunks / chunks.length) * 100;
        const baseProgress = 10 + (progress * 0.8); // 10-90% range
        onProgress({
          chunkIndex: chunkProgress.chunkIndex,
          totalChunks: chunkProgress.totalChunks,
          progress: baseProgress,
          message: `Transcribing processed chunks in parallel (${completedChunks}/${chunks.length} completed)`,
          result: chunkProgress.result
        });
      }
    }).catch(error => {
      console.error(`Failed to transcribe processed chunk ${index}:`, error);
      throw new Error(`Processed chunk ${index} transcription failed: ${error.message}`);
    });
  });

  try {
    // Wait for all chunks to complete in parallel
    const results = await Promise.all(uploadPromises);
    
    // Clear progress interval if still running
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    console.log('All processed chunks transcribed successfully:', {
      totalChunks: results.length,
      sessionId: results[0]?.sessionId
    });

    return results;
  } catch (error) {
    // Clear progress interval on error
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    console.error('Parallel processed chunk transcription failed:', error);
    throw error;
  }
}

/**
 * Upload a single processed chunk to the transcription API
 * @param {Object} chunkData - Chunk data object with processedFileUrl
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} Transcription result for the chunk
 */
export async function uploadProcessedChunk(chunkData, onProgress = null) {
  try {
    console.log('Transcribing processed chunk:', {
      chunkIndex: chunkData.chunkIndex,
      totalChunks: chunkData.totalChunks,
      processedFileUrl: chunkData.processedFileUrl,
      sessionId: chunkData.sessionId
    });

    // Fetch the processed file and transcribe it
    const proxyResponse = await fetch('/api/fetch-file-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl: chunkData.processedFileUrl })
    });
    
    if (!proxyResponse.ok) {
      throw new Error(`Failed to fetch processed chunk: ${proxyResponse.status}`);
    }
    
    const processedFileBuffer = await proxyResponse.arrayBuffer();
    const processedFile = new File([processedFileBuffer], `processed-chunk-${chunkData.chunkIndex}.mp3`, {
      type: 'audio/mpeg'
    });

    // Create FormData for chunked transcription
    const formData = new FormData();
    formData.append('file', processedFile);
    formData.append('chunkIndex', chunkData.chunkIndex.toString());
    formData.append('totalChunks', chunkData.totalChunks.toString());
    formData.append('sessionId', chunkData.sessionId);
    formData.append('originalFilename', chunkData.originalFilename);

    const response = await fetch('/api/transcribe-chunked', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (onProgress) {
      onProgress({
        chunkIndex: chunkData.chunkIndex,
        totalChunks: chunkData.totalChunks,
        progress: ((chunkData.chunkIndex + 1) / chunkData.totalChunks) * 100,
        result
      });
    }

    console.log('Processed chunk transcription successful:', {
      chunkIndex: chunkData.chunkIndex,
      wordCount: result.wordCount,
      duration: result.duration
    });

    return result;

  } catch (error) {
    console.error('Processed chunk transcription failed:', {
      chunkIndex: chunkData.chunkIndex,
      error: error.message
    });
    throw error;
  }
}

/**
 * Complete chunked transcription workflow
 * @param {File} file - Audio file to transcribe
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} Final merged transcription result
 */
export async function transcribeChunkedFile(file, onProgress = null) {
  try {
    console.log('Starting chunked transcription workflow:', {
      filename: file.name,
      size: file.size
    });

    // Check if this is a processed file (compressed audio)
    const isProcessedFile = file.name.includes('processed') || 
                           file.name.includes('.mp3') ||
                           file.size < 2 * 1024 * 1024; // Less than 2MB suggests compression

    // Step 1: Chunk the file
    let chunks;
    if (isProcessedFile) {
      // For processed files, use duration-based chunking
      console.log('Detected processed file, using duration-based chunking');
      chunks = await chunkAudioFileByDuration(file);
    } else {
      // For original files, use size-based chunking
      chunks = await chunkAudioFile(file);
    }
    
    if (onProgress) {
      onProgress({ step: 'chunking', progress: 10, message: `Split file into ${chunks.length} chunks` });
    }

    // Step 2: Upload all chunks in parallel
    const chunkResults = await uploadAllChunks(chunks, (chunkProgress) => {
      if (onProgress) {
        // Progress is already calculated in uploadAllChunks (10-90% range)
        onProgress({ 
          step: 'uploading', 
          progress: chunkProgress.progress, 
          message: chunkProgress.message
        });
      }
    });

    if (onProgress) {
      onProgress({ step: 'merging', progress: 90, message: 'Merging transcription results' });
    }

    // Step 3: Merge results
    const finalResult = await mergeChunkResults(chunkResults, chunks[0].sessionId, file.name);

    if (onProgress) {
      onProgress({ step: 'complete', progress: 100, message: 'Transcription completed' });
    }

    console.log('Chunked transcription workflow completed:', {
      filename: file.name,
      totalDuration: finalResult.duration,
      totalWords: finalResult.wordCount
    });

    return finalResult;

  } catch (error) {
    console.error('Chunked transcription workflow failed:', error);
    throw error;
  }
}
