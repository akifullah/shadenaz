'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Globe, ArrowLeft } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.union([z.literal(""), z.string().email('Invalid email address')]).optional(),
  address_line_1: z.string().min(1, 'Address Line 1 is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  emergency_contact_name: z.string().min(1, 'Emergency Contact Name is required'),
  emergency_contact_number: z.string().min(1, 'Emergency Contact Number is required'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  message: z.string().optional(),
  treatment_id: z.number(),
  details: z.record(z.string(), z.any()).optional()
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

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingTreatments, setIsLoadingTreatments] = useState(true);
  const [selectedTreatmentObj, setSelectedTreatmentObj] = useState<any>(null);

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
      treatment_id: 0,
      details: {}
    }
  });

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = form;

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [schedule, setSchedule] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const watchedDateStr = watch("date");
  const watchedTimeStr = watch("time");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/treatments`)
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
              setSelectedTreatmentObj(found);
              setValue('treatment_id', found.id);
              setStep(2);
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingTreatments(false));
  }, [treatmentParam, setValue]);

  // Fetch schedule for the dates
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/slots`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSchedule(data.data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (watchedDateStr) {
      const dayOfWeek = dayjs(watchedDateStr).format('dddd');
      const dayData = schedule.find(s => s.day_of_week === dayOfWeek && s.is_active === 1);

      if (dayData && dayData.start_time && dayData.end_time) {
        let start = dayjs(`${watchedDateStr} ${dayData.start_time}`, "YYYY-MM-DD hh:mm A");
        let end = dayjs(`${watchedDateStr} ${dayData.end_time}`, "YYYY-MM-DD hh:mm A");

        if (end.isBefore(start)) {
          end = end.add(1, 'day');
        }

        const slots = [];
        let current = start;
        while (current.isBefore(end)) {
          slots.push(current.format("hh:mm A"));
          current = current.add(30, 'minute');
        }
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    } else {
      setAvailableSlots([]);
    }
  }, [watchedDateStr, schedule]);

  const onSubmit = async (values: BookingFormValues) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: values.name,
          date_of_birth: values.date_of_birth,
          gender: values.gender,
          phone: values.phone,
          email: values.email || null,
          address_line_1: values.address_line_1,
          address_line_2: values.address_line_2 || null,
          city: values.city,
          postcode: values.postcode,
          emergency_contact_name: values.emergency_contact_name,
          emergency_contact_number: values.emergency_contact_number,
          booking_date: values.date,
          booking_time: values.time,
          treatment_id: values.treatment_id,
          message: values.message,
          treatment_details: values.details
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.message || "An error occurred while booking. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTreatment = (treatment: any) => {
    setSelectedTreatmentObj(treatment);
    setValue('treatment_id', treatment.id);
    setValue('details', {}); // Reset details when treatment changes
    setStep(2);
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
                Thank you for your booking. We'll be in touch soon.
              </p>
            </div>

            <div className="bg-secondary/30 p-5 md:p-8 space-y-4 border border-accent/50">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-left">
                  <p className="text-xs text-muted-foreground tracking-widest font-medium uppercase">Treatment</p>
                  <p className="text-lg font-medium text-foreground mt-2">{selectedTreatmentObj?.name}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground tracking-widest font-medium uppercase">Date & Time</p>
                  <p className="text-lg font-medium text-foreground mt-2">{watch('date')} at {watch('time')}</p>
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
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-24">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <p className="text-[10px] md:text-xs tracking-widest text-muted-foreground font-medium uppercase">Booking</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground">
              {step === 1 ? 'Select a Treatment' : 'Schedule Details'}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground">
              {step === 1 ? 'Choose from our range of treatments below' : 'Fill out the details below and pick a time'}
            </p>
          </div>

          <div className="bg-card border border-accent/30 p-5 sm:p-12">
            {step === 1 && (
              <div className="space-y-12 text-left">
                {isLoadingTreatments ? (
                  <div className="flex justify-center p-12">
                    <p className="text-muted-foreground">Loading treatments...</p>
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
                        {category.treatments?.map((treatment: any, idx: number) => (
                          <div
                            key={treatment.id || idx}
                            onClick={() => handleSelectTreatment(treatment)}
                            className="cursor-pointer border border-accent hover:border-primary transition-all duration-300 p-4 md:p-6 bg-card hover:shadow-md group"
                          >
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-base md:text-lg font-medium text-foreground group-hover:text-primary transition mb-2">
                                  {treatment.name}
                                </h4>
                                {treatment.description && (
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {treatment.description}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2 border-t border-accent/50 pt-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-muted-foreground tracking-wide">Price</span>
                                  <span className="text-xl md:text-2xl font-medium text-primary">£{treatment.display_price || treatment.price}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-muted-foreground tracking-wide">Duration</span>
                                  <span className="text-sm font-medium text-foreground">{treatment.duration || treatment.time} mins</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-accent/50 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium mb-1">Selected Treatment</p>
                    <h3 className="text-xl font-medium">{selectedTreatmentObj?.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Change
                  </button>
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
                  <h4 className="text-lg font-medium">Address</h4>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground tracking-wide">Address Line 1 *</label>
                      <input
                        type="text"
                        {...register('address_line_1')}
                        className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none transition ${errors.address_line_1 ? 'border-destructive focus:border-destructive' : 'border-accent focus:border-primary'}`}
                        placeholder="Street Address"
                      />
                      {errors.address_line_1 && <p className="text-destructive text-xs">{errors.address_line_1.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground tracking-wide">Address Line 2 <span className="text-muted-foreground font-normal">(Optional)</span></label>
                      <input
                        type="text"
                        {...register('address_line_2')}
                        className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none transition ${errors.address_line_2 ? 'border-destructive focus:border-destructive' : 'border-accent focus:border-primary'}`}
                        placeholder="Apartment, suite, unit etc."
                      />
                      {errors.address_line_2 && <p className="text-destructive text-xs">{errors.address_line_2.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground tracking-wide">City *</label>
                      <input
                        type="text"
                        {...register('city')}
                        className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none transition ${errors.city ? 'border-destructive focus:border-destructive' : 'border-accent focus:border-primary'}`}
                      />
                      {errors.city && <p className="text-destructive text-xs">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground tracking-wide">Postcode *</label>
                      <input
                        type="text"
                        {...register('postcode')}
                        className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none transition ${errors.postcode ? 'border-destructive focus:border-destructive' : 'border-accent focus:border-primary'}`}
                      />
                      {errors.postcode && <p className="text-destructive text-xs">{errors.postcode.message}</p>}
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

                {/* DYNAMIC FIELDS FROM API */}
                {selectedTreatmentObj?.details && selectedTreatmentObj.details.length > 0 && (
                  <div className="space-y-6 pt-4 border-t border-accent/50">
                    <h4 className="text-lg font-medium">Additional Information</h4>
                    {selectedTreatmentObj.details.map((detail: any) => {
                      const isRequired = detail.required === 1 || detail.required === true;
                      let options: string[] = [];
                      try {
                        if (detail.options && detail.options !== "null") {
                          options = JSON.parse(detail.options);
                        }
                      } catch (e) {
                        console.error("Failed to parse options", e);
                      }

                      return (
                        <div key={detail.id} className="space-y-3">
                          <label className="text-sm font-medium text-foreground tracking-wide">
                            {detail.label} {isRequired && '*'}
                          </label>

                          {detail.type === 'textarea' && (
                            <textarea
                              {...register(`details.${detail.id}` as const)}
                              placeholder={detail.placeholder || ''}
                              required={isRequired}
                              className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition resize-y min-h-[100px]"
                            />
                          )}

                          {detail.type === 'text' && (
                            <input
                              type="text"
                              {...register(`details.${detail.id}` as const)}
                              placeholder={detail.placeholder || ''}
                              required={isRequired}
                              className="w-full px-4 py-3 border border-accent bg-background text-foreground focus:border-primary focus:outline-none transition"
                            />
                          )}

                          {detail.type === 'checkbox' && options.length > 0 && (
                            <div className="flex gap-4 flex-wrap">
                              {options.map((opt, i) => (
                                <label key={i} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    value={opt}
                                    {...register(`details.${detail.id}` as const)}
                                    className="w-4 h-4 text-primary bg-background border-accent rounded focus:ring-primary"
                                  />
                                  <span className="text-sm text-foreground">{opt}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {detail.type === 'checkbox' && options.length === 0 && (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                {...register(`details.${detail.id}` as const)}
                                required={isRequired}
                                className="w-4 h-4 text-primary bg-background border-accent rounded focus:ring-primary"
                              />
                              <span className="text-sm text-foreground">{detail.placeholder || 'Yes'}</span>
                            </label>
                          )}

                          {detail.type === 'select' && options.length > 0 && (
                            <select
                              {...register(`details.${detail.id}` as const)}
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

                <div className="grid grid-cols-1 gap-6 pt-4 border-t border-accent/50">
                  <style dangerouslySetInnerHTML={{
                    __html: `
                    .rdp-root {
                      --rdp-accent-color: #2563eb;
                      --rdp-background-color: #ebf5ff;
                      margin: 0;
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
                      <div className="flex-1 md:max-w-xs space-y-8">
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
                          availableSlots.length > 0 ? (
                            <div className="h-[400px] overflow-y-auto pr-4 space-y-3 stylish-scrollbar">
                              <Controller
                                control={control}
                                name="time"
                                render={({ field }) => (
                                  <>
                                    {availableSlots.map(slot => (
                                      <button
                                        key={slot}
                                        type="button"
                                        onClick={() => field.onChange(slot)}
                                        className={`cursor-pointer w-full py-4 px-6 rounded text-sm font-medium transition-colors border ${field.value === slot
                                          ? 'bg-blue-600 border-blue-600 text-white'
                                          : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                                          }`}
                                      >
                                        {slot}
                                      </button>
                                    ))}
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
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
