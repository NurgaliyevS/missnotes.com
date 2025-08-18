import { Button } from "@/components/ui/button";
import { Upload, Zap, Share2 } from "lucide-react";
import Image from "next/image";
import processImage from "@/assets/process-steps.jpg";

export const DemoSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload your meeting recording",
      description: "Zoom, Google Meet, Teams"
    },
    {
      icon: Zap,
      title: "AI Transcribes & Summarizes instantly",
      description: "Smart analysis in under 2 minutes"
    },
    {
      icon: Share2,
      title: "Share as link or PDF",
      description: "Send to your client/team immediately"
    }
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-primary/5"></div>
      <div className="absolute top-10 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            From recording to actionable notes in{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              3 clicks
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Steps Column */}
          <div className="relative">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="group relative animate-fade-up hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-border/30 hover:border-primary/20 relative">
                    <div className="flex gap-5 items-start">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow group-hover:animate-glow">
                          <step.icon className="w-8 h-8 text-primary-foreground" />
                        </div>
                        {/* Step number badge */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground text-sm font-bold rounded-full flex items-center justify-center shadow-medium">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image Column */}
          <div className="relative animate-fade-up delay-200">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl transform scale-105"></div>
              <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-4 shadow-large border border-border/30">
                <Image
                  src={processImage}
                  alt="Simple 3-step process illustration"
                  className="w-full h-auto rounded-2xl"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-xl opacity-30 transform scale-110"></div>
            <Button variant="hero" size="lg" className="relative text-lg px-8 py-4 shadow-glow hover:shadow-large transition-all duration-300">
              Start 7 Day Free Trial
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};