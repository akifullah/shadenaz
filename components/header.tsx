'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="w-full bg-background sticky top-0 z-50 border-b border-accent/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/shadenaz-logo.png"
              alt="Shadenaz Aesthetics"
              width={50}
              height={50}
              className="h-10 w-auto object-contain"
            />
            <span className="hidden sm:block text-sm font-light tracking-widest text-foreground">SHADENAZ</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-12">
            <Link href="#treatments" className="text-foreground hover:text-primary transition text-xs tracking-widest font-medium">
              TREATMENTS
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition text-xs tracking-widest font-medium">
              ABOUT
            </Link>
            <Link href="/pricing" className="text-foreground hover:text-primary transition text-xs tracking-widest font-medium">
              PRICING
            </Link>
            <Link href="/care-guide" className="text-foreground hover:text-primary transition text-xs tracking-widest font-medium">
              CARE GUIDE
            </Link>
            <Link href="/policies" className="text-foreground hover:text-primary transition text-xs tracking-widest font-medium">
              POLICIES
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition text-xs tracking-widest font-medium">
              CONTACT
            </Link>
          </nav>
          
          <nav className="flex lg:hidden items-center gap-6">
            <Link href="/pricing" className="text-foreground hover:text-primary transition text-xs tracking-widest font-medium">
              PRICING
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition text-xs tracking-widest font-medium">
              CONTACT
            </Link>
          </nav>
          <Link href="/booking" className="border-2 border-primary text-primary px-8 py-2 hover:bg-primary hover:text-primary-foreground transition text-xs tracking-widest font-medium">
            BOOK NOW
          </Link>
        </div>
      </div>
    </header>
  );
}
