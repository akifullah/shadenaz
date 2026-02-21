'use client';

import Link from 'next/link';

const treatments = [
  {
    id: 1,
    category: 'Botox Injections',
    name: '1 Area Treatment',
    description: 'Forehead, Frown Lines, Crow\'s Feet, Brow Lift, Bunny Lines, Chin Dimple',
    duration: '30 minutes',
    price: '£95'
  },
  {
    id: 2,
    category: 'Dermal Fillers',
    name: 'Face Enhancement (1ml)',
    description: 'Enhance facial features with premium dermal fillers',
    duration: '45 minutes',
    price: '£99'
  },
  {
    id: 3,
    category: 'Lip Enhancement',
    name: 'Lip Filler (0.5ml)',
    description: 'Fuller, more defined lips with natural results',
    duration: '50 minutes',
    price: '£105'
  },
  {
    id: 4,
    category: 'Skin Treatments',
    name: 'Microneedling - Face',
    description: 'Stimulate collagen for rejuvenated, glowing skin',
    duration: '60 minutes',
    price: '£50'
  },
  {
    id: 5,
    category: 'Skin Boosters',
    name: 'Profhilo (2ml)',
    description: 'Deep hydration and skin quality improvement',
    duration: '45 minutes',
    price: '£160'
  },
  {
    id: 6,
    category: 'Fat Dissolving',
    name: 'Small Areas - Lemon Bottle',
    description: 'Non-invasive fat reduction treatment',
    duration: '40 minutes',
    price: '£60'
  }
];

export function TreatmentsSection() {
  return (
    <section id="treatments" className="w-full bg-background py-24 border-b border-accent/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs tracking-widest text-muted-foreground font-medium uppercase">
            Our Treatments
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
            Premium Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each treatment is customized to your unique needs and goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((treatment) => (
            <div
              key={treatment.id}
              className="group flex flex-col h-full bg-white/50 hover:bg-white transition-all duration-300 p-0 cursor-pointer"
            >
              <div className="flex flex-col h-full p-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs tracking-widest text-muted-foreground font-medium uppercase">
                    {treatment.category}
                  </p>
                  <h3 className="text-2xl font-light text-foreground group-hover:text-primary transition">
                    {treatment.name}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {treatment.description}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-muted-foreground tracking-widest font-medium">Duration</span>
                    <span className="text-sm text-foreground">{treatment.duration}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2 border-t border-accent/20">
                    <span className="text-xs text-muted-foreground tracking-widest font-medium">Price</span>
                    <span className="text-2xl font-light text-primary">{treatment.price}</span>
                  </div>
                </div>

                <Link
                  href={`/booking?treatment=${treatment.name}`}
                  className="block text-center bg-primary text-primary-foreground py-3 hover:bg-primary/90 transition text-xs tracking-widest font-medium mt-auto"
                >
                  BOOK NOW
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
