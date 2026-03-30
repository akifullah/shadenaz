'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  {
    id: 1,
    quote: `Shadenaz is incredible at what she does. Her level of knowledge and experience is clear during the consultation process. She puts you at complete ease whilst giving you all the information you need about the treatment and process. Wouldn't trust anyone else!`,
    client: 'Nicola Liston',
  },
  {
    id: 2,
    quote: `Can't recommend Shadenaz enough. She is lovely! And more importantly extremely good at what she does. Fabulous!`,
    client: 'Wendy Ramsden',
  },
  {
    id: 3,
    quote: `I've been going to Shadenaz for over 5 years now, and I'm extremely satisfied with the results every single time. She always does such a natural and flawless job, taking her time with so much patience and care. She is kind, professional, and polite, which makes every visit a pleasant experience. On top of all that, her pricing is very reasonable. I highly recommend her!`,
    client: 'Hadiseh Rostand',
  },
  {
    id: 4,
    quote: `I recently had a service at Shadenaz Aesthetics, and it was an incredible experience! The staff were friendly and knowledgeable, making me feel completely at ease. The atmosphere was relaxing, and the results exceeded my expectations. I can't wait to return for my next appointment—highly recommend this place!`,
    client: 'Natasha Khan',
  },
  {
    id: 5,
    quote: `Shadenaz is highly experienced and professional. I trust her completely and she never makes you feel pressured to do any treatments. She makes you feel comfortable and results are always sooo natural. I would recommend her to anyone!!`,
    client: 'Lara Saleh',
  },
  {
    id: 6,
    quote: `I recently visited Shadenaz Aesthetics and was thoroughly impressed! The staff was welcoming and attentive, taking the time to understand my needs. The service was exceptional, leaving me feeling rejuvenated and confident. The atmosphere was relaxing, making the experience even more enjoyable. Highly recommend!`,
    client: 'Mohammed Ali',
  },
  {
    id: 7,
    quote: `Absolutely love your treatments! I feel amazing every time and trust your suggestions completely. Your skill, kindness and results are unmatched.`,
    client: 'Fadia Shaboroz',
  },
  {
    id: 8,
    quote: `Shadenaz is the most informative, kind, patient and skilled injector I have come across. Every treatment has been life changing for me! No exaggeration. Thank you so much.`,
    client: 'Alisha Afzal',
  },
  {
    id: 9,
    quote: `Absolutely love my lip filler, natural looking and plump. Exactly what I asked for. Your expertise and service is amazing. Thank you so much!`,
    client: 'Vahida Patel',
  },
  {
    id: 10,
    quote: `Having aesthetic treatments is something that I strictly want to keep a secret and going to Shadenaz for treatments has been great because of the high level of privacy she creates for all her clients. She really is accommodating and always welcoming.`,
    client: 'Anonymous',
  },
  {
    id: 11,
    quote: `Highly knowledgeable aesthetician, tailored treatments specifically for me. Also provides valuable tips for maintaining healthy skin at home. Uses high quality products. Thank you`,
    client: 'Aisha Hussain',
  },
  {
    id: 12,
    quote: `I really do trust Shadenaz wholeheartedly. She constantly says no when I ask for extra treatments that she thinks I don't need, whereas other practitioners in the past have just taken my money and done everything I asked for without caring if it suits me or not. It's rare to find this. Thank you`,
    client: 'Ikra Khan',
  },
  {
    id: 13,
    quote: `Such a lovely person and truly talented at her work! Always so professional, caring, and takes the time to explain everything. I always leave feeling confident and happy with the results. Highly recommend`,
    client: 'Sara Omidi',
  },
  {
    id: 14,
    quote: `Me and my family have been coming to Shadenaz for around 4 years and we all love her work and the privacy she creates for us all. She has never taken advantage of any of us and makes sure we only have treatments that keep us looking natural. She feels like family`,
    client: 'Zara Kayani',
  },
];

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <section id="testimonials" className="w-full bg-background py-12 md:py-24 border-b border-accent/30 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-10">

        {/* Header */}
        <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4">
          <p className="text-[10px] md:text-xs tracking-widest text-muted-foreground font-medium uppercase">
            Client Reviews
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-tight text-foreground">
            What Our Clients Say
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Trusted by satisfied clients across the globe
          </p>
        </div>

        {/* Embla viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-[0_0_100%] min-w-0 px-2"
              >
                <div className="border border-accent p-8 md:p-12 bg-card text-center space-y-5 md:space-y-6 mx-auto max-w-2xl transition-all duration-500">
                  {/* Quote mark */}
                  <span className="block text-4xl md:text-5xl text-primary/30 font-serif leading-none select-none">
                    &ldquo;
                  </span>
                  <p className="text-foreground leading-relaxed text-sm md:text-base -mt-4">
                    {testimonial.quote}
                  </p>
                  <div className="w-10 h-[1px] bg-primary/30 mx-auto" />
                  <p className="italic text-muted-foreground text-xs md:text-sm tracking-widest font-medium uppercase">
                    — {testimonial.client}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 md:mt-10 flex flex-col items-center gap-5">
          {/* Prev / Next */}
          <div className="flex items-center gap-4">
            <button
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="w-9 h-9 border border-accent flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <span className="text-xs text-muted-foreground tabular-nums tracking-widest">
              {String(selectedIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </span>

            <button
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="w-9 h-9 border border-accent flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${index === selectedIndex
                  ? 'w-5 h-1 bg-primary'
                  : 'w-1 h-1 bg-accent hover:bg-primary/50'
                  }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
