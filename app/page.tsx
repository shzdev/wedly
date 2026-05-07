import { Footer } from "@/components/site/footer";
import { CreateEventForm } from "@/components/wedly/create-event-form";
import { HeroSection } from "@/components/wedly/hero-section";
import { HowItWorks } from "@/components/wedly/how-it-works";
import { PreviewSection } from "@/components/wedly/preview-section";
import { StatsStrip } from "@/components/wedly/stats-strip";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-deep">
      <main>
        <HeroSection />
        <StatsStrip />
        <CreateEventForm />
        <HowItWorks />
        <PreviewSection />
      </main>
      <Footer />
    </div>
  );
}
