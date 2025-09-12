export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { chunks, sessionId, originalFilename } = req.body;

		// Validate input
		if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
			return res.status(400).json({
				error: 'Invalid input',
				details: 'chunks array is required and must not be empty'
			});
		}

		if (!sessionId) {
			return res.status(400).json({
				error: 'Missing sessionId',
				details: 'sessionId is required for merging chunks'
			});
		}

		console.log('Merging transcriptions:', {
			sessionId,
			originalFilename,
			chunkCount: chunks.length
		});

		// Sort chunks by chunkIndex to ensure correct order
		const sortedChunks = chunks.sort((a, b) => a.chunkIndex - b.chunkIndex);

		// Validate chunk sequence
		for (let i = 0; i < sortedChunks.length; i++) {
			if (sortedChunks[i].chunkIndex !== i) {
				return res.status(400).json({
					error: 'Invalid chunk sequence',
					details: `Expected chunk ${i}, got chunk ${sortedChunks[i].chunkIndex}`
				});
			}
		}

		// Calculate cumulative duration offset for each chunk
		let cumulativeDuration = 0;
		const processedChunks = [];

		for (let i = 0; i < sortedChunks.length; i++) {
			const chunk = sortedChunks[i];
			
			// Adjust timestamps for segments
			const adjustedSegments = chunk.segments?.map(segment => ({
				...segment,
				start: segment.start + cumulativeDuration,
				end: segment.end + cumulativeDuration,
				words: segment.words?.map(word => ({
					...word,
					start: word.start + cumulativeDuration,
					end: word.end + cumulativeDuration
				}))
			})) || [];

			processedChunks.push({
				...chunk,
				segments: adjustedSegments,
				cumulativeStartTime: cumulativeDuration
			});

			// Update cumulative duration for next chunk
			cumulativeDuration += chunk.duration || 0;
		}

		// Merge all transcriptions
		const mergedTranscription = processedChunks
			.map(chunk => chunk.transcription)
			.join(' ')
			.replace(/\s+/g, ' ') // Clean up multiple spaces
			.trim();

		// Merge all segments
		const mergedSegments = processedChunks
			.flatMap(chunk => chunk.segments)
			.filter(segment => segment && segment.text && segment.text.trim());

		// Merge all words
		const mergedWords = processedChunks
			.flatMap(chunk => chunk.segments?.flatMap(segment => segment.words || []) || [])
			.filter(word => word && word.word && word.word.trim());

		// Calculate final statistics
		const totalDuration = cumulativeDuration;
		const totalWords = mergedWords.length;
		const totalSegments = mergedSegments.length;
		const avgWordsPerSecond = totalDuration > 0 ? totalWords / totalDuration : 0;

		// Get language (use first chunk's detected language)
		const detectedLanguage = processedChunks[0]?.language || 'unknown';

		console.log('Transcription merge successful:', {
			sessionId,
			totalDuration: totalDuration.toFixed(2),
			totalWords,
			totalSegments,
			avgWordsPerSecond: avgWordsPerSecond.toFixed(2),
			language: detectedLanguage
		});

		// Return merged transcription
		res.status(200).json({
			success: true,
			transcription: mergedTranscription,
			segments: mergedSegments,
			words: mergedWords,
			language: detectedLanguage,
			duration: totalDuration,
			// Statistics
			wordCount: totalWords,
			segmentCount: totalSegments,
			avgWordsPerSecond: parseFloat(avgWordsPerSecond.toFixed(2)),
			// Metadata
			sessionId,
			originalFilename,
			chunkCount: chunks.length,
			timestamp: new Date().toISOString(),
			// Chunk processing info
			chunkProcessingInfo: processedChunks.map(chunk => ({
				chunkIndex: chunk.chunkIndex,
				duration: chunk.duration,
				wordCount: chunk.wordCount,
				cumulativeStartTime: chunk.cumulativeStartTime
			}))
		});

	} catch (error) {
		console.error('Merge transcription error:', error);
		res.status(500).json({
			error: 'Merge transcription failed',
			details: error.message,
		});
	}
}
