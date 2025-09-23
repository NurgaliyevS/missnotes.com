import { optOutEmailSequence } from "@/lib/emailSequenceController";
import connectMongoDB from "@/backend/mongodb";
import User from "@/backend/user";

/**
 * API route for users to unsubscribe from the email sequence
 * 
 * Usage:
 * GET /api/unsubscribe-email-sequence?email=user@example.com
 * POST /api/unsubscribe-email-sequence with { email: "user@example.com" }
 */
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed" 
    });
  }

  try {
    await connectMongoDB();
    
    // Get email from query params or request body
    const email = req.method === "GET" 
      ? req.query.email 
      : req.body.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address format"
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user is already opted out
    if (user.email_sequence_opted_out) {
      return res.status(200).json({
        success: true,
        message: "You are already unsubscribed from our email sequence",
        alreadyUnsubscribed: true
      });
    }

    // Opt out the user
    await optOutEmailSequence(user._id);

    console.log(`User ${email} unsubscribed from email sequence`);

    return res.status(200).json({
      success: true,
      message: "You have been successfully unsubscribed from our email sequence. You will no longer receive these emails.",
      email: email
    });

  } catch (error) {
    console.error("Unsubscribe error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your unsubscribe request. Please try again later."
    });
  }
}
