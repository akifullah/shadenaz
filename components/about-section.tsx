'use client';

export function AboutSection() {
  return (
    <section id="about" className="w-full bg-secondary/30 py-12 md:py-24 border-b border-accent/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="text-center space-y-5 md:space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] md:text-xs tracking-widest text-muted-foreground font-medium uppercase">
              About Us
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-tight text-foreground">
              Welcome to Shadenaz Aesthetics
            </h2>
          </div>

          <div className="space-y-4 md:space-y-6 text-center">
            <p className="text-sm md:text-lg text-foreground leading-relaxed font-light">
              A place that  specialises in premium aesthetic treatments designed to bring out your natural beauty and boost your confidence, using a careful balance of skill and artistry.
            </p>
            <p className="text-sm md:text-lg text-foreground leading-relaxed font-light">
              I bring together clinical expertise and a genuine eye for aesthetics, ensuring every client receives a personalised plan that delivers natural, beautiful results. I’m committed to the latest techniques and the highest safety standards.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-8 border-t border-accent/50">
            <div className="text-center space-y-2">
              <p className="text-xl md:text-3xl font-medium text-primary">6+</p>
              <p className="text-xs text-muted-foreground tracking-wide">Years Experience</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl md:text-3xl font-medium text-primary">32+</p>
              <p className="text-xs text-muted-foreground tracking-wide">Certifications</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl md:text-3xl font-medium text-primary">1000+</p>
              <p className="text-xs text-muted-foreground tracking-wide">Happy Clients</p>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 bg-background p-5 md:p-8 rounded-sm border border-accent/50">
            <h3 className="text-base md:text-lg font-medium text-foreground">Opening Hours</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Monday to Friday – 10am - 8pm</p>
              <p>Saturdays - CLOSED</p>
              <p>Sunday – 12pm - 8pm</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
