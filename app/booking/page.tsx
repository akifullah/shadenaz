'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const treatments = [
  { id: 1, name: '1 Area Botox Treatment', price: '£95', duration: '30 minutes' },
  { id: 2, name: '2 Areas Botox Treatment', price: '£135', duration: '35 minutes' },
  { id: 3, name: '3 Areas Botox Treatment', price: '£175', duration: '40 minutes' },
  { id: 4, name: 'Face Enhancement (1ml)', price: '£99', duration: '45 minutes' },
  { id: 5, name: 'Face Enhancement (2ml)', price: '£180', duration: '50 minutes' },
  { id: 6, name: 'Face Enhancement (3ml)', price: '£260', duration: '60 minutes' },
  { id: 7, name: 'Lip Enhancement (0.5ml)', price: '£105', duration: '50 minutes' },
  { id: 8, name: 'Lip Enhancement (0.7ml)', price: '£115', duration: '50 minutes' },
  { id: 9, name: 'Lip Enhancement (1.1ml)', price: '£125', duration: '50 minutes' },
  { id: 10, name: 'Microneedling - Face', price: '£50', duration: '60 minutes' },
  { id: 11, name: 'Microneedling - Face + Neck', price: '£75', duration: '70 minutes' },
  { id: 12, name: 'PRP Face Injections', price: '£105', duration: '80 minutes' },
  { id: 13, name: 'Profhilo (2ml)', price: '£160', duration: '45 minutes' },
  { id: 14, name: 'Polynucleotides - Face', price: '£170', duration: '45 minutes' },
  { id: 15, name: 'PRP Hair Treatment', price: '£145', duration: '90 minutes' },
  { id: 16, name: 'Hair Filler (2ml)', price: '£135', duration: '40 minutes' },
  { id: 17, name: 'Fat Dissolving - Small', price: '£60', duration: '40 minutes' },
  { id: 18, name: 'Fat Dissolving - Medium', price: '£85', duration: '50 minutes' },
  { id: 19, name: 'Fat Dissolving - Large', price: '£120', duration: '60 minutes' },
  { id: 20, name: 'BioRePeel - Face', price: '£75', duration: '50 minutes' },
  { id: 21, name: 'Consultation', price: '£10', duration: '20 minutes' }
];

export default function BookingPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="w-full bg-background min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </>
    }>
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const searchParams = useSearchParams();
  const treatmentParam = searchParams.get('treatment') || '';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    treatment: treatmentParam || '',
    date: '',
    time: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      console.log('Booking submitted:', formData);
    }, 1000);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main className="w-full min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-10 py-24 text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/30 rounded">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-light text-foreground">Booking Confirmed!</h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your booking. We've sent a confirmation email to <span className="font-medium">{formData.email}</span>
              </p>
            </div>

            <div className="bg-secondary/30 p-8 space-y-4 border border-accent/50">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-left">
                  <p className="text-xs text-muted-foreground tracking-widest font-medium uppercase">Treatment</p>
                  <p className="text-lg font-medium text-foreground mt-2">{formData.treatment}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground tracking-widest font-medium uppercase">Date & Time</p>
                  <p className="text-lg font-medium text-foreground mt-2">{formData.date} at {formData.time}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pt-4 border-t border-accent/50">
                We look forward to seeing you soon!
              </p>
            </div>

            <a href="/" className="inline-block border-2 border-primary text-primary px-10 py-3 hover:bg-primary hover:text-primary-foreground transition text-sm tracking-widest font-medium">
              RETURN HOME
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="w-full bg-background min-h-screen">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-24">
          <div className="text-center mb-16 space-y-4">
            <p className="text-xs tracking-widest text-muted-foreground font-medium uppercase">Booking</p>
            <h1 className="text-5xl font-light tracking-tight text-foreground">Schedule Your Treatment</h1>
            <p className="text-lg text-muted-foreground">Fill out the form below and we'll confirm your appointment</p>
          </div>

          <div className="bg-card border border-accent/30 p-8 sm:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground tracking-wide">Email *</label>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground tracking-wide">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground tracking-wide">Treatment *</label>
                  <select
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition"
                  >
                    <option value="">Select a treatment</option>
                    {treatments.map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name} - {t.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground tracking-wide">Preferred Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground tracking-wide">Preferred Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground tracking-wide">Additional Notes</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any additional information or questions..."
                  rows={4}
                  className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition resize-none"
                />
              </div>

              <div className="border-t border-accent/50 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 hover:opacity-90 transition text-sm tracking-widest font-medium disabled:opacity-50"
                >
                  {loading ? 'PROCESSING...' : 'CONFIRM BOOKING'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
