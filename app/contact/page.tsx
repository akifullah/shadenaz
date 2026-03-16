'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <Header />
      <main className="w-full">
        <section className="w-full bg-background py-12 md:py-24 border-b border-accent/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
            <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
              <p className="text-[10px] md:text-xs tracking-widest text-muted-foreground font-medium uppercase">
                Get In Touch
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-foreground">
                Contact Us
              </h1>
              <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions? We'd love to hear from you.
              </p>
            </div>

            <div className="">
              <div className="space-y-12 mx-auto max-w-xl">
                <div>
                  <h2 className="text-xl md:text-2xl font-light text-foreground mb-6 md:mb-8">Contact Information</h2>

                  <div className="space-y-8">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 bg-secondary/30 border border-accent">
                          <Phone size={20} className="text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground tracking-widest mb-1">PHONE</h3>
                        <a href="tel:+4407301037810" className="text-muted-foreground hover:text-primary transition">
                          07301037810
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 bg-secondary/30 border border-accent">
                          <Mail size={20} className="text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground tracking-widest mb-1">EMAIL</h3>
                        <a href="mailto:shadenaz.aesthetics@gmail.com" className="text-muted-foreground hover:text-primary transition">
                          shadenaz.aesthetics@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 bg-secondary/30 border border-accent">
                          <MapPin size={20} className="text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground tracking-widest mb-1">LOCATION</h3>
                        <p className="text-muted-foreground">
                          Bolton, Hunger Hill, BL3
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 bg-secondary/30 border border-accent">
                          <Instagram size={20} className="text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground tracking-widest mb-1">INSTAGRAM</h3>
                        <a href="https://instagram.com/@Shadenaz_Aesthetics" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
                          @Shadenaz_Aesthetics
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-accent/30 pt-12">
                  <h3 className="text-base md:text-lg font-light text-foreground mb-4 md:mb-6">Opening Hours:</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday – Friday</span>
                      <span className="font-medium">10am - 8pm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">12pm - 8pm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="bg-secondary/30 p-5 md:p-8 border border-accent/50">
                <h2 className="text-xl md:text-2xl font-light text-foreground mb-6 md:mb-8">Send us a Message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-primary/10 border border-primary/30 text-primary text-sm">
                    Thank you! We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground tracking-wide">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground tracking-wide">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground tracking-wide">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition"
                      placeholder="Message Subject"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground tracking-wide">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 hover:opacity-90 transition text-sm tracking-widest font-medium"
                  >
                    SEND MESSAGE
                  </button>
                </form>
              </div> */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
