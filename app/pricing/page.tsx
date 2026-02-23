import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import pricingPlansJsonData from '@/utils/services.json';

// const pricingPlans = [
//   {
//     category: 'Botox Injections',
//     treatments: [
//       {
//         name: '1 Area Treatment',
//         description: 'Forehead, Frown Lines, Crow\'s Feet, Brow Lift',
//         price: '£95',
//         duration: '30 minutes'
//       },
//       {
//         name: '2 Areas Treatment',
//         description: 'Combine any standard treatment areas',
//         price: '£135',
//         duration: '35 minutes'
//       },
//       {
//         name: '3 Areas Treatment',
//         description: 'Multiple area treatment for comprehensive results',
//         price: '£175',
//         duration: '40 minutes'
//       },
//       {
//         name: 'Over 3 Areas',
//         description: 'Each additional area beyond 3',
//         price: '+£45',
//         duration: '45 minutes'
//       }
//     ]
//   },
//   {
//     category: 'Dermal Fillers - Face',
//     treatments: [
//       {
//         name: '1ml Enhancement',
//         description: 'Single ml of premium dermal filler',
//         price: '£99',
//         duration: '45 minutes'
//       },
//       {
//         name: '2ml Enhancement',
//         description: 'Double ml for more dramatic results',
//         price: '£180',
//         duration: '50 minutes'
//       },
//       {
//         name: '3ml Enhancement',
//         description: 'Triple ml for comprehensive facial enhancement',
//         price: '£260',
//         duration: '60 minutes'
//       }
//     ]
//   },
//   {
//     category: 'Lip Enhancement',
//     treatments: [
//       {
//         name: '0.5ml Lip Filler',
//         description: 'Subtle lip enhancement',
//         price: '£105',
//         duration: '50 minutes'
//       },
//       {
//         name: '0.7ml Lip Filler',
//         description: 'Medium lip enhancement',
//         price: '£115',
//         duration: '50 minutes'
//       },
//       {
//         name: '1.1ml Lip Filler',
//         description: 'Full lip enhancement',
//         price: '£125',
//         duration: '50 minutes'
//       }
//     ]
//   },
//   {
//     category: 'Skin Treatments',
//     treatments: [
//       {
//         name: 'Microneedling - Face',
//         description: 'Collagen induction therapy for facial rejuvenation',
//         price: '£50',
//         duration: '60 minutes'
//       },
//       {
//         name: 'Microneedling - Face + Neck',
//         description: 'Extended treatment for face and neck area',
//         price: '£75',
//         duration: '70 minutes'
//       },
//       {
//         name: 'PRP Face Injections',
//         description: 'Platelet-rich plasma for skin restoration',
//         price: '£105',
//         duration: '80 minutes'
//       }
//     ]
//   },
//   {
//     category: 'Skin Boosters',
//     treatments: [
//       {
//         name: 'Polynucleotides - Face',
//         description: '2ml facial skin booster treatment',
//         price: '£170',
//         duration: '45 minutes'
//       },
//       {
//         name: 'Profhilo',
//         description: '2ml premium hydration booster',
//         price: '£160',
//         duration: '45 minutes'
//       },
//       {
//         name: 'iLLUMA Luna',
//         description: '1ml innovative skin treatment',
//         price: '£110',
//         duration: '40 minutes'
//       }
//     ]
//   },
//   {
//     category: 'Hair Loss Treatments',
//     treatments: [
//       {
//         name: 'PRP Hair Treatment',
//         description: 'Single session of PRP for hair restoration',
//         price: '£145',
//         duration: '90 minutes'
//       },
//       {
//         name: 'PRP Hair Treatment x5',
//         description: 'Five-session package for optimal results',
//         price: '£675',
//         duration: '90 minutes per session'
//       },
//       {
//         name: 'Hair Filler',
//         description: '2ml hair filler treatment',
//         price: '£135',
//         duration: '40 minutes'
//       }
//     ]
//   },
//   {
//     category: 'Fat Dissolving',
//     treatments: [
//       {
//         name: 'Small Areas',
//         description: 'Lemon Bottle fat dissolution - small areas',
//         price: '£60',
//         duration: '40 minutes'
//       },
//       {
//         name: 'Medium Areas',
//         description: 'Lemon Bottle fat dissolution - medium areas',
//         price: '£85',
//         duration: '50 minutes'
//       },
//       {
//         name: 'Large Areas',
//         description: 'Lemon Bottle fat dissolution - large areas',
//         price: '£120',
//         duration: '60 minutes'
//       }
//     ]
//   },
//   {
//     category: 'Special Treatments',
//     treatments: [
//       {
//         name: 'Nose Enhancement - Filler & Botox',
//         description: 'Combined treatment for nose reshaping',
//         price: '£145',
//         duration: '50 minutes'
//       },
//       {
//         name: 'BioRePeel - Face',
//         description: 'Advanced chemical peel for facial renewal',
//         price: '£75',
//         duration: '50 minutes'
//       },
//       {
//         name: 'Face-to-Face Consultation',
//         description: 'Initial consultation with expert',
//         price: '£10',
//         duration: '20 minutes'
//       }
//     ]
//   }
// ];
const pricingPlans = pricingPlansJsonData.services;


export default function PricingPage() {

  return (
    <>
      <Header />
      <main className="w-full">
        <section className="w-full bg-background pt-16 pb-24 border-b border-accent/30">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="text-center mb-16 space-y-4">
              <p className="text-xs tracking-widest text-muted-foreground font-medium uppercase">
                Price List
              </p>
              <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground">
                Our Treatments & Pricing
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparent pricing for all our premium aesthetic treatments
              </p>
            </div>

            <div className="space-y-12">
              {pricingPlans.map((category, catIndex) => (
                <div key={catIndex} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-1 h-8 bg-primary"></span>
                    <h3 className="text-2xl font-medium text-foreground">
                      {category.category}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {category.treatments.map((treatment, idx) => (
                      <div
                        key={idx}
                        className="border border-accent hover:border-primary transition-all duration-300 p-6 bg-card hover:shadow-md group"
                      >
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-medium text-foreground group-hover:text-primary transition mb-2">
                              {treatment.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {treatment.description}
                            </p>
                          </div>

                          <div className="space-y-2 border-t border-accent/50 pt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground tracking-wide">Price</span>
                              <span className="text-2xl font-medium text-primary">{treatment.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground tracking-wide">Duration</span>
                              <span className="text-sm font-medium text-foreground">{treatment.duration}</span>
                            </div>
                          </div>

                          <Link
                            href={`/booking?treatment=${treatment.name}`}
                            className="block mt-4 text-center border border-primary text-primary py-2 hover:bg-primary hover:text-primary-foreground transition text-xs tracking-widest font-medium"
                          >
                            BOOK NOW
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full bg-secondary/30 py-16">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 text-center space-y-6">
            <h2 className="text-2xl font-light text-foreground">Have Questions About Our Treatments?</h2>
            <p className="text-muted-foreground">
              Contact us for personalized consultations and package deals
            </p>
            <Link
              href="/booking"
              className="inline-block border-2 border-primary text-primary px-10 py-3 hover:bg-primary hover:text-primary-foreground transition text-sm tracking-widest font-medium"
            >
              SCHEDULE CONSULTATION
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
