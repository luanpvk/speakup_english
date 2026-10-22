import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { LessonDemo } from "@/components/landing/lesson-demo";
import { Features } from "@/components/landing/features";
import { ThemesSection } from "@/components/landing/themes-section";
import { AvatarShowcase } from "@/components/landing/avatar-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AccessibilitySection } from "@/components/landing/accessibility-section";
import { ParentsSection } from "@/components/landing/parents-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <LessonDemo />
        <Features />
        <ThemesSection />
        <AvatarShowcase />
        <HowItWorks />
        <AccessibilitySection />
        <ParentsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
