'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState } from 'react';
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
  ShieldAlert
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

const careGuides: CareGuide[] = [
  {
    id: 'anti-wrinkle',
    title: 'Anti-Wrinkle Injections (Botulinum Toxin)',
    sections: [
      {
        title: 'PRE-CARE INSTRUCTIONS',
        items: [
          'Are not pregnant/ breastfeeding.',
          'Inform us of any allergies/ serious medical conditions prior to your appointment.',
          'Arrive with no makeup on the treatment area.',
          'Avoid taking vitamins or anti-inflammatory supplements such as Ibuprofen, Aspirin or Fish oils for 10 days.',
          'Avoid consuming alcohol for 7 days.',
          'Plan social events around the treatment as swelling and bruising are common reactions to injectable treatments.',
          'Wait at least 3 weeks before having any Covid vaccines.'
        ]
      },
      {
        title: 'TOUCH UP POLICY',
        type: 'info',
        items: [
          'Please book your review / touch up appointment approximately 10 days after your treatment, as small adjustments may be needed to perfect your result.',
          'Complimentary touch ups must be attended within 20 days of your treatment. After 20 days, any further adjustments will be chargeable.'
        ]
      },
      {
        title: 'POST-CARE INSTRUCTIONS',
        items: [
          'Strictly stay upright for a period of 4 hours.',
          'Keep the area clean and makeup free for 12 hours.',
          'Refrain from any strenuous exercises and high temperatures including a hot shower for 24 hours.',
          'Avoid applying pressure or rubbing the treated area for 12 hours.',
          'Avoid taking Vitamins, Ibuprofen, Aspirin or any anti-inflammatory medication for 7 days.',
          'Avoid consuming alcohol for 12 hours.',
          'Wait at least 3 weeks before having any Covid vaccines.'
        ]
      },
      {
        title: 'WARNING',
        type: 'critical',
        items: [
          'FAILING TO FOLLOW THESE INSTRUCTION CAN RESULT IN THE PRODUCT TO SHIFT IN UNWANTED MUSCLES, LEAVING YOU WITH UNNATURAL RESULTS AND POSSIBLY PTOSIS.'
        ]
      }
    ]
  },
  {
    id: 'dermal-filler',
    title: 'DERMAL FILLER',
    sections: [
      {
        title: 'PRE-CARE INSTRUCTIONS',
        items: [
          'Are not pregnant/ breastfeeding.',
          'Do not have any active cold sores.',
          'Arrive without makeup on.',
          'Stop taking any vitamins or anti-inflammatory medications such as Ibuprofen, Aspirin or Fish oils for 10 days.',
          'Do not consume alcohol for 7 days.',
          'Have no migrated filler/ bumps in the area that is being treated.',
          'Plan social events around the treatment as redness, bruising and swelling are common reactions to injectable treatments.',
          'Wait at least 3 weeks before having any Covid vaccines.',
          'Have had no recent bacterial infections or antibiotic treatment.',
          'Have had no recent invasive skin treatments (in the same area as your proposed treatment area) four weeks pre or post treatment.'
        ]
      },
      {
        title: 'POST-CARE INSTRUCTIONS',
        items: [
          'It is normal to have redness, bumps, pin prick marks, swelling and bruising in the treated area. Any swelling and bruising may be more apparent the next day.',
          'The product may initially feel hard/ lumpy and you may notice some asymmetry. Allow 10 days for bruising and swelling to go down and 4 weeks for full results.',
          'Refrain from any strenuous exercises and drinking alcohol for 24 hours.',
          'Avoid applying pressure to the treated area for 4 weeks.',
          'Keep the area clean and make-up free for 24 hours.',
          'Avoid taking Vitamins, Ibuprofen, Aspirin or any anti-inflammatory medication for 7 days as this can increase swelling and bruising.',
          'Antihistamines and Arnica tablets may be used to reduce swelling and bruising, however liaise this with your GP prior to usage and check the labels to ensure that you are not allergic before consuming.',
          'Avoid extreme heat such as sauna, steam room and sunbeds for 2 weeks.',
          'Avoid dental work for 4 weeks.',
          'Avoid laser treatments in the treated area for 4 weeks.',
          'Wait at least 3 weeks before having any Covid vaccines.'
        ]
      }
    ]
  },
  {
    id: 'fat-dissolving',
    title: 'FAT DISSOLVING INJECTIONS',
    sections: [
      {
        title: 'PRE-CARE INSTRUCTIONS',
        items: [
          'You must have at least a 1.5cm pinch of fat in the area to be suitable for treatment. (Not empty loose skin)',
          'Do not use any other fat loss treatments/ supplements at the same time.',
          'Avoid vitamins or anti-inflammatory medications such as Ibuprofen, Aspirin or Fish oils for 10 days.',
          'Do not consume alcohol for 7 days.',
          'Avoid sunburn, tanning beds, waxing, laser, chemical peels or strong exfoliation for 7 days.',
          'No active infections, cuts, cold sores, rashes or irritation in the treatment area.',
          'No Covid vaccines for 3 weeks.'
        ]
      },
      {
        title: 'WHO SHOULD AVOID FAT DISSOLVE INJECTIONS',
        type: 'warning',
        items: [
          'Pregnant or breastfeeding.',
          'Diabetic patients.',
          'History of severe allergic reactions (anaphylaxis)',
          'Autoimmune conditions (e.g. scleroderma, lupus)',
          'Kidney or liver disease.',
          'Blood thinning medication (e.g. warfarin)',
          'Are taking accutane for acne'
        ]
      },
      {
        title: 'POST-CARE INSTRUCTIONS',
        items: [
          'Drink PLENTY of water after your treatment.',
          'Avoid taking 48 hours (e.g. alcohol/strenuous exercise).',
          'Avoid anti-inflammatory medications for 10 days as this will dampen your body’s response to the treatment and potentially mean you do not respond to treatment.',
          'Massage on a daily basis may encourage fat drainage.',
          'Avoid strenuous exercises for 24 hours.',
          'Avoid exposure to extremes of temperature (including saunas, steam rooms, sunbeds and sunbathing) for 10 days after treatment.',
          'The treated area will look red, feel warm and swollen initially and it may increase within the first 24-48 hours but then start to gradually decrease over the following week.',
          'You may develop some bruising in the treated area, may feel itchy, and may have some minor aches and pains.'
        ]
      }
    ]
  },
  {
    id: 'microneedling',
    title: 'MICRONEEDLING',
    sections: [
      {
        title: 'PRE-CARE',
        items: [
          'Are not pregnant/ breastfeeding.',
          'Stop taking vitamins or anti-inflammatory medications such as Ibuprofen, Aspirin or Fish oils for 10 days.',
          'Do not consume alcohol for 3 days.',
          'Plan social events around this treatment as redness/ peeling can be common after microneedling for up to 7 days.',
          'You’ll need to have your own Hyaluronic acid serum and SPF 50 as you will need to use them immediately after the treatment.',
          'Avoid sun exposure, sunbeds, waxing treatments for 7 days.',
          'Must not have an active breakout, open wounds or any other infections in the area to be treated.',
          'Stop using active skincare such as retinoids, exfoliants, topical antibiotics or acids for 5 days.',
          'Avoid all laser procedures and unprotected sun exposure for 2 weeks.',
          'Do not shave on the day of the treatment. If there’s dense hair present in the area, shave prior to the day of your appointment.',
          'Must not be taking Accutane or have taken Accutane in the past 6 months.'
        ]
      },
      {
        title: 'POST-CARE INSTRUCTIONS',
        items: [
          'Make sure you use a clean pillowcase and towels. (Gently dab dry only)',
          'Avoid touching, picking, peeling or scratching the treated area. (If peeling or flaking occurs, allow the skin to shed naturally)',
          'Avoid laser treatments and sunbeds for 2 weeks.',
          'Avoid extreme heat such as hot showers, steam rooms, saunas or sun exposure for 7 days.',
          'Avoid heavy sweating/ intense exercise for 48 hours.',
          'Avoid makeup for at least 3 days (longer if skin is still sensitive).',
          'Drink plenty of water to support skin healing.'
        ]
      },
      {
        title: 'SKINCARE TIMELINE',
        type: 'info',
        items: [
          'Days 1 - 3: Wash with water only. Apply Hyaluronic acid serum morning and night. In the morning, apply SPF 50. No SPF is needed at night.',
          'Days 3 - 7: You may start using a gentle face wash (no exfoliants). Introduce your usual gentle moisturiser or day/ night creams.',
          'After 7 days: You can resume your regular skincare routine.'
        ]
      }
    ]
  },
  {
    id: 'prp-hair',
    title: 'PRP HAIR LOSS',
    sections: [
      {
        title: 'CLINIC POLICY',
        type: 'warning',
        items: [
          'If you arrive early then please wait until your appointment time to come in.',
          'You must attend the appointment alone.',
          'Children are strictly not allowed inside.',
          'Deposits are non-refundable.',
          'Cancelling within 3 days of your appointment will result in loss of deposit.',
          'Arriving late may result in losing your appointment and deposit.'
        ]
      },
      {
        title: 'PRE-CARE INSTRUCTIONS',
        items: [
          'Are not pregnant/ breastfeeding.',
          'Stop taking any blood thinners or anti-inflammatory medications such as Ibuprofen, Aspirin, Naproxen, or Fish oils for 7 days.',
          'Do not consume alcohol for 7 days.',
          'Avoid excessive sun or heat exposure such as sunbathing, sunbeds, sauna and steam room for 3 days.',
          'Do not colour, bleach, or chemically treat your hair for at least 10 days.'
        ]
      },
      {
        title: 'THE DAY OF YOUR TREATMENT',
        type: 'info',
        items: [
          'Wash your hair very thoroughly using your regular shampoo.',
          'Do not apply hair products (sprays, oils, dry shampoo, styling products)',
          'Eat a healthy, well balanced meal before your appointment.',
          'Drink approximately 500ml of water at least 1-2 hours prior to your treatment.'
        ]
      },
      {
        title: 'POST-CARE INSTRUCTIONS',
        items: [
          'Do not wash your hair for 12 hours and only use a gentle pH balanced shampoo (sulphate/paraben free).',
          'Avoid touching, scratching, rubbing or massaging the scalp for 48 hours.',
          'Avoid exercise and extreme heat (saunas, hot showers, direct sun) for 48 hours.',
          'Avoid alcohol for 48 hours.',
          'Do not apply hair products (sprays, oils, dry shampoo) for 48 hours.',
          'Do not colour, bleach, or chemically treat your hair for at least 7 days.',
          'Avoid tight hairstyles, hats, or helmets for 48 hours.',
          'Sleep on a clean pillowcase the first night.',
          'Mild redness, tenderness, swelling, or small bumps are normal (24-72h).',
          'Drink plenty of water to support healing and hair growth.',
          'Avoid taking Vitamins, Ibuprofen, Aspirin or any anti-inflammatory medication for 3 days.'
        ]
      }
    ]
  },
  {
    id: 'skin-boosters',
    title: 'SKIN BOOSTERS',
    sections: [
      {
        title: 'PRE-CARE INSTRUCTIONS',
        items: [
          'Are not pregnant/ breastfeeding.',
          'Arrive without makeup on.',
          'Avoid taking vitamins or anti-inflammatory medications such as Ibuprofen, Aspirin or Fish oils for 10 days.',
          'Do not consume alcohol for 7 days.',
          'Plan social events around the treatment as redness, swelling and bruising are common.',
          'Wait at least 3 weeks before having any Covid vaccines.',
          'Have no bacterial infections or antibiotic treatments.',
          'Have had no laser treatments in the same area for 2 weeks.'
        ]
      },
      {
        title: 'POST-CARE INSTRUCTIONS',
        items: [
          'It is normal to have redness, bumps, swelling and bruising in the treated area.',
          'Refrain from any strenuous exercises and drinking alcohol for 48 hours.',
          'Keep the area clean and make-up free for 24 hours.',
          'Avoid taking Vitamins, Ibuprofen, Aspirin or any anti-inflammatory medication for 7 days.',
          'Avoid extreme heat such as sauna, steam room and sunbeds for 2 weeks.',
          'Avoid laser, chemical peels, facials and other treatments for 2 weeks.',
          'Wait at least 3 weeks before having any Covid vaccines.'
        ]
      }
    ]
  }
];

export default function CareGuidePage() {
  const [openIds, setOpenIds] = useState<string[]>(['anti-wrinkle']);

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
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-4">
            <p className="text-xs tracking-[0.3em] text-primary font-semibold uppercase">
              Treatment Protocol
            </p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground">
              Pre & Post <span className="text-primary italic">Care Guide</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Your results depend on the care you take before and after your session.
              Follow our expert guidelines to ensure safety and longevity.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="pb-32 px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {careGuides.map((guide) => {
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
                    className="w-full flex items-center justify-between p-8 text-left group-hover:cursor-pointer"
                  >
                    <div className="space-y-1">
                      <h2 className={cn(
                        "text-2xl font-medium tracking-tight transition-colors duration-300",
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
                      <div className="p-8 pt-0 space-y-10">
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

                            <ul className="space-y-3">
                              {section.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex gap-3 text-muted-foreground text-sm leading-relaxed font-light">
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
            })}
          </div>
        </section>

        {/* Global Warning */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-destructive/10 border border-destructive/30 p-12 text-center space-y-6">
            <AlertTriangle className="mx-auto text-destructive" size={48} />
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-foreground">Critical Safety Notice</h3>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
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
