import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectMongoDB();
    
    // Get the current session
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    
    console.log("Found user:", {
      email: session.user.email,
      user: user ? {
        variant_name: user.variant_name,
        meetings_available: user.meetings_available,
        is_in_trial: user.is_in_trial,
        trial_ends_at: user.trial_ends_at,
        subscription_renews_at: user.subscription_renews_at,
        ends_at: user.ends_at
      } : null
    });
    
    if (!user) {
      // Return default free user status
      return res.status(200).json({
        variant_name: "free",
        meetings_available: 0,
        is_in_trial: false,
        trial_ends_at: null,
        subscription_renews_at: null,
        ends_at: null
      });
    }

    // Check if subscription is still active
    let isActive = false;
    let meetingsAvailable = user.meetings_available || 0;

    // Check if user is in trial period
    if (user.is_in_trial && user.trial_ends_at) {
      const trialEndsAt = new Date(user.trial_ends_at);
      if (trialEndsAt > new Date()) {
        isActive = true;
        meetingsAvailable = -1; // Unlimited during trial
      }
    }

    // Check if subscription is still active
    if (user.subscription_renews_at) {
      const renewsAt = new Date(user.subscription_renews_at);
      if (renewsAt > new Date()) {
        isActive = true;
        if (user.variant_name === "pro" || user.variant_name === "one-year-pass") {
          meetingsAvailable = -1; // Unlimited
        }
      }
    }
    
    // For one-year-pass, also check ends_at
    if (user.variant_name === "one-year-pass" && user.ends_at) {
      const endsAt = new Date(user.ends_at);
      if (endsAt > new Date()) {
        isActive = true;
        meetingsAvailable = -1; // Unlimited
      }
    }

    // If subscription has ended, reset to free
    if (!isActive && user.variant_name !== "free") {
      await User.findOneAndUpdate(
        { email: session.user.email },
        { 
          $set: {
            variant_name: "free",
            meetings_available: 0,
            is_in_trial: false,
            trial_ends_at: null
          }
        }
      );
      
      return res.status(200).json({
        variant_name: "free",
        meetings_available: 0,
        is_in_trial: false,
        trial_ends_at: null,
        subscription_renews_at: null,
        ends_at: null
      });
    }

    // Return current subscription status
    return res.status(200).json({
      variant_name: user.variant_name || "free",
      meetings_available: meetingsAvailable,
      is_in_trial: user.is_in_trial || false,
      trial_ends_at: user.trial_ends_at,
      subscription_renews_at: user.subscription_renews_at,
      ends_at: user.ends_at,
      customer_id: user.customer_id,
      subscription_id: user.subscription_id
    });

  } catch (error) {
    console.error("Error checking subscription status:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}
