'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState, useEffect } from 'react';
import {
  ChevronDown,
  Info,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Ban,
  Droplets,
  Scissors,
  UserCheck,
  CalendarDays,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Section {
  title: string;
  items: string[];
  type?: 'default' | 'warning' | 'info' | 'critical';
}

interface CareGuide {
  id: string;
  title: string;
  sections: Section[];
}

export default function CareGuidePage() {
  const [careGuides, setCareGuides] = useState<CareGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIds, setOpenIds] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/care-guides`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then((data: any[]) => {
        const validData = data.filter(item => item && item.id);
        setCareGuides(validData);
        if (validData.length > 0) {
          setOpenIds([validData[0].id]);
        }
      })
      .catch(err => console.error("Failed to fetch care guides:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Header />
      <main className="w-full bg-background min-h-screen">
        {/* Hero Section */}
        <section className="relative py-12 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center space-y-3 md:space-y-4">
            <p className="text-[10px] md:text-xs tracking-[0.3em] text-primary font-semibold uppercase">
              Treatment Protocol
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-light tracking-tight text-foreground">
              Pre & Post <span className="text-primary">Care Guide</span>
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Your results depend on the care you take before and after your session.
              Follow our expert guidelines to ensure safety and longevity.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="pb-16 md:pb-32 px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-primary w-8 h-8 md:w-12 md:h-12" />
              </div>
            ) : careGuides.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">No care guides found.</div>
            ) : (
              careGuides.map((guide) => {
                const isOpen = openIds.includes(guide.id);
                return (
                  <div
                    key={guide.id}
                    className={cn(
                      "group border border-accent/20 transition-all duration-500 overflow-hidden",
                      isOpen ? "bg-card shadow-2xl border-primary/20" : "bg-card/50 hover:bg-card/80"
                    )}
                  >
                    <button
                      onClick={() => toggleAccordion(guide.id)}
                      className="w-full flex items-center justify-between p-4 md:p-8 text-left group-hover:cursor-pointer"
                    >
                      <div className="space-y-1">
                        <h2 className={cn(
                          "text-lg md:text-2xl font-medium tracking-tight transition-colors duration-300",
                          isOpen ? "text-primary" : "text-foreground"
                        )}>
                          {guide.title}
                        </h2>
                        <p className="text-xs text-muted-foreground tracking-widest uppercase font-light">
                          {isOpen ? "Collapse details" : "View protocol"}
                        </p>
                      </div>
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border border-accent/20 transition-all duration-500",
                        isOpen ? "rotate-180 bg-primary border-primary text-primary-foreground" : "text-muted-foreground"
                      )}>
                        <ChevronDown size={20} />
                      </div>
                    </button>

                    <div className={cn(
                      "grid transition-all duration-500 ease-in-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}>
                      <div className="overflow-hidden">
                        <div className="p-4 md:p-8 pt-0 space-y-6 md:space-y-10">
                          {guide.sections.map((section, idx) => (
                            <div key={idx} className={cn(
                              "relative pl-6 space-y-4",
                              section.type === 'critical' && "bg-destructive/5 border-destructive/20 p-6 -ml-0",
                              section.type === 'warning' && "bg-amber-500/5 border-amber-500/20 p-6 -ml-0",
                              section.type === 'info' && "bg-primary/5 border-primary/20 p-6 -ml-0"
                            )}>
                              <div className="flex items-center gap-3">
                                {section.type === 'critical' && <ShieldAlert className="text-destructive" size={20} />}
                                {section.type === 'warning' && <AlertTriangle className="text-amber-500" size={20} />}
                                {section.type === 'info' && <Info className="text-primary" size={20} />}
                                {!section.type && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/30" />}
                                <h3 className={cn(
                                  "text-sm tracking-widest font-bold uppercase",
                                  section.type === 'critical' ? "text-destructive" :
                                    section.type === 'warning' ? "text-amber-500" :
                                      section.type === 'info' ? "text-primary" : "text-foreground"
                                )}>
                                  {section.title}
                                </h3>
                              </div>

                              <ul className="space-y-2 md:space-y-3">
                                {section.items.map((item, itemIdx) => (
                                  <li key={itemIdx} className="flex gap-2 md:gap-3 text-muted-foreground text-xs md:text-sm leading-relaxed font-light">
                                    <CheckCircle2 className={cn(
                                      "flex-shrink-0 mt-0.5",
                                      section.type === 'critical' ? "text-destructive/50" :
                                        section.type === 'warning' ? "text-amber-500/50" :
                                          "text-primary/40"
                                    )} size={16} />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Global Warning */}
        <section className="max-w-4xl mx-auto px-4 md:px-6 pb-12 md:pb-24">
          <div className="bg-destructive/10 border border-destructive/30 p-6 md:p-12 text-center space-y-4 md:space-y-6">
            <AlertTriangle className="mx-auto text-destructive" size={32} />
            <div className="space-y-4">
              <h3 className="text-lg md:text-2xl font-medium text-foreground">Critical Safety Notice</h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Any medical treatment involves risks. Failing to adhere to pre and post-care instructions
                not only compromises your aesthetic results but can lead to medical complications.
                If you experience extreme pain, unusual skin discoloration, or vision changes after
                any treatment, contact your clinician or emergency services immediately.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
