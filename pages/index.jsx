import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import AboutSection from "@/components/sections/AboutSection";
import TiredSection from "@/components/sections/TiredSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import VideoSection from "@/components/sections/VideoSection";
import { DemoSection } from "@/components/DemoSection";

export default function Home() {
  return (
    <>
      <SEO />
      <Navbar />
      <main className="min-h-screen bg-[#F3F4EF]">
        <div className="max-w-7xl mx-auto">
          <HeroSection />
          <FeaturesSection />
          <AboutSection />
          <TiredSection />
          <DemoSection />
          <PricingSection />
          {/* <PricingSection /> */}
          <FAQSection />
          <VideoSection />
          <Footer />
        </div>
      </main>
    </>
  );
}
