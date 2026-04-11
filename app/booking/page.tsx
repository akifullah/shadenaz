'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState, Suspense, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, ShieldAlert, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dynamic from 'next/dynamic';
import type { StripeCheckoutHandle } from '@/components/stripe-checkout';
import { SignaturePad, MedicalQuestion, ConsentCheckbox } from '@/components/consent-components';

const StripeCheckout = dynamic(() => import('@/components/stripe-checkout'), { ssr: false });

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

// --- Types ---
interface SelectedTreatment {
  treatment_id: number;
  staff_id: number | null;
  treatment_name: string;
  treament_description: string | null;
  treatment_display_price: string | number | null;
  treatment_price: string | number | null;
  treatment_duration: string | number | null;
  details_answers: Record<string, any>; // answers to the treatment's detail questions
  treatmentObj: any; // full treatment object from API (for rendering detail fields)
}

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.union([z.literal(""), z.string().email('Invalid email address')]).optional(),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(), // kept for backend compatibility if needed but removed from UI, though backend will ignore if not sent
  emergency_contact_name: z.string().min(1, 'Emergency Contact Name is required'),
  emergency_contact_number: z.string().min(1, 'Emergency Contact Number is required'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

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

  const [step, setStepRaw] = useState(1);
  const setStep = useCallback((s: number) => {
    setStepRaw(s);
    // Scroll to top on step change to prevent Stripe auto-focus scrolling
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  const [hasSignature, setHasSignature] = useState(false);
  const [consentData, setConsentData] = useState({
    medicalConditions: 'no',
    medicalConditionsDetails: '',
    medications: 'no',
    medicationsDetails: '',
    allergies: 'no',
    allergiesDetails: '',
    previousTreatments: 'no',
    previousTreatmentsDetails: '',
    complications: 'no',
    complicationsDetails: '',
    pregnantOrBreastfeeding: 'no',
    activeInfections: 'no',
    activeInfectionsDetails: '',
    coldSores: 'no',
    coldSoresDetails: '',
    aimsMotivations: '',
    consentTrueInfo: false,
    consentNature: false,
    consentResultsVary: false,
    consentSideEffects: false,
    consentRareRisks: false,
    consentAdditionalTreatments: false,
    consentAftercare: false,
    consentEmergency: false,
    consentOver18: false,
    consentProceed: false,
    signatureDate: '',
  });

  const handleConsentChange = (field: string, value: any) => {
    setConsentData(prev => ({ ...prev, [field]: value }));
  };

  const allConsentsChecked =
    consentData.consentTrueInfo &&
    consentData.consentNature &&
    consentData.consentResultsVary &&
    consentData.consentSideEffects &&
    consentData.consentRareRisks &&
    consentData.consentAdditionalTreatments &&
    consentData.consentAftercare &&
    consentData.consentEmergency &&
    consentData.consentOver18 &&
    consentData.consentProceed;
  const [careGuideOpen, setCareGuideOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingTreatments, setIsLoadingTreatments] = useState(true);

  // Multi-treatment cart
  const [selectedTreatments, setSelectedTreatments] = useState<SelectedTreatment[]>([]);
  const [collapsedTreatmentIdxs, setCollapsedTreatmentIdxs] = useState<Set<number>>(new Set());

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      date_of_birth: '',
      gender: '',
      phone: '',
      email: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      postcode: '',
      emergency_contact_name: '',
      emergency_contact_number: '',
      date: '',
      time: '',
      message: '',
    }
  });

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = form;

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Stripe payment state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const stripeRef = useRef<StripeCheckoutHandle>(null);

  const [availableSlots, setAvailableSlots] = useState<{ id: number; start_time: string; start_time_24: string; end_time: string | null; is_available: boolean }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const watchedDateStr = watch("date");
  const watchedTimeStr = watch("time");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/treatments`, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data || []);
          if (treatmentParam) {
            let found = null;
            for (const cat of data.data || []) {
              const matched = cat.treatments?.find((t: any) => t.name.toLowerCase() === treatmentParam.toLowerCase() || t.slug === treatmentParam);
              if (matched) {
                found = matched;
                break;
              }
            }
            if (found) {
              handleAddTreatment(found);
              setStep(2);
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingTreatments(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treatmentParam]);

  // Fetch available time slots for the selected date
  useEffect(() => {
    if (watchedDateStr) {
      setLoadingSlots(true);
      setAvailableSlots([]);
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/slots?date=${watchedDateStr}`, {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data)) {
            setAvailableSlots(data.data);
          } else {
            setAvailableSlots([]);
          }
        })
        .catch(() => setAvailableSlots([]))
        .finally(() => setLoadingSlots(false));
    } else {
      setAvailableSlots([]);
    }
  }, [watchedDateStr]);

  // Fetch booked/unavailable slots for the selected date
  useEffect(() => {
    if (watchedDateStr) {
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/slots-availability?date=${watchedDateStr}`, {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data)) {
            // Convert "HH:mm:ss" (24h) from API to "hh:mm A" (12h) to match availableSlots format
            const formatted = data.data.map((t: string) => {
              const parsed = dayjs(t, 'HH:mm:ss');
              return parsed.isValid() ? parsed.format('hh:mm A') : t;
            });
            setBookedSlots(formatted);
          } else {
            setBookedSlots([]);
          }
        })
        .catch(() => setBookedSlots([]));
    } else {
      setBookedSlots([]);
    }
  }, [watchedDateStr]);

  // -- Treatment cart helpers --
  const handleAddTreatment = (treatment: any) => {
    const newEntry: SelectedTreatment = {
      treatment_id: treatment.id,
      staff_id: null,
      treatment_name: treatment.name,
      treament_description: treatment.description || null,
      treatment_display_price: treatment.display_price || null,
      treatment_price: treatment.price || null,
      treatment_duration: treatment.duration || treatment.time || null,
      details_answers: {},
      treatmentObj: treatment,
    };
    setSelectedTreatments([newEntry]);
    setCareGuideOpen(false);
    // New treatments are expanded by default (not in collapsedTreatmentIdxs)
    setStep(2);
  };

  const handleRemoveTreatment = (idx: number) => {
    setSelectedTreatments(prev => prev.filter((_, i) => i !== idx));
    setCollapsedTreatmentIdxs(prev => {
      const next = new Set<number>();
      prev.forEach(i => {
        if (i < idx) next.add(i);
        else if (i > idx) next.add(i - 1);
      });
      return next;
    });
  };

  const handleDetailChange = (treatmentIdx: number, detailId: string, value: any) => {
    setSelectedTreatments(prev => {
      const updated = [...prev];
      updated[treatmentIdx] = {
        ...updated[treatmentIdx],
        details_answers: {
          ...updated[treatmentIdx].details_answers,
          [detailId]: value,
        }
      };
      return updated;
    });
  };

  const handleCheckboxDetailChange = (treatmentIdx: number, detailId: string, optionValue: string, checked: boolean) => {
    setSelectedTreatments(prev => {
      const updated = [...prev];
      const currentVal = updated[treatmentIdx].details_answers[detailId];
      let arr: string[] = Array.isArray(currentVal) ? [...currentVal] : [];
      if (checked) {
        if (!arr.includes(optionValue)) arr.push(optionValue);
      } else {
        arr = arr.filter(v => v !== optionValue);
      }
      updated[treatmentIdx] = {
        ...updated[treatmentIdx],
        details_answers: {
          ...updated[treatmentIdx].details_answers,
          [detailId]: arr,
        }
      };
      return updated;
    });
  };

  // Calculate totals
  const totalPrice = selectedTreatments.reduce((sum, t) => {
    const price = parseFloat(String(t.treatment_price || '0'));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  const totalDuration = selectedTreatments.reduce((sum, t) => {
    const dur = parseInt(String(t.treatment_duration || '0'));
    return sum + (isNaN(dur) ? 0 : dur);
  }, 0);

  // Create PaymentIntent when step 2 loads
  useEffect(() => {
    if (step === 2 && !clientSecret && selectedTreatments.length > 0) {
      setLoadingPayment(true);
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: 'Booking Deposit', email: null }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            setErrorMessage(data.message || 'Failed to initialize payment. Please try again.');
          }
        })
        .catch(() => setErrorMessage('Network error initializing payment.'))
        .finally(() => setLoadingPayment(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Stripe form now loads immediately; lazy loading removed to speed up display.

  // On form submit: validate → confirm Stripe payment → create booking
  const onSubmit = async (values: BookingFormValues) => {
    if (selectedTreatments.length === 0) {
      setErrorMessage("Please select at least one treatment.");
      return;
    }
    if (!stripeRef.current) {
      setErrorMessage("Payment form is not ready yet. Please wait a moment.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    // 1. Confirm payment with Stripe
    const paymentResult = await stripeRef.current.confirmPayment();
    if (!paymentResult.success) {
      setErrorMessage(paymentResult.error || 'Payment failed.');
      setLoading(false);
      return;
    }

    // 2. Payment succeeded — now create the booking
    const booking_treatments = selectedTreatments.map(t => {
      const detailsWithQuestions = (t.treatmentObj?.details || []).map((detail: any) => {
        const answer = t.details_answers[detail.id];
        return { id: detail.id, question: detail.label, type: detail.type, answer: answer ?? null };
      }).filter((d: any) => d.answer !== null && d.answer !== '' && !(Array.isArray(d.answer) && d.answer.length === 0));
      return {
        treatment_id: t.treatment_id, staff_id: t.staff_id,
        treatment_name: t.treatment_name, treament_description: t.treament_description,
        treatment_price: t.treatment_price, treatment_duration: t.treatment_duration,
        details: detailsWithQuestions,
      };
    });


    const canvasEl = document.querySelector('canvas') as HTMLCanvasElement & { getSignatureData?: () => string };
    const signatureData = canvasEl?.getSignatureData?.() || canvasEl?.toDataURL('image/png') || '';

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: values.name, date_of_birth: values.date_of_birth, gender: values.gender,
          phone: values.phone, email: values.email || null,
          address_line_1: values.address_line_1, address_line_2: values.address_line_2 || null,
          city: values.city, postcode: values.postcode,
          emergency_contact_name: values.emergency_contact_name,
          emergency_contact_number: values.emergency_contact_number,
          booking_date: values.date, booking_time: values.time, message: values.message,
          booking_treatments, payment_intent_id: paymentResult.paymentIntentId,
          total_amount: totalPrice,
          medical_conditions: consentData.medicalConditions,
          medical_conditions_details: consentData.medicalConditionsDetails || null,
          medications: consentData.medications,
          medications_details: consentData.medicationsDetails || null,
          allergies: consentData.allergies,
          allergies_details: consentData.allergiesDetails || null,
          previous_treatments: consentData.previousTreatments,
          previous_treatments_details: consentData.previousTreatmentsDetails || null,
          complications: consentData.complications,
          complications_details: consentData.complicationsDetails || null,
          pregnant_or_breastfeeding: consentData.pregnantOrBreastfeeding,
          active_infections: consentData.activeInfections,
          active_infections_details: consentData.activeInfectionsDetails || null,
          cold_sores: consentData.coldSores,
          cold_sores_details: consentData.coldSoresDetails || null,
          aims_motivations: consentData.aimsMotivations || null,
          consent_true_info: consentData.consentTrueInfo,
          consent_nature: consentData.consentNature,
          consent_results_vary: consentData.consentResultsVary,
          consent_side_effects: consentData.consentSideEffects,
          consent_rare_risks: consentData.consentRareRisks,
          consent_additional_treatments: consentData.consentAdditionalTreatments,
          consent_aftercare: consentData.consentAftercare,
          consent_emergency: consentData.consentEmergency,
          consent_over_18: consentData.consentOver18,
          consent_proceed: consentData.consentProceed,
          signature_data: signatureData,
          signature_date: consentData.signatureDate,
          care_guide: selectedTreatments[0]?.treatmentObj?.care_guide ?? null,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.message || 'Booking failed after payment. Please contact support.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Network error after payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main className="w-full min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 lg:px-10 py-12 md:py-24 text-center space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/30 rounded">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-light text-foreground">Booking Confirmed!</h1>
              <p className="text-sm md:text-lg text-muted-foreground">
                Thank you for your booking. We&apos;ll be in touch soon.
              </p>
            </div>

            <div className="bg-secondary/30 p-5 md:p-8 space-y-4 border border-accent/50">
              <div className="text-left space-y-3">
                <p className="text-xs text-muted-foreground tracking-widest font-medium uppercase">Treatments</p>
                {selectedTreatments.map((t, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-base font-medium text-foreground">{t.treatment_name}</span>
                    <span className="text-sm text-primary font-medium">£{t.treatment_price}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-accent/50">
                <div className="text-left">
                  <p className="text-xs text-muted-foreground tracking-widest font-medium uppercase">Date & Time</p>
                  <p className="text-lg font-medium text-foreground mt-2">{watch('date')} at {watch('time')}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground tracking-widest font-medium uppercase">Total</p>
                  <p className="text-lg font-medium text-primary mt-2">£{totalPrice.toFixed(2)}</p>
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
        <div className="max-w-7xl mx-auto px-1 sm:px-8 lg:px-10 py-10 sm:py-24">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            {/* <p className="text-[10px] md:text-xs tracking-widest text-muted-foreground font-medium uppercase">Booking</p> */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground">
              {step === 1 ? 'Treatments & Pricing' : 'Schedule Details'}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground">
              {step === 1 ? '' : 'Fill out the details below and pick a time'}
            </p>
          </div>

          <div className="bg-card border border-accent/30 p-5 px-2 sm:p-12">
            {step === 1 && (
              <div className="space-y-12 text-left">
                {/* Show selected treatments summary if any */}
                {selectedTreatments.length > 0 && (
                  <div className="space-y-4 pb-6 border-b border-accent/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-foreground">
                        Selected Treatments ({selectedTreatments.length})
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-primary text-primary-foreground px-6 py-2 text-sm tracking-widest font-medium hover:opacity-90 transition"
                      >
                        CONTINUE →
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedTreatments.map((t, i) => (
                        <div key={i} className="flex items-center justify-between bg-secondary/20 border border-accent/30 px-4 py-3">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-foreground">{t.treatment_name}</span>
                            <span className="text-xs text-muted-foreground ml-3">{t.treatment_duration} mins</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-primary">£{t.treatment_price}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTreatment(i)}
                              className="text-red-500 hover:text-red-700 transition p-1"
                              title="Remove treatment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2">
                      <span className="text-muted-foreground">
                        Total: {totalDuration} mins
                      </span>
                      <span className="text-lg font-medium text-primary">£{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {isLoadingTreatments ? (
                  <div className="flex justify-center p-12">
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="animate-spin text-primary w-8 h-8 md:w-12 md:h-12" />
                      <span className="ml-2 text-primary">Please wait...</span>
                    </div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="flex justify-center p-12">
                    <p className="text-muted-foreground">No treatments available at the moment.</p>
                  </div>
                ) : (
                  categories.map(category => (
                    <div key={category.id} className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-light text-foreground">{category.name}</h2>
                        {category.description && (
                          <p className="text-muted-foreground text-sm mt-2">{category.description}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {category.treatments?.map((treatment: any, idx: number) => {
                          const isAlreadySelected = selectedTreatments.some(t => t.treatment_id === treatment.id);
                          return (
                            <div
                              key={treatment.id || idx}
                              className={`border transition-all duration-300 p-4 md:p-6 bg-card group ${isAlreadySelected
                                ? 'border-primary/50 bg-primary/5'
                                : 'border-accent hover:border-primary hover:shadow-md cursor-pointer'
                                }`}
                              onClick={() => {
                                if (!isAlreadySelected) handleAddTreatment(treatment);
                              }}
                            >
                              <div className="space-y-4">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className={`text-base md:text-lg font-medium transition ${isAlreadySelected ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                                      {treatment.name}
                                    </h4>
                                    {isAlreadySelected ? (
                                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 font-medium tracking-wide">SELECTED</span>
                                    ) : (
                                      <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                                    )}
                                  </div>
                                  {treatment.description && (
                                    <p className="text-sm text-muted-foreground mb-4">
                                      {treatment.description}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2 border-t border-accent/50 pt-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground tracking-wide">Price</span>
                                    <span className="text-xl md:text-2xl font-medium text-primary">{treatment.display_price || treatment.price}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground tracking-wide">Duration</span>
                                    <span className="text-sm font-medium text-foreground">{treatment.display_time || treatment.time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}

                {/* Bottom continue button */}
                {selectedTreatments.length > 0 && (
                  <div className="pt-6 border-t border-accent/50 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-primary text-primary-foreground px-10 py-3 text-sm tracking-widest font-medium hover:opacity-90 transition"
                    >
                      CONTINUE →
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Selected Treatments Summary */}
                <div className="mb-6 pb-6 border-b border-accent/50 text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium mb-1">Selected Treatments</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTreatments.length} treatment{selectedTreatments.length !== 1 ? 's' : ''} · {totalDuration} mins · £{totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" /> Change
                    </button>
                  </div>

                  {/* Treatment cards with expandable details */}
                  <div className="space-y-3">
                    {selectedTreatments.map((selectedTreatment, tIdx) => {
                      const treatmentObj = selectedTreatment.treatmentObj;
                      const hasDetails = treatmentObj?.details && treatmentObj.details.length > 0;
                      const isExpanded = !collapsedTreatmentIdxs.has(tIdx);

                      return (
                        <div key={tIdx} className="border border-accent/50 bg-secondary/10">
                          {/* Treatment header row */}
                          <div
                            className={`flex items-center justify-between px-4 py-3 ${hasDetails ? 'cursor-pointer' : ''}`}
                            onClick={() => {
                              if (hasDetails) {
                                setCollapsedTreatmentIdxs(prev => {
                                  const next = new Set(prev);
                                  if (isExpanded) next.add(tIdx);
                                  else next.delete(tIdx);
                                  return next;
                                });
                              }
                            }}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-foreground truncate">{selectedTreatment.treatment_name}</h4>
                                <p className="text-xs text-muted-foreground">{selectedTreatment.treatment_duration} mins · £{selectedTreatment.treatment_price}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {hasDetails && (
                                <span className="text-xs text-primary font-medium">
                                  {isExpanded ? 'Hide' : 'Details'}
                                </span>
                              )}
                              {hasDetails && (
                                isExpanded ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveTreatment(tIdx);
                                }}
                                className="text-red-500 hover:text-red-700 transition p-1 ml-2"
                                title="Remove treatment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Expandable additional information */}
                          {hasDetails && isExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-accent/30 space-y-4">
                              <h5 className="text-sm font-medium text-foreground">Additional Information</h5>
                              {treatmentObj.details.map((detail: any) => {
                                const isRequired = detail.required === 1 || detail.required === true;
                                let options: string[] = [];
                                try {
                                  if (detail.options && detail.options !== "null") {
                                    options = JSON.parse(detail.options);
                                  }
                                } catch (e) {
                                  console.error("Failed to parse options", e);
                                }

                                const detailValue = selectedTreatment.details_answers[detail.id];

                                return (
                                  <div key={detail.id} className="space-y-2">
                                    <label className="text-sm font-medium text-foreground tracking-wide">
                                      {detail.label} {isRequired && '*'}
                                    </label>

                                    {detail.type === 'textarea' && (
                                      <textarea
                                        value={detailValue || ''}
                                        onChange={(e) => handleDetailChange(tIdx, detail.id, e.target.value)}
                                        placeholder={detail.placeholder || ''}
                                        required={isRequired}
                                        className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition resize-y min-h-[100px]"
                                      />
                                    )}

                                    {detail.type === 'text' && (
                                      <input
                                        type="text"
                                        value={detailValue || ''}
                                        onChange={(e) => handleDetailChange(tIdx, detail.id, e.target.value)}
                                        placeholder={detail.placeholder || ''}
                                        required={isRequired}
                                        className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition"
                                      />
                                    )}

                                    {detail.type === 'checkbox' && options.length > 0 && (
                                      <div className="flex gap-4 flex-wrap">
                                        {options.map((opt, i) => {
                                          const checkedArr = Array.isArray(detailValue) ? detailValue : [];
                                          return (
                                            <label key={i} className="flex items-center gap-2 cursor-pointer">
                                              <input
                                                type="checkbox"
                                                value={opt}
                                                checked={checkedArr.includes(opt)}
                                                onChange={(e) => handleCheckboxDetailChange(tIdx, detail.id, opt, e.target.checked)}
                                                className="w-4 h-4 text-primary bg-background border-accent rounded focus:ring-primary"
                                              />
                                              <span className="text-sm text-foreground">{opt}</span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    )}

                                    {detail.type === 'checkbox' && options.length === 0 && (
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={!!detailValue}
                                          onChange={(e) => handleDetailChange(tIdx, detail.id, e.target.checked)}
                                          required={isRequired}
                                          className="w-4 h-4 text-primary bg-background border-accent rounded focus:ring-primary"
                                        />
                                        <span className="text-sm text-foreground">{detail.placeholder || 'Yes'}</span>
                                      </label>
                                    )}

                                    {detail.type === 'select' && options.length > 0 && (
                                      <select
                                        value={detailValue || ''}
                                        onChange={(e) => handleDetailChange(tIdx, detail.id, e.target.value)}
                                        required={isRequired}
                                        className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition"
                                      >
                                        <option value="">Select an option</option>
                                        {options.map((opt, i) => (
                                          <option key={i} value={opt}>{opt}</option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Care Guide Accordion – shown when the selected treatment has a care_guide */}
                  {selectedTreatments.length > 0 && selectedTreatments[0].treatmentObj?.care_guide && (() => {
                    const guide = selectedTreatments[0].treatmentObj.care_guide;
                    const isOpen = careGuideOpen;
                    return (
                      <div className="space-y-4 pt-4 border-t border-accent/50">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📋</span>
                          <h3 className="text-lg font-medium text-foreground tracking-wide">Pre &amp; Post Care</h3>
                        </div>

                        <div
                          className={cn(
                            "group border border-accent/20 transition-all duration-500 overflow-hidden",
                            isOpen ? "bg-card shadow-2xl border-primary/20" : "bg-card/50 hover:bg-card/80"
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setCareGuideOpen(o => !o)}
                            className="w-full flex items-center justify-between p-3 text-left group-hover:cursor-pointer"
                          >
                            <div className="space-y-1">
                              <h2 className={cn(
                                "text-sm font-medium tracking-tight transition-colors duration-300",
                                isOpen ? "text-primary" : "text-foreground"
                              )}>
                                {guide.title}
                              </h2>
                              <p className="text-xs text-muted-foreground tracking-widest uppercase font-light">
                                {isOpen ? "Collapse details" : "View protocol"}
                              </p>
                            </div>
                            <div className={cn(
                              "flex items-center justify-center w-6 h-6 rounded-full border border-accent/20 transition-all duration-500",
                              isOpen ? "rotate-180 bg-primary border-primary text-primary-foreground" : "text-muted-foreground"
                            )}>
                              <ChevronDown size={13} />
                            </div>
                          </button>

                          <div className={cn(
                            "grid transition-all duration-500 ease-in-out",
                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          )}>
                            <div className="overflow-hidden">
                              <div className="p-4 md:p-8 pt-0 space-y-6 md:space-y-10">
                                {guide.sections.map((section: any, idx: number) => (
                                  <div key={idx} className={cn(
                                    "relative pl-4 space-y-2",
                                    section.type === 'critical' && "bg-destructive/5 border-destructive/20 p-2",
                                    section.type === 'warning' && "bg-amber-500/5 border-amber-500/20 p-2",
                                    section.type === 'info' && "bg-primary/5 border-primary/20 p-2"
                                  )}>
                                    <div className="flex items-center gap-1.5">
                                      {section.type === 'critical' && <ShieldAlert className="text-destructive" size={20} />}
                                      {section.type === 'warning' && <AlertTriangle className="text-amber-500" size={20} />}
                                      {section.type === 'info' && <Info className="text-primary" size={20} />}
                                      {!section.type && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/30" />}
                                      <h3 className={cn(
                                        "text-xs tracking-widest font-bold uppercase",
                                        section.type === 'critical' ? "text-destructive" :
                                          section.type === 'warning' ? "text-amber-500" :
                                            section.type === 'info' ? "text-primary" : "text-foreground"
                                      )}>
                                        {section.title}
                                      </h3>
                                    </div>

                                    <ul className="space-y-2 md:space-y-3">
                                      {section.items.map((item: string, itemIdx: number) => (
                                        <li key={itemIdx} className="flex gap-1.5 text-muted-foreground text-xs leading-snug font-light">
                                          <CheckCircle2 className={cn(
                                            "flex-shrink-0 mt-0.5",
                                            section.type === 'critical' ? "text-destructive/50" :
                                              section.type === 'warning' ? "text-amber-500/50" :
                                                "text-primary/40"
                                          )} size={12} />
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>


                <div className="grid grid-cols-1 gap-6 pt-4 border-t border-accent/50">
                  <style dangerouslySetInnerHTML={{
                    __html: `
                    .rdp-root {
                      --rdp-accent-color: #2563eb;
                      --rdp-background-color: #ebf5ff;
                      margin: 0;
                      width: 100%;
                    }
                 
                    .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
                      background-color: var(--rdp-accent-color);
                      color: white;
                      border-radius: 9999px;
                    }
                    .rdp-day {
                       border-radius: 9999px;
                    }
                  `}} />

                  <div className="mt-2 text-left space-y-4">
                    <h3 className="text-xl font-medium tracking-tight text-foreground mb-2">Select Date & Time <span className="text-destructive">*</span></h3>
                    {(errors.date || errors.time) && (
                      <p className="text-destructive text-sm bg-destructive/10 p-2 rounded">
                        {errors.date?.message || errors.time?.message}
                      </p>
                    )}

                    <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                      <div className="flex-1  space-y-8">
                        <div className="flex justify-center md:justify-start">
                          <Controller
                            control={control}
                            name="date"
                            render={({ field }) => (
                              <DayPicker
                                mode="single"
                                selected={field.value ? dayjs(field.value).toDate() : undefined}
                                onSelect={(date) => {
                                  field.onChange(date ? dayjs(date).format('YYYY-MM-DD') : '');
                                  setValue('time', '');
                                }}
                                className="bg-transparent"
                                disabled={{ before: dayjs().startOf('day').toDate() }}
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-4 pt-4">
                          {watchedDateStr && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-foreground mb-1">Selected Date & Time</p>
                              <p className="text-sm text-blue-600 font-medium">
                                {dayjs(watchedDateStr).format('dddd, MMMM D, YYYY')}
                                {watchedTimeStr && ` at ${watchedTimeStr}`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        {watchedDateStr ? (
                          loadingSlots ? (
                            <div className="h-[400px] flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md bg-accent/5">
                              <div className="flex flex-col items-center gap-2">
                                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Loading available slots...</span>
                              </div>
                            </div>
                          ) : availableSlots.length > 0 ? (
                            <div className="h-[400px] overflow-y-auto pr-4 space-y-3 stylish-scrollbar">
                              <Controller
                                control={control}
                                name="time"
                                render={({ field }) => (
                                  <>
                                    {availableSlots.map(slot => {
                                      const isBooked = bookedSlots.includes(slot.start_time);
                                      const slotDateTime = dayjs(`${watchedDateStr} ${slot.start_time}`, "YYYY-MM-DD hh:mm A");
                                      const isPastToday = dayjs().isSame(watchedDateStr, 'day') && slotDateTime.isBefore(dayjs());
                                      const isDisabled = isBooked || isPastToday;

                                      return (
                                        <button
                                          key={slot.id}
                                          type="button"
                                          onClick={() => !isDisabled && field.onChange(slot.start_time)}
                                          disabled={isDisabled}
                                          className={`w-full py-4 px-6 rounded text-sm font-medium transition-colors border ${isDisabled
                                            ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed line-through'
                                            : field.value === slot.start_time
                                              ? 'bg-blue-600 border-blue-600 text-white cursor-pointer'
                                              : 'border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer'
                                            }`}
                                        >
                                          {slot.start_time}{slot.end_time ? ` – ${slot.end_time}` : ''}{isBooked ? ' (Booked)' : isPastToday ? ' (Past)' : ''}
                                        </button>
                                      );
                                    })}
                                  </>
                                )}
                              />
                            </div>
                          ) : (
                            <div className="h-[400px] flex items-center justify-center text-muted-foreground text-sm border rounded-md bg-accent/10">
                              No availability on this date.
                            </div>
                          )
                        ) : (
                          <div className="h-[400px] flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md bg-accent/5">
                            Please select a date first.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-6">
                  <h4 className="text-lg font-medium">Personal Details</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground tracking-wide">Full Name *</label>
                      <input
                        type="text"
                        {...register('name')}
                        className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none transition ${errors.name ? 'border-destructive focus:border-destructive' : 'border-accent focus:border-primary'}`}
                        placeholder="Your Name"
                      />
                      {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground tracking-wide">Date of Birth *</label>
                      <input
                        type="date"
                        {...register('date_of_birth')}
                        className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none transition ${errors.date_of_birth ? 'border-destructive focus:border-destructive' : 'border-accent focus:border-primary'}`}
                      />
                      {errors.date_of_birth && <p className="text-destructive text-xs">{errors.date_of_birth.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground tracking-wide">Gender *</label>
                      <select
                        {...register('gender')}
                        className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none transition ${errors.gender ? 'border-destructive focus:border-destructive' : 'border-accent focus:border-primary'}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <p className="text-destructive text-xs">{errors.gender.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground tracking-wide">Email</label>
                      <input
                        type="email"
                        {...register('email')}
                        className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none transition ${errors.email ? 'border-destructive focus:border-destructive' : 'border-accent focus:border-primary'}`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground tracking-wide">Phone *</label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none transition ${errors.phone ? 'border-destructive focus:border-destructive' : 'border-accent focus:border-primary'}`}
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>


                <div className="pt-4 border-t border-accent/50 space-y-6">
                  <h4 className="text-lg font-medium">Emergency Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground tracking-wide">Contact Name *</label>
                      <input
                        type="text"
                        {...register('emergency_contact_name')}
                        className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none transition ${errors.emergency_contact_name ? 'border-destructive focus:border-destructive' : 'border-accent focus:border-primary'}`}
                      />
                      {errors.emergency_contact_name && <p className="text-destructive text-xs">{errors.emergency_contact_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground tracking-wide">Contact Number *</label>
                      <input
                        type="tel"
                        {...register('emergency_contact_number')}
                        className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none transition ${errors.emergency_contact_number ? 'border-destructive focus:border-destructive' : 'border-accent focus:border-primary'}`}
                      />
                      {errors.emergency_contact_number && <p className="text-destructive text-xs">{errors.emergency_contact_number.message}</p>}
                    </div>
                  </div>
                </div>




                <div className="space-y-2 pt-4 border-t border-accent/50">
                  <label className="text-sm font-medium text-foreground tracking-wide">Additional Notes</label>
                  <textarea
                    {...register('message')}
                    placeholder="Any additional information or questions..."
                    rows={4}
                    className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition resize-y"
                  />
                </div>

                {errorMessage && (
                  <div className="bg-red-50 text-red-600 p-4 border border-red-200 text-sm font-medium rounded-md">
                    {errorMessage}
                  </div>
                )}

                {/* ── MEDICAL HISTORY ── */}
                <div className="pt-8 space-y-6">
                  <section className="space-y-5 md:space-y-8">
                    <div className="flex items-center gap-3 border-b border-accent/50 pb-4">
                      <span className="text-xl">🔍</span>
                      <h2 className="text-xl md:text-2xl font-light text-foreground tracking-wide">Medical History</h2>
                    </div>

                    {/* Q1 – Medical conditions */}
                    <MedicalQuestion
                      number={1}
                      question="Do you have any medical conditions?"
                      hint="e.g. autoimmune disease, bleeding disorders, skin conditions, diabetes, epilepsy, etc."
                      value={consentData.medicalConditions}
                      details={consentData.medicalConditionsDetails}
                      onValueChange={(v) => handleConsentChange('medicalConditions', v)}
                      onDetailsChange={(v) => handleConsentChange('medicalConditionsDetails', v)}
                    />

                    {/* Q2 – Medications */}
                    <MedicalQuestion
                      number={2}
                      question="Are you currently taking any medications or supplements?"
                      hint="including blood thinners, antibiotics, steroids, prescribed vitamins"
                      value={consentData.medications}
                      details={consentData.medicationsDetails}
                      onValueChange={(v) => handleConsentChange('medications', v)}
                      onDetailsChange={(v) => handleConsentChange('medicationsDetails', v)}
                    />

                    {/* Q3 – Allergies */}
                    <MedicalQuestion
                      number={3}
                      question="Do you have any known allergies?"
                      hint="medications, latex, lidocaine, foods, skincare, etc."
                      value={consentData.allergies}
                      details={consentData.allergiesDetails}
                      onValueChange={(v) => handleConsentChange('allergies', v)}
                      onDetailsChange={(v) => handleConsentChange('allergiesDetails', v)}
                    />

                    {/* Q4 – Previous treatments */}
                    <MedicalQuestion
                      number={4}
                      question="Have you had any previous aesthetic or cosmetic treatments?"
                      hint="dermal filler, botulinum toxin, skin boosters, PRP, laser, surgery, etc."
                      value={consentData.previousTreatments}
                      details={consentData.previousTreatmentsDetails}
                      onValueChange={(v) => handleConsentChange('previousTreatments', v)}
                      onDetailsChange={(v) => handleConsentChange('previousTreatmentsDetails', v)}
                      detailsPlaceholder="Please specify treatment and date"
                    />

                    {/* Q5 – Complications */}
                    <MedicalQuestion
                      number={5}
                      question="Have you ever experienced a complication or reaction to cosmetic treatments?"
                      value={consentData.complications}
                      details={consentData.complicationsDetails}
                      onValueChange={(v) => handleConsentChange('complications', v)}
                      onDetailsChange={(v) => handleConsentChange('complicationsDetails', v)}
                    />

                    {/* Q6 – Pregnant / breastfeeding */}
                    <div className="space-y-3 p-6 border border-accent/30 bg-white/50">
                      <p className="text-sm text-foreground font-medium">
                        <span className="text-muted-foreground mr-2">6.</span>
                        Are you currently pregnant or breastfeeding?
                      </p>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="pregnantOrBreastfeeding"
                            value="no"
                            checked={consentData.pregnantOrBreastfeeding === 'no'}
                            onChange={(e) => handleConsentChange('pregnantOrBreastfeeding', e.target.value)}
                            className="w-4 h-4 accent-primary"
                          />
                          <span className="text-sm text-foreground/80 group-hover:text-foreground transition">No</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="pregnantOrBreastfeeding"
                            value="yes"
                            checked={consentData.pregnantOrBreastfeeding === 'yes'}
                            onChange={(e) => handleConsentChange('pregnantOrBreastfeeding', e.target.value)}
                            className="w-4 h-4 accent-primary"
                          />
                          <span className="text-sm text-foreground/80 group-hover:text-foreground transition">Yes</span>
                        </label>
                      </div>
                    </div>

                    {/* Q7 – Active infections */}
                    <MedicalQuestion
                      number={7}
                      question="Do you have any active infections, cold sores, skin irritation, or inflammation in the treatment area?"
                      value={consentData.activeInfections}
                      details={consentData.activeInfectionsDetails}
                      onValueChange={(v) => handleConsentChange('activeInfections', v)}
                      onDetailsChange={(v) => handleConsentChange('activeInfectionsDetails', v)}
                    />

                    {/* Q8 – Cold sores */}
                    <MedicalQuestion
                      number={8}
                      question="Do you suffer from any cold sores?"
                      value={consentData.coldSores}
                      details={consentData.coldSoresDetails}
                      onValueChange={(v) => handleConsentChange('coldSores', v)}
                      onDetailsChange={(v) => handleConsentChange('coldSoresDetails', v)}
                    />

                    {/* Q9 – Aims and motivations */}
                    <div className="space-y-3 p-6 border border-accent/30 bg-white/50">
                      <p className="text-sm text-foreground font-medium">
                        <span className="text-muted-foreground mr-2">9.</span>
                        What are your aims and motivations for having this procedure?
                      </p>
                      <textarea
                        value={consentData.aimsMotivations}
                        onChange={(e) => handleConsentChange('aimsMotivations', e.target.value)}
                        rows={4}
                        className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40 resize-none"
                        placeholder="Please describe your goals and what you hope to achieve from the treatment..."
                      />
                    </div>
                  </section>

                  {/* ── TREATMENT CONSENT & DECLARATION ── */}
                  <section className="space-y-5 md:space-y-8 pt-8">
                    <div className="flex items-center gap-3 border-b border-accent/50 pb-4">
                      <span className="text-xl">💉</span>
                      <h2 className="text-xl md:text-2xl font-light text-foreground tracking-wide">Treatment Consent &amp; Declaration</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">Please read and confirm each statement below:</p>

                    <div className="space-y-4">
                      <ConsentCheckbox
                        checked={consentData.consentTrueInfo}
                        onChange={(v) => handleConsentChange('consentTrueInfo', v)}
                        label="I confirm that all information provided is true and complete to the best of my knowledge."
                      />
                      <ConsentCheckbox
                        checked={consentData.consentNature}
                        onChange={(v) => handleConsentChange('consentNature', v)}
                        label="I understand the nature and purpose of injectable treatments and have had the opportunity to ask questions."
                      />
                      <ConsentCheckbox
                        checked={consentData.consentResultsVary}
                        onChange={(v) => handleConsentChange('consentResultsVary', v)}
                        label="I understand that results vary and no guarantees can be given."
                      />
                      <ConsentCheckbox
                        checked={consentData.consentSideEffects}
                        onChange={(v) => handleConsentChange('consentSideEffects', v)}
                        label="I understand common side effects include redness, swelling, bruising, tenderness, and temporary asymmetry."
                      />
                      <ConsentCheckbox
                        checked={consentData.consentRareRisks}
                        onChange={(v) => handleConsentChange('consentRareRisks', v)}
                        label="I understand rare but serious risks include infection, allergic reaction, vascular occlusion, tissue damage, scarring, delayed inflammatory reactions, and unsatisfactory results."
                      />
                      <ConsentCheckbox
                        checked={consentData.consentAdditionalTreatments}
                        onChange={(v) => handleConsentChange('consentAdditionalTreatments', v)}
                        label="I understand that additional treatments may be required to achieve or maintain results at additional cost."
                      />
                      <ConsentCheckbox
                        checked={consentData.consentAftercare}
                        onChange={(v) => handleConsentChange('consentAftercare', v)}
                        label="I agree to follow all pre and after care instructions provided."
                      />
                      <ConsentCheckbox
                        checked={consentData.consentEmergency}
                        onChange={(v) => handleConsentChange('consentEmergency', v)}
                        label="I consent to emergency treatment if required."
                      />
                      <ConsentCheckbox
                        checked={consentData.consentOver18}
                        onChange={(v) => handleConsentChange('consentOver18', v)}
                        label="I confirm that I am over 18 years of age."
                      />
                      <ConsentCheckbox
                        checked={consentData.consentProceed}
                        onChange={(v) => handleConsentChange('consentProceed', v)}
                        label="I consent to proceed with today's treatment."
                      />
                    </div>
                  </section>

                  {/* ── SIGNATURE ── */}
                  <section className="space-y-5 md:space-y-8 pt-8">
                    <div className="flex items-center gap-3 border-b border-accent/50 pb-4">
                      <span className="text-xl">✍️</span>
                      <h2 className="text-xl md:text-2xl font-light text-foreground tracking-wide">Client Signature</h2>
                    </div>

                    <SignaturePad onSignatureChange={setHasSignature} />


                  </section>
                </div>

                {/* Stripe Payment Section */}
                <div className="border-t border-accent/50 pt-8 space-y-6">
                  {loadingPayment ? (
                    <div className="flex items-center justify-center py-8">
                      <svg className="animate-spin h-6 w-6 text-primary mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-sm text-muted-foreground">Loading payment form...</span>
                    </div>
                  ) : clientSecret ? (
                    <StripeCheckout
                      ref={stripeRef}
                      clientSecret={clientSecret}
                      totalPrice={totalPrice}
                    />
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading || selectedTreatments.length === 0 || !clientSecret || !allConsentsChecked || !hasSignature}
                    className="w-full bg-primary text-primary-foreground py-3.5 hover:opacity-90 transition text-sm tracking-widest font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        PROCESSING...
                      </>
                    ) : (
                      `PAY £40.00 DEPOSIT & CONFIRM BOOKING`
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
