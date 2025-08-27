import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Zap, Crown, AlertCircle } from "lucide-react";
import { handleCheckout } from "@/lib/checkout";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function SubscriptionCheck({ children }) {
  const { data: session } = useSession();
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  useEffect(() => {
    if (session?.user?.email) {
      checkUserSubscription();
    }
  }, [session]);

  const checkUserSubscription = async () => {
    try {
      const response = await fetch("/api/user/subscription-status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserSubscription(data);
      } else {
        setUserSubscription({ variant_name: "free", meetings_available: 0 });
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setUserSubscription({ variant_name: "free", meetings_available: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutLocal = async (plan, planDetails) => {
    await handleCheckout(plan, planDetails, setCheckoutLoading);
  };

  const hasActiveSubscription = () => {
    if (!userSubscription) return false;

    // Check if user has unlimited meetings (pro or one-year-pass)
    if (userSubscription.meetings_available === -1) return true;

    // Check if user is in trial period
    if (userSubscription.is_in_trial) {
      const trialEndsAt = new Date(userSubscription.trial_ends_at);
      return trialEndsAt > new Date();
    }

    // Check if subscription is still active
    if (userSubscription.subscription_renews_at) {
      const renewsAt = new Date(userSubscription.subscription_renews_at);
      return renewsAt > new Date();
    }

    return false;
  };

  const getTrialDaysLeft = () => {
    if (!userSubscription?.is_in_trial || !userSubscription?.trial_ends_at)
      return 0;

    const trialEndsAt = new Date(userSubscription.trial_ends_at);
    const now = new Date();
    const diffTime = trialEndsAt - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Checking subscription...</p>
        </div>
      </div>
    );
  }

  // If user has active subscription, show the content
  if (hasActiveSubscription()) {
    return (
      <div>
        {/* Trial Banner */}
        {userSubscription?.is_in_trial && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
            <div className="max-w-6xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Free Trial Active - {getTrialDaysLeft()} days remaining
                  </span>
                </div>
                <Link href="/#pricing">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {children}
      </div>
    );
  }

  // Paywall for users without subscription
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Unlock Premium Features
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Start your free trial to access meeting transcription,
            summaries, and action items.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unlimited Meetings</h3>
            <p className="text-slate-600 text-sm">
              Transcribe and analyze meeting recordings
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unlimited Summaries</h3>
            <p className="text-slate-600 text-sm">
              Get meeting summaries and action items
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Export & Share</h3>
            <p className="text-slate-600 text-sm">
              Share as PDF or link with your people
            </p>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="gap-4 md:gap-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center mb-12">
          {/* Pro Plan */}
          <div className="w-full md:max-w-xs relative bg-card p-6 md:p-8 rounded-2xl shadow-soft border border-blue-200 animate-fade-up hover:shadow-medium transition-all duration-300">
            <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                Most Popular
              </Badge>
            </div>
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-2">
                <span className="text-3xl md:text-4xl font-bold">$7</span>
                <span className="text-sm md:text-base text-muted-foreground">
                  /per month
                </span>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                For active ADHDers
              </p>
            </div>
            <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </div>
                <span className="text-sm md:text-base">7 day free trial (cancel anytime)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </div>
                <span className="text-sm md:text-base">Unlimited meetings</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </div>
                <span className="text-sm md:text-base">Unlimited transcriptions</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </div>
                <span className="text-sm md:text-base">PDF export</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </div>
                <span className="text-sm md:text-base">Link sharing</span>
              </li>
            </ul>
            <Button
              variant="hero"
              size="lg"
              className="w-full text-sm md:text-base"
              onClick={() => handleCheckoutLocal("pro", { name: "Pro" })}
              disabled={checkoutLoading === "pro"}
            >
              {checkoutLoading === "pro" ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs md:text-sm">Processing...</span>
                </div>
              ) : (
                "Start 7 Day Free Trial"
              )}
            </Button>
          </div>

          {/* One Year Pass */}
          <div className="w-full md:max-w-xs relative bg-card p-6 md:p-8 rounded-2xl shadow-soft border border-purple-200 animate-fade-up hover:shadow-glow hover:scale-105 bg-gradient-to-br from-card to-primary/5 border-primary transition-all duration-300">
            <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold flex items-center gap-1.5 md:gap-2 shadow-glow">
                <Zap className="w-3 h-3 md:w-4 md:h-4" />
                Best Value
              </Badge>
            </div>
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                One Year Access
              </h3>
              <div className="mb-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    $49
                  </span>
                  <span className="text-sm md:text-base text-muted-foreground">
                    /one time
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs md:text-sm">
                  <span className="line-through text-muted-foreground">
                    $84
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    Save 40%
                  </span>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                For ADHDers who want to save money
              </p>
            </div>
            <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </div>
                <span className="text-sm md:text-base">12 months access</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </div>
                <span className="text-sm md:text-base">Unlimited meetings</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </div>
                <span className="text-sm md:text-base">
                  Unlimited transcriptions
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </div>
                <span className="text-sm md:text-base">PDF export</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </div>
                <span className="text-sm md:text-base">Link sharing</span>
              </li>
            </ul>
            <Button
              variant="default"
              size="lg"
              className="w-full text-sm md:text-base bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 font-semibold"
              onClick={() =>
                handleCheckoutLocal("one-year-pass", {
                  name: "One Year Access",
                })
              }
              disabled={checkoutLoading === "one-year-pass"}
            >
              {checkoutLoading === "one-year-pass" ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs md:text-sm">Processing...</span>
                </div>
              ) : (
                "Buy Now (12 months access)"
              )}
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-slate-600 mb-4">
            All plans include a 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
