import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";
import { 
  sendDay1Email, 
  sendDay2Email, 
  sendDay3Email, 
  sendDay4Email, 
  sendDay5Email, 
  sendDay6Email, 
  sendDay7Email 
} from "@/emails/email";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const startTime = new Date();
  console.log(`[CRON] Email sequence job started at ${startTime.toISOString()}`);

    try {
      await connectMongoDB();

      const results = {
      success: true,
      startTime: startTime.toISOString(),
      processed: {},
      summary: {
        totalProcessed: 0,
        totalErrors: 0
      }
    };

    // Email functions for each day
    const emailFunctions = {
      1: sendDay1Email,
      2: sendDay2Email,
      3: sendDay3Email,
      4: sendDay4Email,
      5: sendDay5Email,
      6: sendDay6Email,
      7: sendDay7Email
    };

    // First, initialize email sequence fields for users who don't have them
    await User.updateMany(
      {
        email: { $exists: true, $ne: null, $ne: "" },
        email_sequence_started_at: { $exists: false }
      },
      {
        $set: {
          email_sequence_started_at: new Date(),
          email_sequence_day: 0,
          email_sequence_completed: false,
          email_sequence_paused: false,
          email_sequence_opted_out: false,
          last_email_sent_at: null
        }
      }
    );

    // Process each day of the email sequence (1-7)
    for (let day = 1; day <= 7; day++) {
      try {
        console.log(`[CRON] Processing day ${day} emails...`);
        
        // Get users ready for this day
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - 24); // 24 hours since last email
        
        const users = await User.find({
          email: { $exists: true, $ne: null, $ne: "" },
          email_sequence_day: day - 1,
          email_sequence_completed: false,
          email_sequence_opted_out: false,
          email_sequence_paused: false,
          variant_name: { $in: ["free", null] },
          $or: [
            { last_email_sent_at: null },
            { last_email_sent_at: { $lte: cutoffTime } }
          ]
        }).select('_id name email email_sequence_day email_sequence_started_at last_email_sent_at createdAt');

        console.log(`Found ${users.length} users ready for day ${day} email`);

        let dayProcessed = 0;
        let dayErrors = 0;

        // Send emails to each user
        for (const user of users) {
          try {
            const sendEmailFunction = emailFunctions[day];
            if (!sendEmailFunction) {
              throw new Error(`No email function found for day ${day}`);
            }

            // Send the email
            const userName = user.name || "";
            const result = await sendEmailFunction(user.email, userName);
            
            if (result) {
              // Update user record
              const updateData = {
                last_email_sent_at: new Date(),
                email_sequence_day: day
              };

              // If this is day 7, mark sequence as completed
              if (day === 7) {
                updateData.email_sequence_completed = true;
              }

              await User.findByIdAndUpdate(user._id, { $set: updateData });
              console.log(`Successfully sent day ${day} email to ${user.email}`);
              dayProcessed++;
            } else {
              throw new Error("Email sending failed - no result returned");
            }

          } catch (error) {
            console.error(`Failed to send day ${day} email to ${user.email}:`, error);
            dayErrors++;
          }
        }
        
        results.processed[`day${day}`] = {
          processed: dayProcessed,
          errors: dayErrors
        };

        results.summary.totalProcessed += dayProcessed;
        results.summary.totalErrors += dayErrors;

        console.log(`[CRON] Day ${day} complete: ${dayProcessed} sent, ${dayErrors} errors`);

      } catch (dayError) {
        console.error(`[CRON] Error processing day ${day}:`, dayError);
        results.processed[`day${day}`] = {
          error: dayError.message
        };
        results.summary.totalErrors++;
      }
    }

    const endTime = new Date();
    const duration = endTime - startTime;
    
    results.endTime = endTime.toISOString();
    results.duration = `${duration}ms`;

    console.log(`[CRON] Email sequence job completed in ${duration}ms`);
    console.log(`[CRON] Summary: ${results.summary.totalProcessed} emails sent, ${results.summary.totalErrors} errors`);

    return res.status(200).json(results);

  } catch (error) {
    const endTime = new Date();
    const duration = endTime - startTime;
    
    console.error(`[CRON] Email sequence job failed after ${duration}ms:`, error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: `${duration}ms`
    });
  }
}