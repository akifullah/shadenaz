'use client';

import Link from 'next/link';
import { Mail, Instagram, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground py-12 border-t border-secondary">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-widest uppercase">Navigation</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm hover:opacity-70 transition">
                Home
              </Link>
              <Link href="/about" className="text-sm hover:opacity-70 transition">
                About Us
              </Link>
              <Link href="/pricing" className="text-sm hover:opacity-70 transition">
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
              <a href="mailto:createawebltd@gmail.com" className="flex items-center gap-2 text-sm hover:opacity-70 transition">
                <Mail size={16} />
                <span>createawebltd@gmail.com</span>
              </a>
              <a href="https://instagram.com/shadenaz_aesthetics/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:opacity-70 transition">
                <Instagram size={16} />
                <span>@shadenaz_aesthetics</span>
              </a>
              <a href="https://www.facebook.com/shadenaz.aesthetics/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:opacity-70 transition">
                <Phone size={16} />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary/30 pt-8">
          <p className="text-sm text-center opacity-70">
            © {new Date().getFullYear()} Shadenaz Aesthetics. All rights reserved. | Website by CREATEA WEB
          </p>
        </div>
      </div>
    </footer>
  );
}
