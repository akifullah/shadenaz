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
      'A deposit is required to confirm your booking',
      'Full payment must be received before treatment',
      'We accept all major payment methods',
      'Invoices can be provided upon request'
    ]
  },
  {
    id: 4,
    title: 'Touch-Up Policy (Botox)',
    items: [
      'Please book your review/touch up appointment approximately 10 days after your treatment',
      'Small adjustments may be needed to perfect your result',
      'Complimentary touch ups must be attended within 20 days of your treatment',
      'After 20 days, any further adjustments will be chargeable'
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
    question: 'How long do results last?',
    answer: 'Results vary depending on the treatment. Botox typically lasts 3-4 months, while fillers can last 6-12 months. We\'ll discuss longevity during your consultation.'
  },
  {
    question: 'Are treatments painful?',
    answer: 'Most clients report minimal discomfort. We use fine needles and can apply numbing cream if needed. Pain tolerance varies individually.'
  },
  {
    question: 'When will I see results?',
    answer: 'Some treatments show immediate results, while others develop gradually. Most clients see full results within 1-2 weeks.'
  },
  {
    question: 'Is there downtime after treatment?',
    answer: 'Downtime varies by treatment. Most treatments allow you to return to normal activities immediately, though you should avoid strenuous exercise for 24 hours.'
  }
];

export default function PoliciesPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-background">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-24">
          <div className="text-center mb-16 space-y-4">
            <p className="text-xs tracking-widest text-muted-foreground font-medium uppercase">
              Information
            </p>
            <h1 className="text-5xl font-light text-foreground">Clinic Policies & FAQs</h1>
            <p className="text-lg text-muted-foreground">
              Important information about our services and policies
            </p>
          </div>

          {/* Policies Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-light text-foreground mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-primary"></span>
              Our Policies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="border border-accent/30 bg-card p-6 hover:border-primary/50 transition"
                >
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    {policy.title}
                  </h3>
                  <ul className="space-y-2">
                    {policy.items.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
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
            <h2 className="text-3xl font-light text-foreground mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-primary"></span>
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-accent/30 pb-6 last:border-b-0">
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-secondary/30 border border-accent/50 p-8 text-center space-y-4">
            <h3 className="text-2xl font-light text-foreground">Have More Questions?</h3>
            <p className="text-muted-foreground">
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
