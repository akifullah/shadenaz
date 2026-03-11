'use client';

const testimonials = [
  {
    id: 1,
    quote: `I cannot recommend Taylor Alonso enough! The level of professionalism and market insight Taylor brought to our home buying process was outstanding. Taylor understood our unique needs and worked tirelessly to find a home that fit our lifestyle and budget. We're over the moon with our new home!`,
    source: 'Instagram Review',
    client: 'Juliana Silva'
  },

];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full bg-background py-12 md:py-24 border-b border-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-1 max-w-lg mx-auto  gap-4 md:gap-8 ">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="border   border-accent p-5 md:p-8 bg-card hover:shadow-md transition-all duration-300 space-y-3 md:space-y-4 text-center w-full"
            >
              <p className="text-foreground leading-relaxed text-xs md:text-sm">
                "{testimonial.quote}"
              </p>
              {/* <p className="text-xs text-muted-foreground tracking-wide font-medium uppercase">
                {testimonial.source}
              </p> */}
              <p className="italic text-muted-foreground tracking-wide font-medium uppercase">
                - {testimonial.client}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
