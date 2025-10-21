import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload, Rocket, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-subtle py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 mb-4">
              <Rocket className="w-3 h-3 mr-2" />
              From ADHDers, for ADHDers
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6">
              Upload meeting audio. Get{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                notes & action items{" "}
              </span>{" "}
              in 2 minutes. Share instantly.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Fastest way to turn meeting recordings into
              summaries + action items. No setup, no distractions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <Link href="/upload" className="w-full sm:w-auto">
              <Button
                variant="hero"
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto shadow-soft hover:shadow-glow h-12 sm:h-14 flex items-center justify-center rounded-lg font-semibold"
              >
                <ArrowRight className="h-4 w-4" />
                Get Started
              </Button>
              </Link>
              <Link href="/upload" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full border-2 hover:bg-slate-50 transition-colors h-12 sm:h-14 flex items-center justify-center rounded-lg font-medium"
                >
                  <Upload className="h-4 w-4" />
                  Upload Audio Recording
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl">
            {/* Mobile image */}
            <img
              src="/hero-mobile.webp"
              alt="Remote workers collaborating with clear meeting notes"
              className="w-[300px] h-[300px] object-contain mx-auto rounded-3xl md:hidden"
            />
            {/* Desktop image */}
            <img
              src="/hero.webp"
              alt="Remote workers collaborating with clear meeting notes"
              className="hidden md:block w-[550px] h-[360px] object-contain mx-auto rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
