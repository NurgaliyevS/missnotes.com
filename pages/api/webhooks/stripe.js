import Stripe from "stripe";
import { buffer } from "micro";
import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";
import sendTelegramNotification from "@/utils/sendTelegramNotification";

// Use test key for local development, production key for production
const isDevelopment = process.env.NODE_ENV === 'development';
const stripeKey = isDevelopment ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY;
const webhookSecret = isDevelopment ? process.env.STRIPE_WEBHOOK_SECRET_TEST : process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(stripeKey);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectMongoDB();

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata;
    const customerName = session?.customer_details?.name;

    console.log("Processing checkout.session.completed:", {
      mode: session.mode,
      plan: metadata.plan,
      customer: session.customer,
      subscription: session.subscription
    });

    // Handle one-time payments (one-year-pass) vs subscriptions
    let subscription = null;
    let isInTrial = false;
    let trialEndsAt = null;
    let subscriptionEndDate = null;

    if (session.mode === 'subscription' && session.subscription) {
      try {
        subscription = await stripe.subscriptions.retrieve(session.subscription);
        console.log("Retrieved subscription:", subscription.id, subscription.status);
        
        isInTrial = subscription?.status === "trialing";
        
        // Safely handle trial end date
        if (isInTrial && subscription.trial_end) {
          try {
            trialEndsAt = new Date(subscription.trial_end * 1000).toISOString();
          } catch (dateError) {
            console.error("Error parsing trial_end:", dateError);
            // Fallback: set trial period for Pro plan
            if (metadata.plan === "pro") {
              const trialEnd = new Date();
              trialEnd.setDate(trialEnd.getDate() + 7);
              trialEndsAt = trialEnd.toISOString();
            }
          }
        }
        
        // Safely handle subscription end date
        if (subscription.current_period_end) {
          try {
            subscriptionEndDate = new Date(subscription.current_period_end * 1000).toISOString();
          } catch (dateError) {
            console.error("Error parsing current_period_end:", dateError);
            // Fallback: set subscription end date
            if (metadata.plan === "pro") {
              const subscriptionEnd = new Date();
              subscriptionEnd.setDate(subscriptionEnd.getDate() + 7);
              subscriptionEndDate = subscriptionEnd.toISOString();
            }
          }
        }
      } catch (error) {
        console.error("Error retrieving subscription:", error);
        // Fallback: set trial period for Pro plan
        if (metadata.plan === "pro") {
          isInTrial = true;
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 7);
          trialEndsAt = trialEnd.toISOString();
          subscriptionEndDate = trialEnd.toISOString();
        }
      }
    } else if (session.mode === 'payment') {
      // One-time payment - set end date to 12 months from now
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      subscriptionEndDate = oneYearFromNow.toISOString();
    }

    // Determine meetings available based on plan
    let meetingsAvailable = 0;
    if (metadata.plan === "pro") {
      meetingsAvailable = -1; // -1 means unlimited
    } else if (metadata.plan === "one-year-pass") {
      meetingsAvailable = -1; // -1 means unlimited
    }

    const payload = {
      subscription_id: session.subscription || null,
      variant_name: metadata.plan,
      subscription_renews_at: subscriptionEndDate,
      ends_at: subscriptionEndDate,
      customer_id: session.customer,
      customer_name: customerName,
      meetings_available: meetingsAvailable,
      is_in_trial: isInTrial,
      trial_ends_at: trialEndsAt,
    };

    // Get email from the session
    if (session?.customer_details?.email) {
      payload.email = session.customer_details.email;
    } else if (session?.customer_email) {
      payload.email = session.customer_email;
    }

    console.log("User payload:", payload);

    let message;
    if (session.mode === 'subscription') {
      message = `🎉 New Subscription Started!

👤 Customer ID: ${session.customer}
📧 Email: ${payload?.email}
⭐ Plan: ${payload?.variant_name}
📝 Meetings Available: ${meetingsAvailable === -1 ? 'Unlimited' : meetingsAvailable}
👋 Customer Name: ${payload?.customer_name}`;
    } else {
      message = `🎉 New One-Time Payment!

👤 Customer ID: ${session.customer}
📧 Email: ${payload?.email}
⭐ Plan: ${payload?.variant_name}
📝 Meetings Available: ${meetingsAvailable === -1 ? 'Unlimited' : meetingsAvailable}
👋 Customer Name: ${payload?.customer_name}`;
    }
    
    try {
      await sendTelegramNotification({ message });
    } catch (error) {
      console.error("Error sending Telegram notification:", error);
    }

    // Find user by email or create new one
    let user = await User.findOne({ email: payload.email });
    
    if (user) {
      console.log("Updating existing user:", payload.email);
      await User.findOneAndUpdate(
        { email: payload.email },
        { $set: payload },
        { new: true }
      );
    } else {
      console.log("Creating new user:", payload.email);
      user = await User.create(payload);
    }
    
    // Pause email sequence since user has purchased
    if (user && user._id) {
      try {
        await User.findByIdAndUpdate(
          user._id,
          { $set: { email_sequence_paused: true } }
        );
        console.log("Email sequence paused for user:", payload.email);
      } catch (error) {
        console.error("Error pausing email sequence:", error);
        // Don't fail the webhook if email sequence pause fails
      }
    }
    
    console.log("User updated/created successfully");
  }

  if (event.type === "customer.subscription.updated") {
    try {
      const subscription = event.data.object;
      console.log("Processing customer.subscription.updated:", subscription.id, subscription.status);

      // Check if the subscription status has changed from trial to active
      const isInTrial = subscription?.status === "trialing";
      let trialEndsAt = null;

      // Safely handle trial end date
      if (isInTrial && subscription.trial_end) {
        try {
          trialEndsAt = new Date(subscription.trial_end * 1000).toISOString();
        } catch (dateError) {
          console.error("Error parsing trial_end in subscription.updated:", dateError);
        }
      }

      const payload = {
        is_in_trial: isInTrial,
        trial_ends_at: trialEndsAt,
      };

      // if the subscription has been cancelled
      if (subscription?.cancel_at_period_end) {
        payload.subscription_renews_at = null;
        // Keep meetings_available as -1 until the subscription actually ends
        // The subscription will still be active until the current period ends
      }

      await User.findOneAndUpdate(
        { customer_id: subscription.customer },
        { $set: payload }
      );
      
      console.log("Subscription updated successfully");
    } catch (error) {
      console.error("Error processing customer.subscription.updated:", error);
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    try {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      
      console.log("Processing invoice.payment_succeeded:", invoice.id, subscriptionId);

      // Retrieve full subscription details
      let subscription = null;
      try {
        subscription = await stripe.subscriptions.retrieve(subscriptionId);
      } catch (error) {
        console.error("Error retrieving subscription for invoice:", error);
        return;
      }

      const user = await User.findOne({ customer_id: invoice.customer });

      const payload = {
        // Don't reset subscription_renews_at to null initially
        // It will be set below if we have a valid period_end
      };

      // Safely handle period end date
      if (invoice.period_end) {
        try {
          payload.subscription_renews_at = new Date(invoice.period_end * 1000).toISOString();
        } catch (dateError) {
          console.error("Error parsing invoice period_end:", dateError);
        }
      }

      // Safely handle subscription cancel date
      if (subscription?.cancel_at) {
        try {
          payload.ends_at = new Date(subscription.cancel_at * 1000).toISOString();
        } catch (dateError) {
          console.error("Error parsing subscription cancel_at:", dateError);
        }
      }

      // Check if this payment marks the end of a trial period
      if (invoice.billing_reason === "subscription_cycle") {
        payload.is_in_trial = false;
        payload.trial_ends_at = null;
      }

      if (user) {
        const userPlan = user.variant_name;
        if (userPlan === "pro") {
          payload.meetings_available = -1; // Unlimited
        } else if (userPlan === "one-year-pass") {
          payload.meetings_available = -1; // Unlimited
        }

        await User.findOneAndUpdate(
          { customer_id: invoice.customer },
          { $set: payload }
        );
        
        console.log("Invoice payment processed successfully");
      }
    } catch (error) {
      console.error("Error processing invoice.payment_succeeded:", error);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    try {
      const subscription = event.data.object;
      console.log("Processing customer.subscription.deleted:", subscription.id);

      const payload = {
        variant_name: "free", // Reset to free plan
        subscription_renews_at: null,
        ends_at: new Date().toISOString(), // Set to current date since it's canceled immediately
        subscription_id: null, // Optional: Clear the subscription ID
        is_in_trial: false,
        trial_ends_at: null,
        meetings_available: 0,
      };

      await User.findOneAndUpdate(
        { customer_id: subscription.customer },
        { $set: payload }
      );
      
      console.log("Subscription deleted successfully");
    } catch (error) {
      console.error("Error processing customer.subscription.deleted:", error);
    }
  }

  return res.status(200).json({ received: true });
}
