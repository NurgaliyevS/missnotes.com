import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";

// Use test key for local development, production key for production
const isDevelopment = process.env.NODE_ENV === 'development';
const stripeKey = isDevelopment ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectMongoDB();
  
  try {
    const session = await getServerSession(req, res, authOptions);
    const { plan, planDetails } = req.body;

    console.log("Creating checkout for plan:", plan, planDetails);

    // Define plan configurations
    const planConfigs = {
      'pro': {
        price: 700, // $7.00 in cents
        interval: 'month',
        trial_period_days: 3,
        description: "For ADHDers. Unlimited meetings, PDF export, custom branding, priority support."
      },
      'one-year-pass': {
        price: 4900, // $49.00 in cents
        interval: 'month',
        trial_period_days: 0,
        description: "For ADHDers who want to save money. Unlimited meetings, PDF export, custom branding, priority support. 12 months access."
      }
    };

    const planConfig = planConfigs[plan];
    if (!planConfig) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const createLink = {
      mode: plan === 'one-year-pass' ? "payment" : "subscription",
      allow_promotion_codes: true,
      custom_fields: [
        {
          key: "company_name",
          label: {
            type: "custom",
            custom: "Company Name",
          },
          type: "text",
          optional: true,
        },
      ],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Miss Notes - ${planDetails.name}`,
              description: planConfig.description,
              metadata: {
                plan: plan,
                meetings_available: -1, // Unlimited for both plans
              },
            },
            unit_amount: planConfig.price,
            recurring: plan === 'one-year-pass' ? undefined : {
              interval: planConfig.interval,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/upload`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/#pricing`,
      metadata: {
        plan: plan,
        meetings_available: -1,
        plan_name: planDetails.name,
      },
    };

    // Add trial period for subscription plans
    if (plan === 'pro' && planConfig.trial_period_days > 0) {
      createLink.subscription_data = {
        trial_period_days: planConfig.trial_period_days,
      };
    }

    // Handle existing customers
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (user && user.customer_id) {
        createLink.customer = user.customer_id;
        createLink.metadata.userId = user.customer_id;
        
        // Try to retrieve existing customer
        try {
          const customer = await stripe.customers.retrieve(String(user.customer_id));
          console.log("Existing customer found:", customer.id);
        } catch (error) {
          console.error("Error retrieving customer:", error);
        }
      } else {
        // Only set customer_email if we don't have a customer_id
        createLink.customer_email = session.user.email;
      }
    }

    console.log("Creating Stripe checkout with config:", createLink);

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create(createLink);

    console.log("Checkout session created:", checkoutSession.id);

    return res.status(200).json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}