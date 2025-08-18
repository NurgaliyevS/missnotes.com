import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Pro",
      price: "$7",
      period: "per month",
      description: "For active remote workers",
      features: [
        "Unlimited meetings",
        "PDF export",
        "Custom branding",
        "Priority support"
      ],
      cta: "Start 7 Day Free Trial",
      popular: true
    },
    {
      name: "Team",
      price: "$25",
      period: "per month",
      description: "For teams and agencies",
      features: [
        "Up to 5 users",
        "Shared projects",
        "Team analytics",
        "Custom integrations"
      ],
      cta: "Start 7 Day Free Trial",
      popular: false
    }
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

        <div className="grid lg:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`max-w-xs relative bg-card p-8 rounded-2xl shadow-soft border animate-fade-up hover:shadow-medium transition-all duration-300 ${
                plan.popular 
                  ? "border-primary shadow-glow scale-105" 
                  : "border-secondary shadow-soft"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? "hero" : "outline"} 
                size="lg" 
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include 7-day free trial • 14-day money back guarantee.
          </p>
        </div>
      </div>
    </section>
  );
};