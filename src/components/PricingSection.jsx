import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";
import { isDevelopment } from "@/utils/isDevelopment";
import { useState } from "react";
import { handleCheckout } from "@/lib/checkout";
import { ArrowRight } from "lucide-react";

export default function PricingSection() {
  const [loading, setLoading] = useState(null);

  const plans = [
    {
      name: "Pro",
      plan: "pro",
      price: "$7",
      period: "per month",
      description: "For active ADHDers",
      features: [
        "7 day free trial (cancel anytime)",
        "Unlimited meetings",
        "Unlimited transcriptions",
        "PDF export",
        "Link sharing"
      ],
      cta: "Start 7 Day Free Trial",
      popular: true,
    },
    {
      name: "One Year Access",
      plan: "one-year-pass",
      price: "$49",
      period: "one time",
      description: "For ADHDers who want to save money",
      features: [
        "12 months access",
        "Unlimited meetings",
        "Unlimited transcriptions",
        "PDF export",
        "Link sharing",
      ],
      cta: "Buy Now (12 months access)",
      popular: false,
      oneYearPass: true,
      savings: "40%",
      originalPrice: "$84"
    }
  ];

  const handleCheckoutLocal = async (plan, planDetails) => {
    await handleCheckout(plan, planDetails, setLoading);
  };

  return (
    <section id="pricing" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Simple pricing that fits ADHDers
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground px-4">
            Choose the plan that fits you. Cancel anytime.
          </p>
        </div>

        <div className="gap-4 md:gap-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center">
          {plans.map(function (plan, index) {
            return (
              <div
                key={index}
                className={"w-full md:max-w-md relative bg-card p-6 md:p-8 rounded-2xl shadow-soft border animate-fade-up hover:shadow-medium transition-all duration-300 ".concat(
                  plan.popular
                    ? ""
                    : plan.oneYearPass
                    ? "shadow-soft hover:shadow-glow hover:scale-105 bg-gradient-to-br from-card to-primary/5 border-primary"
                    : "border-secondary shadow-soft"
                )}
                style={{ animationDelay: "".concat(index * 100, "ms") }}
              >
                {plan.oneYearPass && (
                  <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold flex items-center gap-1.5 md:gap-2 shadow-glow">
                      <Zap className="w-3 h-3 md:w-4 md:h-4" />
                      Best Value
                    </span>
                  </div>
                )}

                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                  
                  {plan.oneYearPass && (
                    <div className="mb-3">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-3xl md:text-4xl font-bold text-primary">{plan.price}</span>
                        <span className="text-sm md:text-base text-muted-foreground">
                          /{plan.period}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs md:text-sm">
                        <span className="line-through text-muted-foreground">{plan.originalPrice}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                          Save {plan.savings}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {!plan.oneYearPass && (
                    <div className="mb-2">
                      <span className="text-3xl md:text-4xl font-bold">{plan.price}</span>
                      <span className="text-sm md:text-base text-muted-foreground">
                        /{plan.period}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm md:text-base text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {plan.features.map(function (feature, featureIndex) {
                    return (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.oneYearPass && featureIndex >= 5 
                            ? "bg-primary/10 text-primary" 
                            : "text-primary"
                        }`}>
                          <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        </div>
                        <span className={`text-sm md:text-base ${plan.oneYearPass && featureIndex >= 5 ? "text-primary font-medium" : ""}`}>
                          {feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <Button
                  variant={plan.popular ? "hero" : plan.oneYearPass ? "default" : "outline"}
                  size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto shadow-soft hover:shadow-glow h-12 sm:h-14 flex items-center justify-center rounded-lg font-semibold mx-auto"
                  onClick={() => handleCheckoutLocal(plan.plan, plan)}
                  disabled={loading === plan.plan}
                >
                  {loading === plan.plan ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs md:text-sm">Processing...</span>
                    </div>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      {plan.cta}
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-sm md:text-base text-muted-foreground px-4">
            30-day money back guarantee.
          </p>
        </div>
      </div>
    </section>
  );
};
