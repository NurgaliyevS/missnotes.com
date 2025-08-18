import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Access cookies from the request
  const visitorId = req?.cookies?.datafast_visitor_id;
  const sessionId = req?.cookies?.datafast_session_id;

  console.log("visitorId", visitorId);
  console.log("sessionId", sessionId);
  
  await connectMongoDB();
  
  try {
    const session = await getServerSession(req, res, authOptions);

    const { plan, planDetails, billingCycle } = req.body;

    const createLink = {
      mode: "subscription",
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
              metadata: {
                meetings_available: planDetails.meetings_available,
              },
            },
            unit_amount: planDetails.price,
            recurring: {
              interval: billingCycle === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/onboarding`,
      cancel_url: `${process.env.NEXTAUTH_URL}#pricing`,
      metadata: {
        plan,
        meetings_available: planDetails.meetings_available,
        billingCycle,
        visitorId,
        sessionId,
      },
    };

    // Set description based on plan
    if (planDetails.name === "Pro") {
      createLink.line_items[0].price_data.product_data.description = "For active remote workers. Unlimited meetings, PDF export, custom branding, priority support.";
    } else if (planDetails.name === "One Year Pass") {
      createLink.line_items[0].price_data.product_data.description = "For remote workers who want to save money. Unlimited meetings, PDF export, custom branding, priority support. 12 months access.";
    } else {
      const billingText = billingCycle === "yearly" ? "year" : "month";
      createLink.line_items[0].price_data.product_data.description = `Remote workers' fastest way to turn meeting recordings into summaries + action items. ${planDetails.meetings_available} meetings per ${billingText}. 30 days money back guarantee.`;
    }

    // Handle existing customers
    if (session?.user?.name) {
      const user = await User.findOne({ name: session.user.name });
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
      }
    }

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create(createLink);

    return res.status(200).json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}