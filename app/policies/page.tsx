import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const policies = [
  {
    id: 1,
    title: 'Appointment Policy',
    items: [
      'If you arrive early, please wait until your appointment time to come in',
      'You must attend the appointment alone',
      'Children are strictly not allowed inside',
      'Arriving beyond 10 minutes late may result in losing your appointment and deposit'
    ]
  },
  {
    id: 2,
    title: 'Deposit & Cancellation Policy',
    items: [
      'Deposits are non-refundable',
      'Cancelling within 3 days of your appointment will result in loss of deposit',
      'Please provide adequate notice for cancellations to allow other clients to book'
    ]
  },
  {
    id: 3,
    title: 'Payment Terms',
    items: [
      'A £40 deposit is required to confirm your booking',
      'Remaining payments are cash only',
    ]
  },
  {
    id: 4,
    title: 'Touch-up Policy',
    items: [
      'Your complimentary review/ touch-up appointment must take place approximately 10 days after your initial treatment.',
      'If you fail to attend the touch-up appointment within 20 days of your initial treatment,  any further adjustments will be chargeable.',
    ]
  },
  {
    id: 5,
    title: 'Client Conduct',
    items: [
      'We maintain a professional and respectful environment',
      'Any abusive or disruptive behavior may result in immediate termination of services',
      'Our team has the right to refuse service to maintain a safe environment'
    ]
  },
  {
    id: 6,
    title: 'Medical Contraindications',
    items: [
      'Clients must disclose all relevant medical conditions and medications',
      'Certain conditions may contraindicate treatment',
      'We reserve the right to refuse treatment if we believe it unsafe',
      'A consultation is recommended for clients with complex medical histories'
    ]
  }
];

const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'You can book online through our website or contact us directly. Online booking is available 24/7 for your convenience.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellations must be made at least 3 days before your appointment. Cancelling within 3 days will result in loss of deposit.'
  },
  {
    question: 'Are treatments painful?',
    answer: `Everyone's pain tolerance is completely different and discomfort can vary depending on the area being treated. However, a strong numbing cream is applied beforehand to minimise any discomfort, and fine needles are used to further reduce pain.`
  },
  {
    question: 'When will I see results?',
    answer: 'Commonly, all injectable treatments may show some immediate results. However, injectable treatments may come with swelling and bruising. It typically takes approximately four weeks to see the full results.'
  },
  {
    question: 'Is there downtime after treatment?',
    answer: 'All treatments come with some downtime. Please check the pre- and post-care section for full details on what to expect.'
  }
];

export default function PoliciesPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-10 py-12 md:py-24">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <p className="text-[10px] md:text-xs tracking-widest text-muted-foreground font-medium uppercase">
              Information
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-foreground">Clinic Policies & FAQs</h1>
            <p className="text-sm md:text-lg text-muted-foreground">
              Important information about our services and policies
            </p>
          </div>

          {/* Policies Section */}
          <div className="mb-12 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6 md:mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-primary"></span>
              Our Policies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="border border-accent/30 bg-card p-4 md:p-6 hover:border-primary/50 transition"
                >
                  <h3 className="text-base md:text-lg font-medium text-foreground mb-3 md:mb-4">
                    {policy.title}
                  </h3>
                  <ul className="space-y-2">
                    {policy.items.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-xs md:text-sm text-muted-foreground">
                        <span className="text-primary flex-shrink-0 mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6 md:mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-primary"></span>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 md:space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-accent/30 pb-4 md:pb-6 last:border-b-0">
                  <h3 className="text-base md:text-lg font-medium text-foreground mb-2 md:mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-10 md:mt-16 bg-secondary/30 border border-accent/50 p-5 md:p-8 text-center space-y-3 md:space-y-4">
            <h3 className="text-xl md:text-2xl font-light text-foreground">Have More Questions?</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Feel free to reach out to us for any clarifications
            </p>
            <div className="pt-4 space-y-2">
              <p className="text-sm font-medium text-foreground">
                Email: createawebltd@gmail.com
              </p>
              <p className="text-sm text-muted-foreground">
                Follow us on social media for tips and updates
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
