# OpenAI Whisper Transcription Setup

This guide explains how to set up the automatic transcription functionality using OpenAI's Whisper API.

## Prerequisites

1. **OpenAI API Key**: You need an OpenAI account and API key
2. **Node.js**: Version 16 or higher
3. **npm**: For package management

## Setup Steps

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (keep it secure!)

### 2. Environment Configuration

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your OpenAI API key to `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 3. Install Dependencies

The required packages are already installed:
- `openai`: Official OpenAI Node.js client
- `formidable`: File upload parsing

### 4. Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/upload` page
3. Upload an audio file
4. The system will automatically transcribe using Whisper API

## How It Works

### Frontend Flow
1. User selects an audio file
2. File is validated (type, size) using centralized configuration
3. File is uploaded to the server
4. Transcription process starts automatically
5. Progress is shown to the user
6. Results are displayed with timestamps

### Backend Process
1. File is received via FormData
2. File is validated using the same centralized configuration
3. OpenAI Whisper API is called
4. Transcription results are returned
5. Temporary files are cleaned up

## API Endpoint

**POST** `/api/transcribe`

**Request**: FormData with audio file
**Response**: JSON with transcription data

```json
{
  "success": true,
  "transcription": "Full transcript text...",
  "segments": [
    {
      "start": 0,
      "end": 5.5,
      "text": "Segment text...",
      "confidence": 0.95
    }
  ],
  "language": "en",
  "duration": 120.5
}
```

## Supported File Formats

### Audio Formats (50+ formats)
- **MP3**: `audio/mp3`, `audio/mpeg`, `audio/mpeg3`
- **MP4 Audio**: `audio/mp4`, `audio/x-m4a`, `audio/m4a`, `audio/aac`
- **WAV**: `audio/wav`, `audio/x-wav`, `audio/wave`
- **OGG**: `audio/ogg`, `audio/oga`, `audio/opus`
- **FLAC**: `audio/flac`, `audio/x-flac`
- **AIFF**: `audio/aiff`, `audio/x-aiff`
- **WMA**: `audio/wma`, `audio/x-ms-wma`
- **Real Audio**: `audio/ra`, `audio/x-realaudio`
- **WebM Audio**: `audio/webm`
- **3GPP**: `audio/3gpp`, `audio/3gpp2`
- **AMR**: `audio/amr`, `audio/amr-wb`
- **MIDI**: `audio/midi`, `audio/x-midi`, `audio/mid`
- **MP2**: `audio/mp2`, `audio/x-mp2`
- **And many more...**



### File Extensions
- **Audio**: `.mp3`, `.m4a`, `.aac`, `.wav`, `.ogg`, `.oga`, `.opus`, `.flac`, `.aiff`, `.wma`, `.ra`, `.amr`, `.mid`, `.midi`, `.mp2`, `.xm`, `.webm`, `.3gp`, `.3g2`


### Platform Support
- **Google Meet** recordings (MP4, WebM)
- **Zoom** exports (MP4, M4A)
- **Microsoft Teams** recordings (MP4, MP3)
- **Webex** recordings (MP4, WAV)
- **Any recording software** that exports to standard formats

## Features

- **Real-time Progress**: Upload and transcription progress bars
- **Timestamps**: Word-level timing information
- **Confidence Scores**: Accuracy indicators for each segment
- **Language Detection**: Automatic language identification
- **Download**: Export transcripts as text files
- **Responsive Design**: Works on all devices
- **Comprehensive Format Support**: 50+ audio formats
- **Centralized Configuration**: Single source of truth for all formats

## Centralized Configuration

All supported formats are defined in `src/lib/audioFormats.js`:

```javascript
import { 
  SUPPORTED_FORMATS, 
  SUPPORTED_EXTENSIONS, 
  MAX_FILE_SIZE, 
  validateFile,
  getFileTypeCategory 
} from '@/lib/audioFormats';
```

This ensures:
- **Consistency** between frontend and backend
- **Easy maintenance** - add new formats in one place
- **Type safety** - shared validation functions
- **Extensibility** - simple to add new format categories

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your OpenAI API key is correct and has credits
2. **File Size**: Check that files are under 500MB
3. **File Type**: Verify file format is in the supported list
4. **Network**: Ensure stable internet connection for API calls

### Error Messages

- "Invalid file type": File format not supported (check the comprehensive list above)
- "File too large": Exceeds 500MB limit
- "Transcription failed": API error or network issue
- "No audio file provided": Missing file in request

## Cost Considerations

- OpenAI Whisper API pricing: $0.006 per minute
- 1 hour recording ≈ $0.36
- Monitor usage in OpenAI dashboard

## Security Notes

- API keys are stored server-side only
- Files are processed temporarily and deleted
- No persistent storage of audio content
- HTTPS recommended for production
- Centralized validation prevents format injection

## Next Steps

After transcription, you can:
1. Generate meeting summaries
2. Extract action items
3. Create meeting notes
4. Analyze conversation patterns
5. Export to various formats

---

For support or questions, check the main README or create an issue in the repository.
