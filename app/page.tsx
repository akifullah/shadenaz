import { Header } from '@/components/header';
import { HeroSlider } from '@/components/hero-slider';
import { TreatmentsSection } from '@/components/treatments-section';
import { AboutSection } from '@/components/about-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full">
        <HeroSlider />
        <TreatmentsSection />
        <AboutSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
