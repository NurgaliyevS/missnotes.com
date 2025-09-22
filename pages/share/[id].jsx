import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Calendar, Users, Clock, FileText, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import jsPDF from 'jspdf';
import Link from 'next/link';

// Helper function to format duration
const formatDuration = (seconds) => {
  if (!seconds) return 'N/A';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Get meeting data from the backend
      const fetchMeetingData = async () => {
        try {
          const response = await fetch(`/api/meetings/${id}`);
          if (response.ok) {
            const data = await response.json();
            setMeetingData(data);
          } else {
            console.error('Meeting not found');
          }
        } catch (error) {
          console.error('Error fetching meeting data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchMeetingData();
    }
  }, [id]);

  const downloadSummary = () => {
    if (!meetingData) return;
    
    const content = `Meeting Summary\n\n` +
                   `Meeting: ${meetingData.title}\n` +
                   `Date: ${meetingData.date}\n` +
                   `Generated: ${new Date(meetingData.timestamp).toLocaleString()}\n\n` +
                   `${meetingData.summary.summary}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meetingData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSummaryPDF = () => {
    if (!meetingData) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Meeting Summary', 20, 30);
    
    // Add meeting details
    doc.setFontSize(12);
    doc.text(`Meeting: ${meetingData.title}`, 20, 50);
    doc.text(`Date: ${meetingData.date}`, 20, 60);
    doc.text(`Generated: ${new Date(meetingData.timestamp).toLocaleString()}`, 20, 70);
    
    // Add summary sections
    let yPosition = 90;
    
    // Meeting Summary
    if (meetingData.summary.sections.meetingSummary) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Meeting Summary', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const summaryLines = doc.splitTextToSize(meetingData.summary.sections.meetingSummary, 170);
      doc.text(summaryLines, 20, yPosition);
      yPosition += (summaryLines.length * 5) + 10;
    }
    
    // Key Decisions
    if (meetingData.summary.sections.keyDecisions) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Key Decisions', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const decisionsLines = doc.splitTextToSize(meetingData.summary.sections.keyDecisions, 170);
      doc.text(decisionsLines, 20, yPosition);
      yPosition += (decisionsLines.length * 5) + 10;
    }
    
    // Action Items
    if (meetingData.summary.sections.actionItems) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Action Items', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const actionLines = doc.splitTextToSize(meetingData.summary.sections.actionItems, 170);
      doc.text(actionLines, 20, yPosition);
    }
    
    // Save the PDF
    doc.save(`${meetingData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.pdf`);
  };

  const downloadTranscript = () => {
    if (!meetingData.transcription) return;
    
    const content = `Meeting Transcript\n\n` +
                   `Meeting: ${meetingData.title}\n` +
                   `Date: ${meetingData.date}\n` +
                   `Duration: ${formatDuration(meetingData.transcription.duration)}\n` +
                   `Language: ${meetingData.transcription.language || 'Auto'}\n\n` +
                   `Full Transcript:\n${meetingData.transcription.transcription}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meetingData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading meeting summary...</p>
        </div>
      </div>
    );
  }

  if (!meetingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Meeting Not Found</h1>
          <p className="text-xl text-slate-600 mb-6">This meeting summary link is invalid or has expired.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-900">MissNotes</h1>
            <p className="text-sm text-slate-500">Shared Meeting Summary</p>
          </div>
        </div>

        {/* Meeting Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              {meetingData.title}
            </CardTitle>
            <CardDescription>
              Meeting summary and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm text-purple-600">Meeting</p>
                <p className="font-medium text-slate-900">{meetingData.title}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm text-purple-600">Date</p>
                <p className="font-medium text-slate-900">{meetingData.date}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm text-purple-600">Duration</p>
                <p className="font-medium text-slate-900">{meetingData.transcription ? formatDuration(meetingData.transcription.duration) : 'N/A'}</p>
              </div>
            </div>

            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="decisions">Key Decisions</TabsTrigger>
                <TabsTrigger value="actions">Action Items</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-4">
                <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {meetingData.summary.sections.meetingSummary || 'Meeting summary not available.'}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="decisions" className="mt-4">
                <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {meetingData.summary.sections.keyDecisions || 'No key decisions identified.'}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="mt-4">
                <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {meetingData.summary.sections.actionItems || 'No action items identified.'}
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
            </div>
          </CardContent>
        </Card>

        {/* Transcription Results */}
        {meetingData.transcription && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Full Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {meetingData.transcription.transcription}
                </p>
              </div>


            <div className="mt-6 flex gap-2 justify-center">
              <Button onClick={downloadTranscript} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Transcript
              </Button>
            </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
