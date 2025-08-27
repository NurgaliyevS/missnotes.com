import { useState } from 'react';
import { Upload, FileAudio, CheckCircle, AlertCircle, Loader2, Play, Pause, Download, Sparkles, Calendar, Users, Target, FileText, Share2, Copy, User } from 'lucide-react';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  SUPPORTED_FORMATS, 
  SUPPORTED_EXTENSIONS, 
  MAX_FILE_SIZE, 
  validateFile,
  getFileTypeCategory 
} from '@/lib/audioFormats';
import ProtectedRoute from '@/components/ProtectedRoute';
import SubscriptionCheck from '@/components/SubscriptionCheck';
import { useSession } from 'next-auth/react';

export default function UploadPage() {
  const { data: session } = useSession();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryResult, setSummaryResult] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  // by default set the meeting date to the current date
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [shareableLink, setShareableLink] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    // Use centralized validation
    const validation = validateFile(selectedFile);
    
    if (!validation.isValid) {
      toast.error(validation.errors.join(', '));
      return;
    }

    setFile(selectedFile);
    setTranscriptionResult(null);
    setSummaryResult(null);
    toast.success(`${selectedFile.name} has been selected for upload.`);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(false);
    setUploadProgress(0);
    handleTranscription();
    // Simulate upload progress
    // const interval = setInterval(() => {
    //   setUploadProgress(prev => {
    //     if (prev >= 90) {
    //       clearInterval(interval);
    //       return 90;
    //     }
    //     return prev + 10;
    //   });
    // }, 200);

    // // Simulate upload completion
    // setTimeout(() => {
    //   setUploadProgress(100);
    //   setUploading(false);
    //   toast({
    //     title: "Upload successful!",
    //     description: "Your recording has been uploaded and is being processed.",
    //   });
      
    //   // Start transcription automatically
    //   handleTranscription();
    // }, 3000);
  };

  const handleTranscription = async () => {
    if (!file) return;

    setTranscribing(true);
    setTranscriptionProgress(0);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Simulate transcription progress
      const progressInterval = setInterval(() => {
        setTranscriptionProgress(prev => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + 5;
        });
      }, 500);

      // Call transcription API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const result = await response.json();
      setTranscriptionResult(result);
      setTranscriptionProgress(100);

      toast.success(`Successfully transcribed ${file.name}`);

    } catch (error) {
      console.error('Transcription error:', error);
      toast.error(error.message || "An error occurred during transcription.");
    } finally {
      setTranscribing(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!transcriptionResult || !meetingTitle.trim()) {
      toast.error("Please provide a meeting title and ensure transcription is complete.");
      return;
    }

    setGeneratingSummary(true);

    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription: transcriptionResult.transcription,
          meetingTitle: meetingTitle.trim(),
          meetingDate: meetingDate || new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Summary generation failed');
      }

      const result = await response.json();
      setSummaryResult(result);

      toast.success("AI Summary generated!");

    } catch (error) {
      console.error('Summary generation error:', error);
      toast.error(error.message || "An error occurred while generating the summary.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setTranscriptionResult(null);
    setSummaryResult(null);
    setUploadProgress(0);
    setTranscriptionProgress(0);
    setMeetingTitle('');
    setMeetingDate('');
    setShareableLink('');
  };

  const getFileIcon = (fileType) => {
    const category = getFileTypeCategory(fileType, file?.name);
    if (category === 'audio') {
      return <FileAudio className="h-8 w-8 text-blue-500" />;
    }
    return <FileAudio className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const downloadTranscription = () => {
    if (!transcriptionResult) return;
    
    const content = `Transcription Results\n\n` +
                   `File: ${file.name}\n` +
                   `Duration: ${formatDuration(transcriptionResult.duration)}\n` +
                   `Language: ${transcriptionResult.language}\n\n` +
                   `Full Transcript:\n${transcriptionResult.transcription}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSummary = () => {
    if (!summaryResult) return;
    
    const content = `AI Meeting Summary\n\n` +
                   `Meeting: ${meetingTitle}\n` +
                   `Date: ${meetingDate}\n` +
                   `Generated: ${new Date(summaryResult.timestamp).toLocaleString()}\n\n` +
                   `${summaryResult.summary}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meetingTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSummaryPDF = () => {
    if (!summaryResult) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('AI Meeting Summary', 20, 30);
    
    // Add meeting details
    doc.setFontSize(12);
    doc.text(`Meeting: ${meetingTitle}`, 20, 50);
    doc.text(`Date: ${meetingDate}`, 20, 60);
    doc.text(`Generated: ${new Date(summaryResult.timestamp).toLocaleString()}`, 20, 70);
    
    // Add summary sections
    let yPosition = 90;
    
    // Meeting Summary
    if (summaryResult.sections.meetingSummary) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Meeting Summary', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const summaryLines = doc.splitTextToSize(summaryResult.sections.meetingSummary, 170);
      doc.text(summaryLines, 20, yPosition);
      yPosition += (summaryLines.length * 5) + 10;
    }
    
    // Key Decisions
    if (summaryResult.sections.keyDecisions) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Key Decisions', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const decisionsLines = doc.splitTextToSize(summaryResult.sections.keyDecisions, 170);
      doc.text(decisionsLines, 20, yPosition);
      yPosition += (decisionsLines.length * 5) + 10;
    }
    
    // Action Items
    if (summaryResult.sections.actionItems) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Action Items', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const actionLines = doc.splitTextToSize(summaryResult.sections.actionItems, 170);
      doc.text(actionLines, 20, yPosition);
    }
    
    // Save the PDF
    doc.save(`${meetingTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.pdf`);
  };

  const generateShareableLink = async () => {
    if (!summaryResult) return;
    
    // Generate a unique ID for the meeting
    const meetingId = btoa(`${meetingTitle}-${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '');
    
    // Create the shareable link
    const link = `${window.location.origin}/share/${meetingId}`;
    setShareableLink(link);
    
    // Store the meeting data in the backend
    const meetingData = {
      id: meetingId,
      title: meetingTitle,
      date: meetingDate,
      summary: summaryResult,
      transcription: transcriptionResult,
      timestamp: Date.now()
    };
    
    try {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meetingData }),
      });
      
      if (response.ok) {
        toast.success('Shareable link generated!');
      } else {
        toast.error('Failed to save meeting data');
      }
    } catch (error) {
      console.error('Error saving meeting data:', error);
      toast.error('Failed to save meeting data');
    }
  };

  const copyToClipboard = async () => {
    if (!shareableLink) return;
    
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareableLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <ProtectedRoute>
      <SubscriptionCheck>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
          <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Upload Your Meeting Recording
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Transform your Google Meet, Zoom, or Teams recordings into actionable meeting notes with AI-powered transcription and insights.
            </p>
          </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Recording Upload
            </CardTitle>
                      <CardDescription>
            Supported formats: MP3, M4A, WAV, OGG, FLAC, AAC, AIFF and many more audio formats
          </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!file ? (
                <div>
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">
                    Drop your recording file here
                  </p>
                  <p className="text-slate-500 mb-4">
                    or click to browse files
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    Choose File
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    accept={SUPPORTED_EXTENSIONS}
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    {getFileIcon(file.type)}
                    <div className="text-left">
                      <p className="font-medium text-slate-700">{file.name}</p>
                      <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                      <p className="text-xs text-slate-400">{file.type}</p>
                    </div>
                  </div>
                  
                  {uploading && (
                    <div className="w-full max-w-md mx-auto">
                      <Progress value={uploadProgress} className="mb-2" />
                      <p className="text-sm text-slate-600">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}

                  {transcribing && (
                    <div className="w-full max-w-md mx-auto">
                      <Progress value={transcriptionProgress} className="mb-2" />
                      <p className="text-sm text-slate-600">
                        Transcribing with OpenAI Whisper... {transcriptionProgress}%
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 justify-center">
                    {!uploading && !transcribing && (
                      <>
                        <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload & Transcribe
                        </Button>
                        <Button variant="outline" onClick={removeFile}>
                          Remove File
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meeting Details Form */}
        {transcriptionResult && !summaryResult && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Meeting Details
              </CardTitle>
              <CardDescription>
                Provide meeting information to generate AI-powered summaries and action items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="meeting-title">Meeting Title *</Label>
                  <Input
                    id="meeting-title"
                    placeholder="e.g., Weekly Team Standup"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="meeting-date">Meeting Date</Label>
                  <Input
                    id="meeting-date"
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleGenerateSummary} 
                  disabled={!meetingTitle.trim() || generatingSummary}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {generatingSummary ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating AI Summary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate AI Summary & Action Items
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Summary Results */}
        {summaryResult && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Meeting Summary
              </CardTitle>
              <CardDescription>
                Generated using GPT-4 - Meeting insights, decisions, and action items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-600">Meeting</p>
                  <p className="font-medium text-slate-900">{meetingTitle}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-600">Date</p>
                  <p className="font-medium text-slate-900">{meetingDate}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-600">Model</p>
                  <p className="font-medium text-slate-900">GPT-4o-mini</p>
                </div>
              </div>

              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="summary">Meeting Summary</TabsTrigger>
                  <TabsTrigger value="decisions">Key Decisions</TabsTrigger>
                  <TabsTrigger value="actions">Action Items</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="mt-4">
                  <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {summaryResult.sections.meetingSummary || 'Meeting summary not available.'}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="decisions" className="mt-4">
                  <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {summaryResult.sections.keyDecisions || 'No key decisions identified.'}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="mt-4">
                  <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {summaryResult.sections.actionItems || 'No action items identified.'}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex gap-2 justify-center">
                <Button onClick={downloadSummary} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Summary
                </Button>
                <Button onClick={downloadSummaryPDF} variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button 
                  onClick={generateShareableLink}
                  variant="outline"
                  disabled={shareableLink !== ''}
                  className={`${
                    shareableLink !== '' 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {shareableLink !== '' ? 'Already Shared' : 'Share via Link'}
                </Button>
                <Button 
                  onClick={() => {
                    setSummaryResult(null);
                    setMeetingTitle('');
                    setMeetingDate('');
                    setShareableLink('');
                  }} 
                  variant="outline"
                >
                  Generate New Summary
                </Button>
              </div>

              {/* Shareable Link Section */}
              {shareableLink && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Shareable Link Generated
                  </h3>
                  <p className="text-sm text-green-700 mb-3">
                    Anyone with this link can view your meeting summary:
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      value={shareableLink}
                      readOnly
                      className="bg-white"
                    />
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      variant="outline"
                      className="bg-white hover:bg-green-100"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Transcription Results */}
        {transcriptionResult && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Transcription Complete
              </CardTitle>
              <CardDescription>
                AI-powered transcription using OpenAI Whisper API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">
                    {formatDuration(transcriptionResult.duration)}
                  </p>
                  <p className="text-sm text-slate-600">Duration</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">
                    {transcriptionResult.language?.toUpperCase() || 'Auto'}
                  </p>
                  <p className="text-sm text-slate-600">Language</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">
                    {transcriptionResult.transcription.split(' ').length}
                  </p>
                  <p className="text-sm text-slate-600">Words</p>
                </div>
              </div>

              <Tabs defaultValue="transcript" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
                  {/* <TabsTrigger value="segments">Timestamps</TabsTrigger> */}
                </TabsList>
                
                <TabsContent value="transcript" className="mt-4">
                  <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {transcriptionResult.transcription}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="segments" className="mt-4">
                  <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    {transcriptionResult.segments?.map((segment, index) => (
                      <div key={index} className="mb-3 p-3 bg-white rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-mono text-slate-500">
                            {formatDuration(segment.start)} - {formatDuration(segment.end)}
                          </span>
                          <span className="text-xs text-slate-400">
                            {Math.round(segment.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-slate-700">{segment.text}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-center">
                <Button onClick={downloadTranscription} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Transcript
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileAudio className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Multiple Formats</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600">
                Support for {SUPPORTED_FORMATS.length}+ audio formats from all major platforms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">AI Processing</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600">
                Advanced AI transcription and analysis to extract key insights from your meetings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600">
                Enterprise-grade security with end-to-end encryption for your sensitive meeting content.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Support */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Platforms</CardTitle>
            <CardDescription>
              Export recordings from these platforms and upload them directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="px-4 py-2">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                Google Meet
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                Zoom
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                Microsoft Teams
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                Webex
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                Any Audio File
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
      </SubscriptionCheck>
    </ProtectedRoute>
  );
}
