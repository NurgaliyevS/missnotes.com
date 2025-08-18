import Stripe from "stripe";
import { buffer } from "micro";
import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";
import sendTelegramNotification from "@/src/lib/sendTelegramNotification";

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

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    // Check if the subscription is in trial period
    const isInTrial = subscription?.status === "trialing";

    console.log("subscription", subscription?.status);
    const trialEndsAt = isInTrial
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null;

    console.log("trialEndsAt", trialEndsAt);

    // Determine meetings available based on plan
    let meetingsAvailable = 0;
    if (metadata.plan === "pro") {
      meetingsAvailable = -1; // -1 means unlimited
    } else if (metadata.plan === "one-year-pass") {
      meetingsAvailable = -1; // -1 means unlimited
    }

    const payload = {
      subscription_id: session.subscription,
      variant_name: metadata.plan,
      subscription_renews_at: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
      customer_id: session.customer,
      customer_name: customerName,
      meetings_available: meetingsAvailable,
      is_in_trial: isInTrial,
      trial_ends_at: trialEndsAt,
    };

    if (session?.customer_details?.email) {
      payload.email = session.customer_details.email;
    }

    if (session?.customer_email) {
      payload.email = session.customer_email;
    }

    let message;
    message = `🎉 New Subscription Started!

👤 Customer ID: ${subscription.customer}
📧 Email: ${payload?.email}
⭐ Plan: ${payload?.variant_name}
📝 Meetings Available: ${meetingsAvailable === -1 ? 'Unlimited' : meetingsAvailable}
👋 Customer Name: ${payload?.customer_name}`;
    await sendTelegramNotification({ message });

    console.log(payload, "payload in checkout.session.completed");

    // Find user by email or create new one
    let user = await User.findOne({ email: payload.email });
    
    if (user) {
      await User.findOneAndUpdate(
        { email: payload.email },
        { $set: payload },
        { new: true }
      );
    } else {
      await User.create(payload);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;

    // Check if the subscription status has changed from trial to active
    const isInTrial = subscription?.status === "trialing";
    console.log(subscription.status, "subscription.status");
    const trialEndsAt = isInTrial
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null;
    console.log("trialEndsAt", trialEndsAt);

    const payload = {
      is_in_trial: isInTrial,
      trial_ends_at: trialEndsAt,
    };

    // if the subscription has been cancelled
    if (subscription?.cancel_at_period_end) {
      payload.subscription_renews_at = null;
    }

    console.log(payload, "payload in customer.subscription.updated");

    await User.findOneAndUpdate(
      { customer_id: subscription.customer },
      { $set: payload }
    );
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    const subscriptionId = invoice.subscription;

    // Retrieve full subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const user = await User.findOne({ customer_id: invoice.customer });

    const payload = {
      subscription_renews_at: new Date(invoice.period_end * 1000).toISOString(),
      ends_at: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000).toISOString()
        : null,
    };

    console.log(invoice.billing_reason, "invoice.billing_reason");
    console.log(user, 'user');

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

      console.log(payload, "payload in invoice.payment_succeeded");

      await User.findOneAndUpdate(
        { customer_id: invoice.customer },
        { $set: payload }
      );

      console.log(invoice?.billing_reason, 'invoice?.billing_reason');
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;

    const payload = {
      variant_name: "free", // Reset to free plan
      subscription_renews_at: null,
      ends_at: new Date().toISOString(), // Set to current date since it's canceled immediately
      subscription_id: null, // Optional: Clear the subscription ID
      is_in_trial: false,
      trial_ends_at: null,
      meetings_available: 0,
    };

    console.log(payload, "payload in customer.subscription.deleted");

    await User.findOneAndUpdate(
      { customer_id: subscription.customer },
      { $set: payload }
    );
  }

  return res.status(200).json({ received: true });
}
