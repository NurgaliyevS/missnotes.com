// Comprehensive list of supported audio and video formats
// This file serves as a single source of truth for format validation

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

export const SUPPORTED_VIDEO_FORMATS = [
  // MP4 formats
  'video/mp4',
  'video/x-m4v',
  'video/m4v',
  
  // QuickTime formats
  'video/quicktime',
  'video/x-msvideo',
  'video/avi',
  
  // WebM formats
  'video/webm',
  
  // AVI formats
  'video/avi',
  'video/x-msvideo',
  
  // MOV formats
  'video/quicktime',
  'video/x-quicktime',
  
  // WMV formats
  'video/x-ms-wmv',
  'video/x-ms-asf',
  
  // FLV formats
  'video/x-flv',
  
  // 3GP formats
  'video/3gpp',
  'video/3gpp2',
  
  // Other formats
  'video/mpeg',
  'video/mpg',
  'video/mpe',
  'video/mpv',
  'video/mp2',
  'video/mp2t',
  'video/ts',
  'video/mts',
  'video/m2ts',
  'video/ogv',
  'video/ogg',
  'video/dv',
  'video/x-dv',
  'video/divx',
  'video/xvid',
  'video/h264',
  'video/h265',
  'video/hevc',
  'video/vp8',
  'video/vp9',
  'video/theora'
];

// Combined formats for general use
export const SUPPORTED_FORMATS = [
  ...SUPPORTED_AUDIO_FORMATS,
  ...SUPPORTED_VIDEO_FORMATS
];

// File extensions for input accept attribute
export const SUPPORTED_EXTENSIONS = [
  // Audio extensions
  '.mp3', '.m4a', '.aac', '.wav', '.ogg', '.oga', '.opus', '.flac', '.aiff', 
  '.wma', '.ra', '.amr', '.mid', '.midi', '.mp2', '.xm', '.webm', '.3gp', '.3g2',
  
  // Video extensions
  '.mp4', '.m4v', '.mov', '.avi', '.webm', '.wmv', '.flv', '.3gp', '.3g2',
  '.mpeg', '.mpg', '.mpe', '.mpv', '.mp2', '.ts', '.mts', '.m2ts', '.ogv',
  '.dv', '.divx', '.xvid', '.h264', '.h265', '.hevc', '.vp8', '.vp9', '.theora'
].join(',');

// MIME types for input accept attribute
export const SUPPORTED_MIME_TYPES = SUPPORTED_FORMATS.join(',');

// Maximum file size (500MB)
export const MAX_FILE_SIZE = 500 * 1024 * 1024;

// Extension to MIME type mapping for fallback validation
export const EXTENSION_MIME_MAP = {
  // Audio files
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
  '.3g2': 'audio/3gpp2',
  
  // Video files
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.mov': 'video/quicktime',
  '.avi': 'video/avi',
  '.webm': 'video/webm',
  '.wmv': 'video/x-ms-wmv',
  '.flv': 'video/x-flv',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
  '.mpe': 'video/mpeg',
  '.mpv': 'video/mpeg',
  '.ts': 'video/mp2t',
  '.mts': 'video/mp2t',
  '.m2ts': 'video/mp2t',
  '.ogv': 'video/ogg',
  '.dv': 'video/dv',
  '.divx': 'video/avi',
  '.xvid': 'video/avi',
  '.h264': 'video/mp4',
  '.h265': 'video/mp4',
  '.hevc': 'video/mp4',
  '.vp8': 'video/webm',
  '.vp9': 'video/webm',
  '.theora': 'video/ogg'
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

// Helper function to get file type category
export const getFileTypeCategory = (mimeType, filename = null) => {
  // Try MIME type first
  if (mimeType) {
    if (SUPPORTED_AUDIO_FORMATS.includes(mimeType)) {
      return 'audio';
    } else if (SUPPORTED_VIDEO_FORMATS.includes(mimeType)) {
      return 'video';
    }
  }
  
  // Fallback to filename extension
  if (filename) {
    const inferredMimeType = getMimeTypeFromExtension(filename);
    if (inferredMimeType) {
      if (SUPPORTED_AUDIO_FORMATS.includes(inferredMimeType)) {
        return 'audio';
      } else if (SUPPORTED_VIDEO_FORMATS.includes(inferredMimeType)) {
        return 'video';
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
    errors.push(`Unsupported file type: ${file.type || 'unknown'}. File: ${file.name}`);
  }
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
