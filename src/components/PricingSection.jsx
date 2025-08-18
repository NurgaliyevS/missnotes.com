import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";

export var PricingSection = function () {
  var plans = [
    {
      name: "Pro",
      price: "$7",
      period: "per month",
      description: "For active remote workers",
      features: [
        "Unlimited meetings",
        "PDF export",
        "Custom branding",
        "Priority support",
      ],
      cta: "Start 7 Day Free Trial",
      popular: true,
    },
    {
      name: "One Year Pass",
      price: "$49",
      period: "one time",
      description: "For remote workers who want to save money",
      features: [
        "Unlimited meetings",
        "PDF export", 
        "Custom branding",
        "Priority support",
      ],
      cta: "Buy Now (12 months access)",
      popular: false,
      oneYearPass: true,
      savings: "40%",
      originalPrice: "$84"
    }
    // {
    //     name: "Team",
    //     price: "$25",
    //     period: "per month",
    //     description: "For teams and agencies",
    //     features: [
    //         "Up to 5 users",
    //         "Shared projects",
    //         "Team analytics",
    //         "Custom integrations"
    //     ],
    //     cta: "Start 7 Day Free Trial",
    //     popular: false
    // }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            Simple pricing that fits remote work
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works for you. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="gap-6 max-w-2xl mx-auto flex items-center justify-center">
          {plans.map(function (plan, index) {
            return (
              <div
                key={index}
                className={"max-w-xs relative bg-card p-8 rounded-2xl shadow-soft border animate-fade-up hover:shadow-medium transition-all duration-300 ".concat(
                  plan.popular
                    ? ""
                    : plan.oneYearPass
                    ? "shadow-soft hover:shadow-glow hover:scale-105 bg-gradient-to-br from-card to-primary/5 border-primary"
                    : "border-secondary shadow-soft"
                )}
                style={{ animationDelay: "".concat(index * 100, "ms") }}
              >
                {plan.oneYearPass && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-glow">
                      <Zap className="w-4 h-4" />
                      Best Value
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  
                  {plan.oneYearPass && (
                    <div className="mb-3">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold text-primary">{plan.price}</span>
                        <span className="text-muted-foreground">
                          /{plan.period}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="line-through text-muted-foreground">{plan.originalPrice}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                          Save {plan.savings}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {!plan.oneYearPass && (
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map(function (feature, featureIndex) {
                    return (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.oneYearPass && featureIndex >= 4 
                            ? "bg-primary/10 text-primary" 
                            : "text-primary"
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={plan.oneYearPass && featureIndex >= 4 ? "text-primary font-medium" : ""}>
                          {feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <Button
                  variant={plan.popular ? "hero" : plan.oneYearPass ? "default" : "outline"}
                  size="lg"
                  className={`w-full ${
                    plan.oneYearPass 
                      ? "bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 font-semibold" 
                      : ""
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            30-day money back guarantee.
          </p>
        </div>
      </div>
    </section>
  );
};
