'use client';

import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="w-full bg-background pt-10 pb-12 md:pt-20 md:pb-24 border-b border-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="text-center space-y-4 md:space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] md:text-xs tracking-widest text-muted-foreground font-medium uppercase">
              Premium Aesthetics Treatments
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-foreground">
              <span className="text-pretty">Redefine Your Beauty</span>
            </h1>
          </div>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Professional aesthetic treatments designed to enhance your natural beauty with precision and care
          </p>
          <div className="pt-4">
            <Link href="/booking" className="inline-block border-2 border-primary text-primary px-8 py-2 md:px-10 md:py-3 hover:bg-primary hover:text-primary-foreground transition text-xs md:text-sm tracking-widest font-medium">
              BOOK CONSULTATION
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
