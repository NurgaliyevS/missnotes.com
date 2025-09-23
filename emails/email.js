import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const resendApiKey = process.env.RESEND_API_KEY;

const resend = new Resend(resendApiKey);

// Day 1 - Struggling to keep up in meetings?
function getDay1mail(userName = "") {
  return {
    subject: "Struggling to keep up in meetings?",
    html: `
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Every meeting feels like a nightmare, ${userName}?</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Everyone else was writing notes, asking smart questions, and you were just... <strong>blank</strong>.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Upload meeting audio. Get notes & action items in 2 minutes. Share instantly.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><a href="https://missnotes.com/upload" style="color:#067df7;text-decoration-line:none" target="_blank">Start 3-Day Free Trial</a></p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><strong>P.S.: Why did you sign up? What brought you here?</strong></p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Hit "Reply" and let me know. I read and reply to every email.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Bye,<br>Sabyr</p>
    `,
  };
}

// Day 2 - Managers asking you to follow up after calls and you have nothing?
function getDay2Email(userName = "") {
    return {
      subject: "Managers asking you to follow up after calls and you have nothing?",
      html: `
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">The scary moment: Your boss asks "What did we decide, ${userName}?"</p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">You have no notes. You can't <strong>remember</strong>.</p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">You feel bad. You look unprepared.</p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><a href="https://missnotes.com/upload" style="color:#067df7;text-decoration-line:none" target="_blank">Never panic again</a></p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><strong>P.S.: Do you need help?</strong></p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Hit "Reply" and let me know. I read and reply to every email.</p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Bye,<br>Sabyr</p>
      `,
    };
}

// Day 3 - Meetings sucking the life out of you?
function getDay3Email(userName = "") {
    return {
      subject: "Meetings sucking the life out of you?",
      html: `
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">You have meetings today. Your brain is tired, ${userName}.</p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">You can't remember what happened in meeting <strong>#1</strong>.</p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Everything gets mixed up in your head</p>

        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Simple fix: </p>

         <ol>
            <li style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;font-size:14px">Record the meeting</li>
            <li style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;font-size:14px">Upload the meeting audio</li>
            <li style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;font-size:14px">Get notes & action items in 2 minutes</li>
         </ol>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><a href="https://missnotes.com/upload" style="color:#067df7;text-decoration-line:none" target="_blank">Upload the meeting audio</a></p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><strong>P.S.: Do you have any questions?</strong></p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Hit "Reply" and let me know. I read and reply to every email.</p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Bye,<br>Sabyr</p>
      `,
    };
}

// Day 4 - Can't take notes and pay attention at the same time?
function getDay4Email(userName = "") {
    return {
      subject: "Can't take notes and pay attention at the same time?",
      html: `
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Your brain can't do two things at once. That's normal, ${userName}.</p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Writing notes AND listening is <strong>impossible</strong>.</p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">You're not bad at meetings. Meetings are bad for you.</p>

        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">MissNotes was made for you.</p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><a href="https://missnotes.com/upload" style="color:#067df7;text-decoration-line:none" target="_blank">Start free trial</a></p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><strong>P.S. You can do it!</strong></p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Hit "Reply" and let me know. I read and reply to every email.</p>
        
        <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Bye,<br>Sabyr</p>
      `,
    };
}

// Day 5 - Never be able to remember anything?
function getDay5Email(userName = "") {
  return {
    subject: "Never be able to remember anything?",
    html: `
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Most apps are too hard. Too many buttons, too many steps.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">MissNotes was made for you, ${userName}.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Upload your meeting. Wait 2 minutes. Get your notes.</p>

      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Works with Zoom, Teams, Google Meet, even your phone's voice recorder.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><a href="https://missnotes.com/upload" style="color:#067df7;text-decoration-line:none" target="_blank">Easy is better</a></p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><strong>P.S. I'm here to help!</strong></p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Hit "Reply" and let me know. I read and reply to every email.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Bye,<br>Sabyr</p>
    `,
  };
}

// Day 6 - How much time did you lose this week?
function getDay6Email(userName = "") {
  return {
    subject: "How much time did you lose this week?",
    html: `
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">You forgot important stuff this week. Again, ${userName}.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Missed deadlines. Had to ask people to repeat things.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">This wastes your time. Makes you look bad.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><a href="https://missnotes.com/upload" style="color:#067df7;text-decoration-line:none" target="_blank">Save your time</a></p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><strong>P.S. You're not alone!</strong></p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Hit "Reply" and let me know. I read and reply to every email.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Bye,<br>Sabyr</p>
    `,
  };
}

// Day 7 - Don’t go to another meeting unprepared
function getDay7Email(userName = "") {
  return {
    subject: "Don’t go to another meeting unprepared",
    html: `
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">You don't need to struggle through another meeting, ${userName}.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">No more panic. No more stress.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><a href="https://missnotes.com/upload" style="color:#067df7;text-decoration-line:none" target="_blank">Start now</a></p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px"><strong>P.S. I have been there!</strong></p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Hit "Reply" and let me know. I read and reply to every email.</p>
      
      <p style="font-size:14px;line-height:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;margin-top:16px;margin-bottom:16px">Bye,<br>Sabyr</p>
    `,
  };
}

async function setupEmail() {
  try {
    const result = await resend.emails.send({
      from: "Sabyr Nurgaliyev <sabyr@missnotes.com>",
      to: "kabduldinova.aiym111@gmail.com",
      subject: "Hello World",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
      replyTo: "nurgasab@gmail.com",
    });
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Function to send Day 1 welcome email
async function sendDay1Email(userEmail, userName = "") {
  try {
    const emailContent = getDay1mail(userName);
    const result = await resend.emails.send({
      from: "Sabyr from MissNotes <sabyr@missnotes.com>",
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: "nurgasab@gmail.com",
    });
    console.log("Day 1 welcome email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending Day 1 welcome email:", error);
    throw error;
  }
}

async function sendDay2Email(userEmail, userName = "") {
  try {
    const emailContent = getDay2Email(userName);
    const result = await resend.emails.send({
      from: "Sabyr from MissNotes <sabyr@missnotes.com>",
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: "nurgasab@gmail.com",
    });
    console.log("Day 2 welcome email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending Day 2 welcome email:", error);
    throw error;
  }
}

async function sendDay3Email(userEmail, userName = "") {
  try {
    const emailContent = getDay3Email(userName);
    const result = await resend.emails.send({
      from: "Sabyr from MissNotes <sabyr@missnotes.com>",
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: "nurgasab@gmail.com",
    });
    console.log("Day 3 welcome email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending Day 3 welcome email:", error);
    throw error;
  }
}

async function sendDay4Email(userEmail, userName = "") {
  try {
    const emailContent = getDay4Email(userName);
    const result = await resend.emails.send({
      from: "Sabyr from MissNotes <sabyr@missnotes.com>",
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: "nurgasab@gmail.com",
    });
    console.log("Day 4 welcome email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending Day 4 welcome email:", error);
    throw error;
  }
}

async function sendDay5Email(userEmail, userName = "") {
  try {
    const emailContent = getDay5Email(userName);
    const result = await resend.emails.send({
      from: "Sabyr from MissNotes <sabyr@missnotes.com>",
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: "nurgasab@gmail.com",
    });
    console.log("Day 5 welcome email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending Day 5 welcome email:", error);
    throw error;
  }
}

async function sendDay6Email(userEmail, userName = "") {
  try {
    const emailContent = getDay6Email(userName);
    const result = await resend.emails.send({
      from: "Sabyr from MissNotes <sabyr@missnotes.com>",
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: "nurgasab@gmail.com",
    });
    console.log("Day 6 welcome email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending Day 6 welcome email:", error);
    throw error;
  }
}

async function sendDay7Email(userEmail, userName = "") {
  try {
    const emailContent = getDay7Email(userName);
    const result = await resend.emails.send({
      from: "Sabyr from MissNotes <sabyr@missnotes.com>",
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: "nurgasab@gmail.com",
    });
    console.log("Day 7 welcome email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending Day 7 welcome email:", error);
    throw error;
  }
}

// Export functions for use in other files
export { getDay1mail, sendDay1Email, setupEmail, getDay2Email, sendDay2Email, getDay3Email, sendDay3Email, getDay4Email, sendDay4Email, getDay5Email, sendDay5Email, getDay6Email, sendDay6Email, getDay7Email, sendDay7Email };

// sendDay1Email("kabduldinova.aiym111@gmail.com", "Aiym");
// sendDay2Email("kabduldinova.aiym111@gmail.com", "Aiym");
// sendDay3Email("kabduldinova.aiym111@gmail.com", "Aiym");
// sendDay4Email("kabduldinova.aiym111@gmail.com", "Aiym");
// sendDay5Email("kabduldinova.aiym111@gmail.com", "Aiym");
// sendDay6Email("kabduldinova.aiym111@gmail.com", "Aiym");
sendDay7Email("kabduldinova.aiym111@gmail.com", "Aiym");