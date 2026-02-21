'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'Aesthetic Excellence',
    subtitle: 'Discover your most confident self with Shadenaz Aesthetics',
    image: 'linear-gradient(135deg, #f5f1ed 0%, #e8dfd5 100%)',
  },
  {
    id: 2,
    title: 'Expert Care. Natural Results.',
    subtitle: 'Premium treatments tailored to your unique beauty goals',
    image: 'linear-gradient(135deg, #e8dfd5 0%, #d4cfc4 100%)',
  },
  {
    id: 3,
    title: 'Precision Meets Artistry',
    subtitle: 'Professional aesthetic solutions with clinical excellence',
    image: 'linear-gradient(135deg, #d4cfc4 0%, #f5f1ed 100%)',
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: slide.image }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-6 px-6 max-w-3xl">
              <p className="text-xs tracking-widest text-foreground/60 font-medium uppercase">
                Shadenaz Aesthetics
              </p>
              <h1 className="text-6xl md:text-7xl font-light text-foreground tracking-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 font-light">
                {slide.subtitle}
              </p>
              <div className="pt-8">
                <Link
                  href="/booking"
                  className="inline-block border-2 border-primary text-primary px-12 py-3 hover:bg-primary hover:text-primary-foreground transition text-sm tracking-widest font-medium"
                >
                  BOOK NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 group"
        aria-label="Previous slide"
      >
        <div className="flex items-center justify-center w-12 h-12 border border-foreground/30 hover:border-foreground transition">
          <svg className="w-5 h-5 text-foreground/50 group-hover:text-foreground transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 group"
        aria-label="Next slide"
      >
        <div className="flex items-center justify-center w-12 h-12 border border-foreground/30 hover:border-foreground transition">
          <svg className="w-5 h-5 text-foreground/50 group-hover:text-foreground transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'bg-foreground w-8 h-2'
                : 'bg-foreground/30 hover:bg-foreground/50 w-2 h-2'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg className="w-6 h-6 text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
