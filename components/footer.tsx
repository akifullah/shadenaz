'use client';

import Link from 'next/link';
import { Mail, Instagram, Facebook, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground py-8 md:py-12 border-t border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-widest uppercase">Navigation</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm hover:opacity-70 transition">
                Home
              </Link>
              <Link href="/about" className="text-sm hover:opacity-70 transition">
                About Us
              </Link>
              <Link href="/results" className="text-sm hover:opacity-70 transition">
                Results
              </Link>
              <Link href="/booking" className="text-sm hover:opacity-70 transition">
                Pricing
              </Link>
              <Link href="/care-guide" className="text-sm hover:opacity-70 transition">
                Care Guide
              </Link>
              <Link href="/policies" className="text-sm hover:opacity-70 transition">
                Policies & FAQs
              </Link>
              <Link href="/booking" className="text-sm hover:opacity-70 transition">
                Book Now
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-widest uppercase">Services</h3>
            <div className="space-y-1 text-sm">
              <p>Botox Injections</p>
              <p>Dermal Fillers</p>
              <p>Skin Treatments</p>
              <p>Hair Loss Solutions</p>
              <p>And More...</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-widest uppercase">Contact</h3>
            <div className="flex flex-col gap-3">
              <a href="mailto:shadenaz.aesthetics@gmail.com" className="flex items-center gap-2 text-sm hover:opacity-70 transition">
                <Mail size={16} />
                <span>shadenaz.aesthetics@gmail.com</span>
              </a>
              <a href="https://www.facebook.com/shadenaz.aesthetics/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:opacity-70 transition">
                <Facebook size={16} />
                <span>Facebook</span>
              </a>
              <a href="https://www.instagram.com/shadenaz_aesthetics/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:opacity-70 transition">
                <Instagram size={16} />
                <span>Instagram</span>
              </a>
              <a href="https://www.linkedin.com/in/shadenaz-tavakolynik-2479a8163/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:opacity-70 transition">
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
              {/* <a href="https://www.tiktok.com/@shadenazz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:opacity-70 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z" />
                </svg>
                <span>TikTok</span>
              </a> */}
            </div>
          </div>
        </div>

        <div className="border-t border-secondary/30 pt-6 md:pt-8">
          <p className="text-xs md:text-sm text-center opacity-70" suppressHydrationWarning>
            © {new Date().getFullYear()} Shadenaz Aesthetics. All rights reserved. | Made by <a className='font-bold' href="https://createaweb.co.uk?utm_source=shadenazaesthetics" target='_blank'>CREATEA WEB</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
