'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/about', label: 'ABOUT' },
  { href: '/booking', label: 'TREATMENTS & PRICING' },
  { href: '/results', label: 'RESULTS' },
  { href: '/care-guide', label: 'PRE & POST CARE' },
  // { href: '/consent-form', label: 'CONSENT' },
  { href: '/policies', label: 'POLICIES' },
  { href: '/contact', label: 'CONTACT' },
];

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <>
      <header className="w-full bg-background sticky top-0 z-50 border-b border-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/shadenaz.png"
                alt="Shadenaz Aesthetics"
                width={50}
                height={50}
                className="h-8 sm:h-10 w-auto object-contain"
              />
              {/* <span className="block text-xs sm:text-sm tracking-widest text-[#000]">SHADENAZ</span> */}
            </Link>

            {/* Desktop nav */}
            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition text-xs tracking-widest font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Book Now — always visible */}
              <Link
                href="/booking"
                className="hidden sm:inline-block border-2 border-primary text-primary px-8 py-2 hover:bg-primary hover:text-primary-foreground transition text-xs tracking-widest font-medium"
              >
                BOOK NOW
              </Link>

              {/* Hamburger button — mobile only */}
              <button
                onClick={toggleSidebar}
                className="xl:hidden flex flex-col justify-center items-center w-10 h-10 relative z-[60] group"
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={sidebarOpen}
              >
                <span
                  className={`block h-[2px] w-6 bg-foreground rounded-full transition-all duration-300 ease-in-out ${sidebarOpen ? 'rotate-45 translate-y-[5px]' : ''
                    }`}
                />
                <span
                  className={`block h-[2px] w-6 bg-foreground rounded-full transition-all duration-300 ease-in-out mt-[8px] ${sidebarOpen ? 'opacity-0 scale-0' : 'opacity-100'
                    }`}
                />
                <span
                  className={`block h-[2px] w-6 bg-foreground rounded-full transition-all duration-300 ease-in-out mt-[8px] ${sidebarOpen ? '-rotate-45 -translate-y-[13px]' : ''
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-300 xl:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-[min(320px,85vw)] bg-background z-[58] shadow-2xl transition-transform duration-300 ease-in-out xl:hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full pt-24 pb-10 px-8">
          {/* Navigation links */}
          <nav className="flex flex-col gap-1 flex-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeSidebar}
                className={`group flex items-center gap-4 py-4 border-b border-accent/20 transition-all duration-300 ${sidebarOpen
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-8'
                  }`}
                style={{
                  transitionDelay: sidebarOpen ? `${150 + index * 60}ms` : '0ms',
                }}
              >
                <span className="h-[1px] w-4 bg-primary/40 group-hover:w-8 group-hover:bg-primary transition-all duration-300" />
                <span className="text-foreground group-hover:text-primary transition text-xs tracking-[0.2em] font-medium">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Book Now CTA */}
          <div
            className={`mt-auto transition-all duration-300 ${sidebarOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
              }`}
            style={{
              transitionDelay: sidebarOpen ? `${150 + navLinks.length * 60 + 100}ms` : '0ms',
            }}
          >
            <Link
              href="/pricing"
              onClick={closeSidebar}
              className="block w-full text-center border-2 border-primary text-primary px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-colors duration-300 text-xs tracking-widest font-medium"
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
