import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transcription, meetingTitle, meetingDate } = req.body;

    if (!transcription) {
      return res.status(400).json({ error: 'Transcription text is required' });
    }

    // Create the prompt for GPT-4o-mini with cleaner formatting
    const prompt = `Based on the following meeting transcript, please provide a comprehensive analysis in the following format:

MEETING SUMMARY:
- Provide a concise, bullet-point summary of the main topics discussed

KEY DECISIONS:
- List any decisions that were made during the meeting
- Include context for each decision

ACTION ITEMS:
- Extract all action items mentioned
- For each action item, include:
  * What needs to be done
  * Who is responsible (if mentioned)
  * Suggested deadline (if not specified, suggest a reasonable one based on context)
  * Priority level (High/Medium/Low)

Meeting Context:
- Title: ${meetingTitle || 'Meeting'}
- Date: ${meetingDate || 'Not specified'}

Transcript:
${transcription}

Please format the response clearly with proper sections and bullet points. Do NOT use markdown formatting like ** or __. Use plain text only.`;

    // Generate summary using GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional meeting analyst. Your task is to extract key insights, decisions, and action items from meeting transcripts. Be concise but comprehensive. Always suggest reasonable deadlines for action items if none are specified. Use plain text formatting only - no markdown symbols like ** or __."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const summary = completion.choices[0].message.content;

    // Clean up the response by removing markdown symbols and extra formatting
    const cleanSummary = summary
      .replace(/\*\*/g, '')  // Remove ** symbols
      .replace(/__/g, '')    // Remove __ symbols
      .replace(/\*/g, '')    // Remove single * symbols
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .trim();

    // Parse the response to extract structured data with better parsing
    const sections = {
      meetingSummary: '',
      keyDecisions: '',
      actionItems: ''
    };

    // Extract sections from the cleaned response
    if (cleanSummary.includes('MEETING SUMMARY:')) {
      const summaryMatch = cleanSummary.match(/MEETING SUMMARY:(.*?)(?=KEY DECISIONS:|$)/s);
      if (summaryMatch) {
        sections.meetingSummary = summaryMatch[1].trim();
      }
    }

    if (cleanSummary.includes('KEY DECISIONS:')) {
      const decisionsMatch = cleanSummary.match(/KEY DECISIONS:(.*?)(?=ACTION ITEMS:|$)/s);
      if (decisionsMatch) {
        sections.keyDecisions = decisionsMatch[1].trim();
      }
    }

    if (cleanSummary.includes('ACTION ITEMS:')) {
      const actionItemsMatch = cleanSummary.match(/ACTION ITEMS:(.*?)$/s);
      if (actionItemsMatch) {
        sections.actionItems = actionItemsMatch[1].trim();
      }
    }

    // If sections are empty, fall back to the full cleaned summary
    if (!sections.meetingSummary && !sections.keyDecisions && !sections.actionItems) {
      sections.meetingSummary = cleanSummary;
    }

    res.status(200).json({
      success: true,
      summary: cleanSummary,
      sections: sections,
      model: 'gpt-4o-mini',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary', 
      details: error.message 
    });
  }
}
