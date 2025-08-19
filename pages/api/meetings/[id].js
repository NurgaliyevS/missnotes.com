import connectMongoDB from "@/backend/mongodb";
import Meeting from "@/backend/meeting";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await connectMongoDB();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  if (req.method === 'GET') {
    try {
      const meeting = await Meeting.findOne({ meetingId: id });
      
      if (!meeting) {
        return res.status(404).json({ error: 'Meeting not found' });
      }
      
      return res.status(200).json(meeting);
    } catch (error) {
      console.error('Error fetching meeting:', error);
      return res.status(500).json({ error: 'Failed to fetch meeting' });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const { meetingData } = req.body;
      
      // Check if meeting already exists
      const existingMeeting = await Meeting.findOne({ meetingId: id });
      if (existingMeeting) {
        return res.status(409).json({ error: 'Meeting already exists' });
      }
      
      // Create new meeting
      const meeting = new Meeting({
        meetingId: id,
        title: meetingData.title,
        date: meetingData.date,
        summary: meetingData.summary,
        transcription: meetingData.transcription,
        timestamp: meetingData.timestamp
      });
      
      await meeting.save();
      return res.status(200).json({ success: true, meeting });
    } catch (error) {
      console.error('Error saving meeting:', error);
      return res.status(500).json({ error: 'Failed to save meeting' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
