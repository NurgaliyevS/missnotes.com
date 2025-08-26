// Comprehensive list of supported audio formats only
// This file serves as a single source of truth for audio format validation

export const SUPPORTED_AUDIO_FORMATS = [
  // MP3 formats
  'audio/mp3',
  'audio/mpeg',
  'audio/mpeg3',
  'audio/x-mpeg3',
  
  // MP4 audio formats
  'audio/mp4',
  'audio/x-m4a',
  'audio/m4a',
  'audio/aac',
  
  // WAV formats
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  
  // OGG formats
  'audio/ogg',
  'audio/oga',
  'audio/opus',
  
  // FLAC formats
  'audio/flac',
  'audio/x-flac',
  
  // AIFF formats
  'audio/aiff',
  'audio/x-aiff',
  
  // WMA formats
  'audio/wma',
  'audio/x-ms-wma',
  
  // Real Audio formats
  'audio/ra',
  'audio/x-realaudio',
  
  // Other common formats
  'audio/webm',
  'audio/3gpp',
  'audio/3gpp2',
  'audio/amr',
  'audio/amr-wb',
  'audio/basic',
  'audio/midi',
  'audio/x-midi',
  'audio/mid',
  'audio/x-mid',
  'audio/x-midi',
  'audio/mp2',
  'audio/x-mp2',
  'audio/x-ms-wax',
  'audio/x-pn-realaudio',
  'audio/x-pn-realaudio-plugin',
  'audio/x-scpls',
  'audio/xm',
  'audio/x-ms-wma',
  'audio/x-ms-wax',
  'audio/x-pn-realaudio',
  'audio/x-pn-realaudio-plugin',
  'audio/x-scpls',
  'audio/xm'
];

// Combined formats for general use (only audio)
export const SUPPORTED_FORMATS = [
  ...SUPPORTED_AUDIO_FORMATS
];

// File extensions for input accept attribute (only audio)
export const SUPPORTED_EXTENSIONS = [
  // Audio extensions only
  '.mp3', '.m4a', '.aac', '.wav', '.ogg', '.oga', '.opus', '.flac', '.aiff', 
  '.wma', '.ra', '.amr', '.mid', '.midi', '.mp2', '.xm', '.webm', '.3gp', '.3g2'
].join(',');

// MIME types for input accept attribute (only audio)
export const SUPPORTED_MIME_TYPES = SUPPORTED_FORMATS.join(',');

// Maximum file size (500MB)
export const MAX_FILE_SIZE = 500 * 1024 * 1024;

// Extension to MIME type mapping for fallback validation (only audio)
export const EXTENSION_MIME_MAP = {
  // Audio files only
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.oga': 'audio/ogg',
  '.opus': 'audio/opus',
  '.flac': 'audio/flac',
  '.aiff': 'audio/aiff',
  '.wma': 'audio/wma',
  '.ra': 'audio/ra',
  '.amr': 'audio/amr',
  '.mid': 'audio/midi',
  '.midi': 'audio/midi',
  '.mp2': 'audio/mpeg',
  '.xm': 'audio/xm',
  '.webm': 'audio/webm',
  '.3gp': 'audio/3gpp',
  '.3g2': 'audio/3gpp2'
};

// Helper function to get MIME type from file extension
export const getMimeTypeFromExtension = (filename) => {
  if (!filename) return null;
  
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return EXTENSION_MIME_MAP[extension] || null;
};

// Helper function to check if a file type is supported
export const isSupportedFormat = (mimeType, filename = null) => {
  // First check the MIME type directly
  if (mimeType && SUPPORTED_FORMATS.includes(mimeType)) {
    return true;
  }
  
  // If MIME type is undefined or not supported, try to infer from filename
  if (filename) {
    const inferredMimeType = getMimeTypeFromExtension(filename);
    if (inferredMimeType && SUPPORTED_FORMATS.includes(inferredMimeType)) {
      return true;
    }
  }
  
  return false;
};

// Helper function to get file type category (always audio for supported files)
export const getFileTypeCategory = (mimeType, filename = null) => {
  // Try MIME type first
  if (mimeType) {
    if (SUPPORTED_AUDIO_FORMATS.includes(mimeType)) {
      return 'audio';
    }
  }
  
  // Fallback to filename extension
  if (filename) {
    const inferredMimeType = getMimeTypeFromExtension(filename);
    if (inferredMimeType) {
      if (SUPPORTED_AUDIO_FORMATS.includes(inferredMimeType)) {
        return 'audio';
      }
    }
  }
  
  return 'unknown';
};

// Helper function to validate file
export const validateFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }
  
  if (!isSupportedFormat(file.type, file.name)) {
    errors.push(`Unsupported file type: ${file.type || 'unknown'}. File: ${file.name}. Only audio formats are supported.`);
  }
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
