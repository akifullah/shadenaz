import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-accent/30 to-background py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="text-center space-y-4">
              <p className="text-xs tracking-widest text-muted-foreground font-medium uppercase">About</p>
              <h1 className="text-5xl md:text-6xl font-light text-foreground">Shadenaz Aesthetics</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Redefining aesthetic excellence with precision, artistry, and unwavering commitment to your confidence
              </p>
            </div>
          </div>
        </div>

        {/* Brand Story */}
        <div className="py-20 border-b border-accent/30">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-light text-foreground">Our Philosophy</h2>
                <div className="space-y-4 text-foreground/80 leading-relaxed">
                  <p>
                    At Shadenaz Aesthetics, we believe that true beauty comes from confidence. Our mission is to enhance your natural features through expert aesthetic treatments that reflect your unique personality and desires.
                  </p>
                  <p>
                    Founded on principles of clinical excellence, artistic vision, and client-centered care, we've established ourselves as a trusted partner in aesthetic enhancement. Every treatment is a collaboration between art and science.
                  </p>
                  <p>
                    We're committed to using only premium products, advanced techniques, and maintaining the highest safety standards. Your satisfaction and safety are our absolute priorities.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full aspect-square bg-secondary/30 rounded border border-accent/50 flex items-center justify-center">
                  <Image
                    src="/shadenaz-logo.png"
                    alt="Shadenaz Aesthetics Logo"
                    width={200}
                    height={200}
                    className="w-32 h-32 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-20 border-b border-accent/30">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <h2 className="text-3xl font-light text-foreground mb-12 text-center">Why Choose Shadenaz Aesthetics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 p-6 border border-accent/50 hover:border-primary/50 transition">
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Expert Practitioners</h3>
                <p className="text-sm text-muted-foreground">
                  Highly trained professionals with extensive experience in aesthetic treatments and latest techniques
                </p>
              </div>

              <div className="space-y-3 p-6 border border-accent/50 hover:border-primary/50 transition">
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Premium Products</h3>
                <p className="text-sm text-muted-foreground">
                  Only FDA-approved and clinically tested products for safety and superior results
                </p>
              </div>

              <div className="space-y-3 p-6 border border-accent/50 hover:border-primary/50 transition">
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Natural Results</h3>
                <p className="text-sm text-muted-foreground">
                  Customized treatments that enhance your features while maintaining your natural beauty
                </p>
              </div>

              <div className="space-y-3 p-6 border border-accent/50 hover:border-primary/50 transition">
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Transparent Process</h3>
                <p className="text-sm text-muted-foreground">
                  Clear communication about procedures, expectations, and aftercare guidance
                </p>
              </div>

              <div className="space-y-3 p-6 border border-accent/50 hover:border-primary/50 transition">
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Personalized Care</h3>
                <p className="text-sm text-muted-foreground">
                  One-on-one consultation to understand your goals and create your ideal treatment plan
                </p>
              </div>

              <div className="space-y-3 p-6 border border-accent/50 hover:border-primary/50 transition">
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">After-care Support</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive guidance and follow-up support to maximize your treatment results
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-20">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-10 text-center space-y-8">
            <h2 className="text-3xl font-light text-foreground">Begin Your Aesthetic Journey</h2>
            <p className="text-lg text-muted-foreground">
              Schedule your consultation today and discover how Shadenaz Aesthetics can help you achieve your beauty goals
            </p>
            <a
              href="/booking"
              className="inline-block bg-primary text-primary-foreground px-12 py-4 hover:opacity-90 transition text-sm tracking-widest font-medium"
            >
              BOOK YOUR CONSULTATION
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
