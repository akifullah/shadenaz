'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export default function AboutPage() {
  const story = useInView(0.1);
  const video = useInView(0.1);
  const values = useInView(0.1);
  const cta = useInView(0.1);

  return (
    <>
      <Header />
      <main className="w-full bg-background overflow-hidden">

        {/* ── Hero Section ── */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-background to-background" />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
            style={{
              background: 'radial-gradient(circle, var(--foreground) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 text-center py-28">
            <p
              className="text-xs tracking-[0.35em] text-muted-foreground font-medium uppercase mb-6 opacity-0 animate-[fadeSlideUp_0.8s_0.2s_ease-out_forwards]"
            >
              Our Story
            </p>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-light text-foreground leading-[1.1] tracking-tight opacity-0 animate-[fadeSlideUp_0.8s_0.4s_ease-out_forwards]"
            >
              About <span className="font-extralight">Shadenaz</span>
            </h1>
            <p
              className="mt-8 text-lg sm:text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed opacity-0 animate-[fadeSlideUp_0.8s_0.6s_ease-out_forwards]"
            >
              Ethical aesthetics rooted in care, confidence, and a personalised approach — one client at a time
            </p>

            {/* Decorative line */}
            <div className="mt-12 flex justify-center opacity-0 animate-[fadeSlideUp_0.8s_0.8s_ease-out_forwards]">
              <div className="w-16 h-[1px] bg-primary/30" />
            </div>
          </div>
        </section>

        {/* ── Brand Story Section ── */}
        <section
          ref={story.ref}
          className="py-24 md:py-32"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

              {/* Text Column */}
              <div
                className={`space-y-8 transition-all duration-1000 ease-out ${story.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-12'
                  }`}
              >
                <div className="space-y-3">
                  <p className="text-xs tracking-[0.3em] text-muted-foreground font-medium uppercase">
                    The Founder
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-light text-foreground leading-snug">
                    Hi, I'm <span className="">Shadenaz.</span>
                  </h2>
                </div>

                <div className="space-y-5 text-foreground/75 leading-[1.85] text-[15px] sm:text-base">
                  <p>
                    For me, aesthetics has never been about changing people or making them look like someone else.
                    It's about listening, understanding someone's story, and helping them feel like the best, most
                    confident version of themselves.
                  </p>
                  <p>
                    I take a very ethical and considered approach to my work. That means I don't rush decisions and
                    I don't believe in performing treatments during emotional or difficult periods in a client's life.
                    Instead, I focus on long-term, subtle enhancements and ensuring every client feels 100% confident
                    and certain about any decision they make.
                  </p>
                  <p>
                    I work from a private home clinic designed to feel calm, welcoming, and discreet — much like
                    your own home. It's a space where you can feel comfortable with only one client in the treatment
                    room at a time.
                  </p>
                  <p className="italic text-foreground/60 text-sm">— Thank you, Shadenaz</p>
                </div>
              </div>

              {/* Image Column */}
              <div
                className={`flex items-center justify-center transition-all duration-1000 ease-out delay-200 ${story.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-12'
                  }`}
              >
                <div className="relative group">
                  {/* Background accent */}
                  <div className="absolute -top-4 -right-4 w-full h-full bg-accent/30 rounded-sm transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />

                  <div className="relative w-[280px] sm:w-[320px] aspect-[9/14] overflow-hidden rounded-sm shadow-lg">
                    <Image
                      src="/about me.jpg"
                      alt="Shadenaz — Founder of Shadenaz Aesthetics"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 280px, 320px"
                      priority
                    />
                  </div>

                  {/* Small floating badge */}
                  <div className="absolute -bottom-6 -left-6 bg-background border border-accent/50 px-5 py-3 shadow-md rounded-sm">
                    <p className="text-2xl font-light text-primary leading-none">6+</p>
                    <p className="text-[10px] tracking-wider text-muted-foreground mt-1 uppercase">Years Experience</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Decorative Divider ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="border-t border-accent/40" />
        </div>

        {/* ── Video Section ── */}
        <section
          ref={video.ref}
          className="py-24 md:py-32"
        >
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
            <div
              className={`text-center mb-14 transition-all duration-800 ease-out ${video.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <p className="text-xs tracking-[0.3em] text-muted-foreground font-medium uppercase mb-4">
                Watch & Discover
              </p>
              <h2 className="text-3xl sm:text-4xl font-light text-foreground">
                A Glimpse Into <span className="">Our World</span>
              </h2>
            </div>

            <div
              className={`transition-all duration-1000 ease-out delay-200 ${video.isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.97]'
                }`}
            >
              <div className="relative group">
                {/* Decorative border frame */}
                <div className="absolute -inset-3 border border-accent/30 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative aspect-video rounded-sm overflow-hidden shadow-2xl bg-secondary/20">
                  <iframe
                    src="https://drive.google.com/file/d/1NmVQG-wvsjkXeorpKXSChzn2D3XcXSzp/preview"
                    title="About Shadenaz Aesthetics"
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Decorative Divider ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="border-t border-accent/40" />
        </div>



        {/* ── Call to Action Section ── */}
        <section
          ref={cta.ref}
          className="py-28 md:py-36 relative overflow-hidden"
        >
          {/* Subtle radial glow */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              background: 'radial-gradient(ellipse at center, var(--foreground) 0%, transparent 60%)',
            }}
          />

          <div
            className={`relative z-10 max-w-3xl mx-auto px-6 sm:px-8 lg:px-10 text-center space-y-8 transition-all duration-1000 ease-out ${cta.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground font-medium uppercase">
              Ready to Begin?
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-foreground leading-snug">
              Begin Your Aesthetic <span className="italic">Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
              Schedule your consultation today and discover how Shadenaz Aesthetics can help you feel like the most confident version of yourself
            </p>
            <div className="pt-4">
              <a
                href="/booking"
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-12 py-4 hover:opacity-90 transition-all duration-300 text-xs tracking-[0.25em] font-medium"
              >
                BOOK YOUR CONSULTATION
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />

      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
