import { Button } from "@/components/ui/button";
import Image from "next/image";
import heroImage from "@/assets/hero-remote-workers.jpg";
import { handleCheckout, defaultProPlan } from "@/lib/checkout";
import Link from "next/link";
import { Upload } from "lucide-react";

export var HeroSection = function () {
    return (<section className="relative overflow-hidden bg-gradient-subtle py-12 sm:py-16 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="animate-fade-up">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              Never leave a meeting{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                without clear notes
              </span>{" "}
              again.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Remote workers' fastest way to turn meeting recordings into summaries + action items. 
              No setup, no distractions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                onClick={() => handleCheckout(defaultProPlan.plan, defaultProPlan)}
              >
                Start 7 Day Free Trial
              </Button>
              <Link href="/upload" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Recording
                </Button>
              </Link>
            </div>
          </div>
          <div className="animate-fade-up delay-200 order-first lg:order-last">
            <Image src={heroImage} alt="Remote workers collaborating with clear meeting notes" className="w-full h-auto rounded-2xl shadow-large" width={600} height={400}/>
          </div>
        </div>
      </div>
    </section>);
};
