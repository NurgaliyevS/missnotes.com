import { Button } from "@/components/ui/button";
import Image from "next/image";
import heroImage from "@/assets/hero-remote-workers.jpg";
import { handleCheckout, defaultProPlan } from "@/lib/checkout";
import Link from "next/link";
import { Upload } from "lucide-react";

export var HeroSection = function () {
    return (<section className="relative overflow-hidden bg-gradient-subtle py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Never leave a meeting{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                without clear notes
              </span>{" "}
              again.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Remote workers' fastest way to turn meeting recordings into summaries + action items. 
              No setup, no distractions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => handleCheckout(defaultProPlan.plan, defaultProPlan)}
              >
                Start 7 Day Free Trial
              </Button>
              <Link href="/upload">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Recording
                </Button>
              </Link>
            </div>
          </div>
          <div className="animate-fade-up delay-200">
            <Image src={heroImage} alt="Remote workers collaborating with clear meeting notes" className="w-full h-auto rounded-2xl shadow-large" width={600} height={400}/>
          </div>
        </div>
      </div>
    </section>);
};
