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

    if (!user || !user.customer_id) {
      return res.status(400).json({ message: "No active subscription found" });
    }

    // Create a Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.customer_id,
      return_url: `${req.headers.origin || process.env.NEXTAUTH_URL}`,
    });

    // Redirect to the portal
    return res.redirect(303, portalSession.url);
  } catch (error) {
    console.error("Error creating portal session:", error);
    return res.status(500).json({ message: "Error creating portal session" });
  }
}
