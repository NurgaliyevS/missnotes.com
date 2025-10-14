import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";

const isDevelopment = process.env.NODE_ENV === 'development';
const stripeKey = isDevelopment ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeKey);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the user's session
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Connect to MongoDB and get user
    await connectMongoDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    let customerId = user.customer_id;

    // Verify the customer exists in Stripe, or find/create one
    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId);
      } catch (error) {
        if (error.code === 'resource_missing') {
          console.log(`Customer ${customerId} not found in Stripe, attempting recovery...`);
          customerId = null; // Will trigger search/creation below
        } else {
          throw error;
        }
      }
    }

    // If no valid customer ID, try to find by email or create new
    if (!customerId) {
      // Search for existing customer by email
      const customers = await stripe.customers.list({
        email: session.user.email,
        limit: 1
      });

      if (customers.data.length > 0) {
        // Found existing customer, update database
        customerId = customers.data[0].id;
        console.log(`Found existing Stripe customer ${customerId} for ${session.user.email}`);
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: session.user.email,
          name: session.user.name,
          metadata: {
            userId: user._id.toString()
          }
        });
        customerId = customer.id;
        console.log(`Created new Stripe customer ${customerId} for ${session.user.email}`);
      }

      // Update user record with correct customer ID
      await User.updateOne(
        { email: session.user.email },
        { $set: { customer_id: customerId } }
      );
    }

    // Verify customer has subscriptions before creating portal session
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return res.status(400).json({ 
        message: "No active subscription found. Please subscribe first." 
      });
    }

    // Create a Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.origin || process.env.NEXTAUTH_URL}`,
    });

    // Redirect to the portal
    return res.redirect(303, portalSession.url);
  } catch (error) {
    console.error("Error creating portal session:", error);
    return res.status(500).json({ 
      message: "Error creating portal session",
      error: isDevelopment ? error.message : undefined
    });
  }
}
