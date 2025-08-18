import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { DemoSection } from "@/components/DemoSection";
import { SocialProofSection } from "@/components/SocialProofSection";
import { PricingSection } from "@/components/PricingSection";
import { ClosingCTASection } from "@/components/ClosingCTASection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <DemoSection />
      {/* not ready yet */}
      {/* <SocialProofSection /> */}
      <PricingSection />
      <ClosingCTASection />
    </main>
  );
};

export default Index;
