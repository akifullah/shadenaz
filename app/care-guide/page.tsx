'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState } from 'react';

const careGuides = [
  {
    id: 1,
    treatment: 'Botox Injections',
    precare: [
      'Are not pregnant/breastfeeding',
      'Inform us of any allergies/serious medical conditions prior to your appointment',
      'Arrive with no makeup on the treatment area',
      'Avoid taking vitamins or anti-inflammatory supplements such as Ibuprofen, Aspirin or Fish oils for 10 days',
      'Avoid consuming alcohol for 7 days',
      'Plan social events around the treatment as swelling and bruising are common',
      'Wait at least 3 weeks before having any Covid vaccines'
    ],
    postcare: [
      'Strictly stay upright for a period of 4 hours',
      'Keep the area clean and makeup free for 12 hours',
      'Refrain from any strenuous exercises and high temperatures including a hot shower for 24 hours',
      'Avoid applying pressure or rubbing the treated area for 12 hours',
      'Avoid taking Vitamins, Ibuprofen, Aspirin or any anti-inflammatory medication for 7 days',
      'Avoid consuming alcohol for 12 hours',
      'Wait at least 3 weeks before having any Covid vaccines'
    ],
    note: 'All treatments include a 10-day review for adjustments'
  },
  {
    id: 2,
    treatment: 'Dermal Fillers',
    precare: [
      'Are not pregnant/breastfeeding',
      'Do not have any active cold sores',
      'Arrive without makeup on',
      'Stop taking any vitamins or anti-inflammatory medications for 10 days',
      'Do not consume alcohol for 7 days',
      'Have no migrated filler/bumps in the area being treated',
      'Plan social events around the treatment',
      'Wait at least 3 weeks before having any Covid vaccines',
      'Have had no recent bacterial infections or antibiotic treatment',
      'Have had no recent invasive skin treatments (4 weeks pre or post treatment)'
    ],
    postcare: [
      'It is normal to have redness, bumps, pin prick marks, swelling and bruising',
      'The product may initially feel hard/lumpy - allow 10 days for swelling and 4 weeks for full results',
      'Refrain from strenuous exercises and drinking alcohol for 24 hours',
      'Avoid applying pressure to the treated area for 4 weeks',
      'Keep the area clean and make-up free for 24 hours',
      'Avoid taking Vitamins, Ibuprofen, Aspirin for 7 days',
      'Arnica tablets may be used to reduce swelling and bruising',
      'Avoid extreme heat such as sauna, steam room and sunbeds for 2 weeks',
      'Avoid dental work for 4 weeks',
      'Avoid laser treatments for 4 weeks'
    ]
  },
  {
    id: 3,
    treatment: 'Microneedling',
    precare: [
      'Are not pregnant/breastfeeding',
      'Stop taking vitamins or anti-inflammatory medications for 10 days',
      'Do not consume alcohol for 3 days',
      'Have your own Hyaluronic acid serum and SPF 50',
      'Avoid sun exposure, sunbeds, waxing for 7 days',
      'Must not have active breakout, open wounds or infections',
      'Stop using active skincare such as retinoids, exfoliants for 5 days',
      'Avoid all laser procedures for 2 weeks',
      'Do not shave on the day of treatment',
      'Must not be taking Accutane or have taken it in the past 6 months'
    ],
    postcare: [
      'Use a clean pillowcase and towels. Gently dab dry only',
      'Avoid touching, picking, peeling or scratching the treated area',
      'Avoid laser treatments and sunbeds for 2 weeks',
      'Avoid extreme heat for 7 days',
      'Avoid heavy sweating/intense exercise for 48 hours',
      'Avoid makeup for at least 3 days',
      'Drink plenty of water to support skin healing',
      'Days 1-3: Wash with water only, apply Hyaluronic acid serum, use SPF 50 in morning',
      'Days 3-7: Use gentle face wash, introduce moisturizer',
      'After 7 days: Resume regular skincare routine'
    ]
  },
  {
    id: 4,
    treatment: 'Hair Loss Treatments (PRP)',
    precare: [
      'Are not pregnant/breastfeeding',
      'Stop taking blood thinners or anti-inflammatory medications for 7 days',
      'Do not consume alcohol for 7 days',
      'Avoid excessive sun or heat exposure for 3 days',
      'Do not colour, bleach, or chemically treat your hair for at least 10 days',
      'Wash your hair thoroughly using regular shampoo',
      'Do not apply hair products (sprays, oils, dry shampoo)',
      'Eat a healthy, well balanced meal before appointment',
      'Drink approximately 500ml of water 1-2 hours prior to treatment'
    ],
    postcare: [
      'Do not wash your hair for 12 hours',
      'Use only gentle pH balanced shampoo that is free from sulphate, paraben, fragrances',
      'Avoid touching, scratching, rubbing or massaging the scalp for 48 hours',
      'Avoid exercise and extreme heat for 48 hours',
      'Avoid alcohol for 48 hours',
      'Avoid direct sun exposure and sunbeds for 48 hours',
      'Do not apply hair products for 48 hours',
      'Do not colour, bleach, or chemically treat hair for at least 7 days',
      'Avoid tight hairstyles, hats, helmets for 48 hours',
      'Sleep on a clean pillowcase the first night',
      'Drink plenty of water to support healing and hair growth',
      'Avoid taking anti-inflammatory medication for 3 days'
    ]
  }
];

export default function CareGuidePage() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <>
      <Header />
      <main className="w-full bg-background">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-24">
          <div className="text-center mb-16 space-y-4">
            <p className="text-xs tracking-widest text-muted-foreground font-medium uppercase">
              Care Instructions
            </p>
            <h1 className="text-5xl font-light text-foreground">Pre & Post Care Guide</h1>
            <p className="text-lg text-muted-foreground">
              Follow these instructions carefully to ensure optimal results
            </p>
          </div>

          <div className="space-y-6">
            {careGuides.map((guide) => (
              <div key={guide.id} className="border border-accent/30 bg-card overflow-hidden">
                <button
                  onClick={() => setExpandedId(expandedId === guide.id ? null : guide.id)}
                  className="w-full p-6 flex justify-between items-center hover:bg-secondary/30 transition"
                >
                  <h2 className="text-2xl font-medium text-foreground text-left">
                    {guide.treatment}
                  </h2>
                  <svg
                    className={`w-6 h-6 text-foreground transition-transform ${
                      expandedId === guide.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {expandedId === guide.id && (
                  <div className="border-t border-accent/30 p-6 space-y-8">
                    {guide.note && (
                      <div className="bg-secondary/20 border border-accent/50 p-4 rounded">
                        <p className="text-sm text-foreground italic">{guide.note}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary"></span>
                        Pre-Care Instructions
                      </h3>
                      <ul className="space-y-3">
                        {guide.precare.map((item, idx) => (
                          <li key={idx} className="flex gap-3 text-muted-foreground">
                            <span className="text-primary flex-shrink-0 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-accent/30 pt-8">
                      <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary"></span>
                        Post-Care Instructions
                      </h3>
                      <ul className="space-y-3">
                        {guide.postcare.map((item, idx) => (
                          <li key={idx} className="flex gap-3 text-muted-foreground">
                            <span className="text-primary flex-shrink-0 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 bg-secondary/30 border border-accent/50 p-8 space-y-4">
            <h3 className="text-xl font-medium text-foreground">Important Notice</h3>
            <p className="text-muted-foreground">
              Failing to follow these instructions can result in the product shifting to unwanted muscles or areas, leaving you with unnatural results. If you have any concerns or questions about your care instructions, please contact us immediately.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
