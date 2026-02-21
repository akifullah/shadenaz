'use client';

const testimonials = [
  {
    id: 1,
    quote: 'Faiza what did you do to my face, It\'s like magic!',
    source: 'Instagram Review'
  },
  {
    id: 2,
    quote: 'My skin\'s glowing like never before and everyone\'s noticing. You\'re a miracle worker. Can\'t wait to see you again!',
    source: 'Instagram Review'
  },
  {
    id: 3,
    quote: 'Honestly, that was one of the best facials I\'ve ever had!',
    source: 'Instagram Review'
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full bg-background py-24 border-b border-accent/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs tracking-widest text-muted-foreground font-medium uppercase">
            Client Reviews
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground">
            Trusted by satisfied clients across the globe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="border border-accent p-8 bg-card hover:shadow-md transition-all duration-300 space-y-4"
            >
              <p className="text-foreground leading-relaxed text-sm">
                "{testimonial.quote}"
              </p>
              <p className="text-xs text-muted-foreground tracking-wide font-medium uppercase">
                {testimonial.source}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
