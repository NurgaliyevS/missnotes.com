/**
 * Utility function to handle checkout process
 * @param {string} plan - The plan identifier (e.g., 'pro', 'one-year-pass')
 * @param {object} planDetails - The plan details object
 * @param {function} setLoading - Optional loading state setter function
 * @returns {Promise<void>}
 */
export const handleCheckout = async (plan, planDetails, setLoading = null) => {
  if (setLoading) {
    setLoading(plan);
  }
  
  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan: plan,
        planDetails: planDetails
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();
    
    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Failed to create checkout session. Please try again.');
  } finally {
    if (setLoading) {
      setLoading(null);
    }
  }
};

/**
 * Default plan details for the Pro plan (7-day free trial)
 */
export const defaultProPlan = {
  name: "Pro",
  plan: "pro",
  price: "$7",
  period: "per month",
  description: "For active ADHDers",
  features: [
    "Unlimited meetings",
    "PDF export",
    "Custom branding",
    "Priority support",
  ],
  cta: "Start 7 Day Free Trial",
  popular: true,
};
