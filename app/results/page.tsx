'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { X, ZoomIn, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import type { Metadata } from 'next';

// ── Gallery data ────────────────────────────────────────────────────────────
const categories = ['All', 'Botox', 'Fillers', 'Skin', 'Hair', 'Lips'];

const galleryItems = [
  { id: 1, src: '/image1.jpg', category: 'Skin', label: 'Skin Rejuvenation', description: 'Visible radiance after a single session.' },
  { id: 2, src: '/image2.jpg', category: 'Botox', label: 'Botox Results', description: 'Smooth, natural-looking reduction of fine lines.' },
  { id: 3, src: '/image3.jpg', category: 'Fillers', label: 'Lip Fillers', description: 'Beautifully balanced lip enhancement.' },
  { id: 4, src: '/image4.jpg', category: 'Skin', label: 'Hydration Glow', description: 'Dewy, healthy skin after skin booster treatment.' },
  { id: 5, src: '/image5.jpg', category: 'Hair', label: 'Hair Restoration', description: 'Significant regrowth achieved with PRP therapy.' },
  { id: 6, src: '/image1.jpg', category: 'Botox', label: 'Brow Lift', description: 'Subtle lift that opens the eye area naturally.' },
  { id: 7, src: '/image2.jpg', category: 'Fillers', label: 'Cheek Filler', description: 'Defined cheekbones with natural-looking volume.' },
  { id: 8, src: '/image3.jpg', category: 'Skin', label: 'Chemical Peel', description: 'Refined texture and even skin tone revealed.' },
  { id: 9, src: '/image4.jpg', category: 'Lips', label: 'Russian Lip Technique', description: 'Heart-shaped, pillowy lips with precision.' },
  { id: 10, src: '/image5.jpg', category: 'Botox', label: 'Jaw Slimming', description: 'Contoured jawline via masseter Botox.' },
  { id: 11, src: '/image1.jpg', category: 'Fillers', label: 'Tear Trough Filler', description: 'Under-eye hollows softened for a rested look.' },
  { id: 12, src: '/image2.jpg', category: 'Skin', label: 'Microneedling', description: 'Pore refinement and collagen stimulation.' },
];

// ── Stats ───────────────────────────────────────────────────────────────────
const stats = [
  { value: '1000+', label: 'Happy Clients' },
  { value: '32+', label: 'Certifications' },
  { value: '6+', label: 'Years of Experience' },
  { value: '100%', label: 'Satisfaction Rate' },
];

export default function ResultsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((i) => i.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  const prev = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length);
  };
  const next = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % filtered.length);
  };

  const activeLightboxItem = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  return (
    <>
      <Header />

      <main className="w-full bg-background">



        {/* ── Gallery Section ────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">

            {/* Section heading */}
            <div className="text-center mb-10 md:mb-16 space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-tight text-foreground">
                <span className="">Results.</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
                Filter by treatment and tap any photo to explore in detail.
              </p>
            </div>

            {/* Category filters */}
            {/* <div className="flex flex-wrap justify-center gap-2 mb-10 md:mb-14">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-5 py-2 text-[10px] sm:text-xs tracking-widest uppercase font-medium border transition-all duration-300
                    ${activeCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent text-foreground border-accent hover:border-foreground'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div> */}

            {/* Masonry grid */}
            <div className="results-grid" style={{ display: 'grid' }}>
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  className="results-card group cursor-pointer"
                  onClick={() => openLightbox(idx)}
                >
                  <div className=" results-card-img relative overflow-hidden bg-muted">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover object-center  transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex flex-col items-center justify-center gap-2">
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" size={28} />
                      <p className="text-white text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 delay-75">
                        {item.label}
                      </p>
                    </div>
                    {/* Category pill */}
                    {/* <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[9px] tracking-widest uppercase px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {item.category}
                    </span> */}
                  </div>
                  <div className="pt-3 pb-1">
                    <p className="text-xs font-medium tracking-wide text-foreground">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* no results */}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-20">
                No results for this category yet. Check back soon!
              </p>
            )}
          </div>
        </section>

        {/* ── Instagram CTA ──────────────────────────────────────────────── */}
        <section className="w-full bg-secondary py-14 md:py-20 border-t border-accent/40">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
            <Instagram size={32} className="mx-auto text-muted-foreground" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-foreground">
              See More on Instagram
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Follow along for daily transformations, behind-the-scenes content, and
              exclusive offers at Shadenaz Aesthetics.
            </p>
            <a
              href="https://www.instagram.com/shadenaz_aesthetics/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-primary text-primary px-10 py-3 text-xs tracking-widest font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              @SHADENAZ_AESTHETICS
            </a>
          </div>
        </section>

        {/* ── Book CTA ───────────────────────────────────────────────────── */}
        <section className="w-full bg-primary text-primary-foreground py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/50">Ready to begin?</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight">
              Your Results Start Here
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Book a consultation and let&#39;s create your personalised treatment plan.
            </p>
            <Link
              href="/booking"
              className="inline-block border border-white text-white px-10 py-3 text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              BOOK A CONSULTATION
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── Lightbox ───────────────────────────────────────────────────────── */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-3 sm:left-6 text-white/70 hover:text-white transition"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
          >
            <ChevronLeft size={36} />
          </button>

          {/* Image */}
          <div
            className="relative w-[90vw] max-w-2xl h-[70vh] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeLightboxItem.src}
              alt={activeLightboxItem.label}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-3 px-4">
              <p className="text-sm font-medium tracking-wide">{activeLightboxItem.label}</p>
              <p className="text-xs text-white/60 mt-0.5">{activeLightboxItem.description}</p>
            </div>
          </div>

          {/* Next */}
          <button
            className="absolute right-3 sm:right-6 text-white/70 hover:text-white transition"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next"
          >
            <ChevronRight size={36} />
          </button>

          {/* Counter */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest">
            {(lightboxIdx ?? 0) + 1} / {filtered.length}
          </p>
        </div>
      )}

      {/* ── Page-scoped styles ─────────────────────────────────────────────── */}
      <style>{`
        /* Hero */
        .results-hero { min-height: 520px; }
        @media (min-width: 768px) { .results-hero { min-height: 640px; } }

        .results-italic { font-style: italic; font-weight: 300; }

        /* Gallery grid — uniform squares */
        .results-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }
        @media (min-width: 480px)  { .results-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px)  { .results-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .results-grid { grid-template-columns: repeat(4, 1fr); } }

        .results-card {
          /* no break-inside needed for grid */
        }

        .results-card-img {
          width: 100%;
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
        }

        /* Smooth fade-in on filter */
        .results-card { animation: fadeIn .35s ease both; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
