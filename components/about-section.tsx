'use client';

export function AboutSection() {
  return (
    <section id="about" className="w-full bg-secondary/30 py-24 border-b border-accent/30">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <p className="text-xs tracking-widest text-muted-foreground font-medium uppercase">
              About Us
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
              Meet Our Expert
            </h2>
          </div>

          <div className="space-y-6 text-center">
            <p className="text-lg text-foreground leading-relaxed font-light">
              Welcome to Shadenaz Aesthetics, where elegance meets expert care. We specialize in premium aesthetic treatments 
              designed to enhance your natural beauty and boost your confidence with precision and artistry.
            </p>
            <p className="text-lg text-foreground leading-relaxed font-light">
              Our founder combines clinical excellence with aesthetic vision, ensuring every client receives personalized treatment 
              plans that deliver natural, beautiful results. We're committed to the latest techniques and highest safety standards.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-accent/50">
            <div className="text-center space-y-2">
              <p className="text-3xl font-medium text-primary">6+</p>
              <p className="text-xs text-muted-foreground tracking-wide">Years Experience</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-3xl font-medium text-primary">50+</p>
              <p className="text-xs text-muted-foreground tracking-wide">Professionals Trained</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-3xl font-medium text-primary">1000+</p>
              <p className="text-xs text-muted-foreground tracking-wide">Happy Clients</p>
            </div>
          </div>

          <div className="space-y-4 pt-8 bg-background p-8 rounded-sm border border-accent/50">
            <h3 className="text-lg font-medium text-foreground">Opening Hours</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Monday to Friday – 09:00 – 21:00</p>
              <p>Saturday – 10:00 – 18:00</p>
              <p>Sunday – 12:00 – 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
