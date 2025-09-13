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
 * Upload all chunks sequentially and return results
 * @param {Array} chunks - Array of chunk data objects
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Array>} Array of transcription results
 */
export async function uploadAllChunks(chunks, onProgress = null) {
  const results = [];
  
  console.log('Starting sequential chunk upload:', {
    totalChunks: chunks.length,
    sessionId: chunks[0]?.sessionId
  });

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    try {
      const result = await uploadChunk(chunk, onProgress);
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload chunk ${i}:`, error);
      throw new Error(`Chunk ${i} upload failed: ${error.message}`);
    }
  }

  console.log('All chunks uploaded successfully:', {
    totalChunks: results.length,
    sessionId: results[0]?.sessionId
  });

  return results;
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

    // Step 1: Chunk the file
    const chunks = await chunkAudioFile(file);
    
    if (onProgress) {
      onProgress({ step: 'chunking', progress: 10, message: `Split file into ${chunks.length} chunks` });
    }

    // Step 2: Upload all chunks
    const chunkResults = await uploadAllChunks(chunks, (chunkProgress) => {
      if (onProgress) {
        const uploadProgress = 10 + (chunkProgress.progress * 0.8); // 10-90%
        onProgress({ 
          step: 'uploading', 
          progress: uploadProgress, 
          message: `Uploading chunk ${chunkProgress.chunkIndex + 1}/${chunkProgress.totalChunks}` 
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
