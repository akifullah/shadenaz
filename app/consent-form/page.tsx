'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState, useRef } from 'react';

interface FormData {
    fullName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    gender: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    medicalConditions: string;
    medicalConditionsDetails: string;
    medications: string;
    medicationsDetails: string;
    allergies: string;
    allergiesDetails: string;
    previousTreatments: string;
    previousTreatmentsDetails: string;
    complications: string;
    complicationsDetails: string;
    pregnantOrBreastfeeding: string;
    activeInfections: string;
    activeInfectionsDetails: string;
    coldSores: string;
    coldSoresDetails: string;
    aimsMotivations: string;
    consentTrueInfo: boolean;
    consentNature: boolean;
    consentResultsVary: boolean;
    consentSideEffects: boolean;
    consentRareRisks: boolean;
    consentAdditionalTreatments: boolean;
    consentAftercare: boolean;
    consentEmergency: boolean;
    consentOver18: boolean;
    consentProceed: boolean;
    signatureDate: string;
}

export default function ConsentFormPage() {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        gender: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
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

    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Signature pad functions
    const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;
        const { x, y } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasSignature(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;
        const { x, y } = getCoordinates(e);
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const allConsentsChecked =
        formData.consentTrueInfo &&
        formData.consentNature &&
        formData.consentResultsVary &&
        formData.consentSideEffects &&
        formData.consentRareRisks &&
        formData.consentAdditionalTreatments &&
        formData.consentAftercare &&
        formData.consentEmergency &&
        formData.consentOver18 &&
        formData.consentProceed;

    if (submitted) {
        return (
            <>
                <Header />
                <main className="w-full bg-background min-h-screen">
                    <div className="bg-gradient-to-b from-accent/30 to-background py-10 md:py-20">
                        <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-10 text-center space-y-4 md:space-y-6">
                            <div className="w-20 h-20 mx-auto bg-green-50 border border-green-200 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-light text-foreground">Thank You</h1>
                            <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto">
                                Your consent form has been submitted successfully. We will review your details before your appointment.
                            </p>
                            <a
                                href="/"
                                className="inline-block bg-primary text-primary-foreground px-12 py-4 hover:opacity-90 transition text-sm tracking-widest font-medium mt-4"
                            >
                                RETURN HOME
                            </a>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="w-full bg-background">
                {/* Hero Section */}
                <div className="bg-gradient-to-b from-accent/30 to-background py-10 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
                        <div className="text-center space-y-3 md:space-y-4">
                            <p className="text-[10px] md:text-xs tracking-widest text-muted-foreground font-medium uppercase">Client Form</p>
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-foreground">Consent Form</h1>
                            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                                Please complete this form carefully before your treatment. All information is confidential and will be stored securely.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="py-8 md:py-16">
                    <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-10">
                        <form onSubmit={handleSubmit} className="space-y-10 md:space-y-16">

                            {/* ── CLIENT DETAILS ── */}
                            <section className="space-y-5 md:space-y-8">
                                <div className="flex items-center gap-3 border-b border-accent/50 pb-4">
                                    <span className="text-xl">👤</span>
                                    <h2 className="text-xl md:text-2xl font-light text-foreground tracking-wide">Client Details</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                            Date of Birth <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.dateOfBirth}
                                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                            className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            required
                                            value={formData.gender}
                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                            className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition appearance-none"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="female">Female</option>
                                            <option value="male">Male</option>
                                            <option value="other">Other</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phoneNumber}
                                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                            className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40"
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                            Emergency Contact Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.emergencyContactName}
                                            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                                            className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40"
                                            placeholder="Emergency contact full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                            Emergency Contact Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.emergencyContactNumber}
                                            onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                                            className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40"
                                            placeholder="Emergency contact phone number"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ── MEDICAL HISTORY ── */}
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
                                    value={formData.medicalConditions}
                                    details={formData.medicalConditionsDetails}
                                    onValueChange={(v) => handleInputChange('medicalConditions', v)}
                                    onDetailsChange={(v) => handleInputChange('medicalConditionsDetails', v)}
                                />

                                {/* Q2 – Medications */}
                                <MedicalQuestion
                                    number={2}
                                    question="Are you currently taking any medications or supplements?"
                                    hint="including blood thinners, antibiotics, steroids, prescribed vitamins"
                                    value={formData.medications}
                                    details={formData.medicationsDetails}
                                    onValueChange={(v) => handleInputChange('medications', v)}
                                    onDetailsChange={(v) => handleInputChange('medicationsDetails', v)}
                                />

                                {/* Q3 – Allergies */}
                                <MedicalQuestion
                                    number={3}
                                    question="Do you have any known allergies?"
                                    hint="medications, latex, lidocaine, foods, skincare, etc."
                                    value={formData.allergies}
                                    details={formData.allergiesDetails}
                                    onValueChange={(v) => handleInputChange('allergies', v)}
                                    onDetailsChange={(v) => handleInputChange('allergiesDetails', v)}
                                />

                                {/* Q4 – Previous treatments */}
                                <MedicalQuestion
                                    number={4}
                                    question="Have you had any previous aesthetic or cosmetic treatments?"
                                    hint="dermal filler, botulinum toxin, skin boosters, PRP, laser, surgery, etc."
                                    value={formData.previousTreatments}
                                    details={formData.previousTreatmentsDetails}
                                    onValueChange={(v) => handleInputChange('previousTreatments', v)}
                                    onDetailsChange={(v) => handleInputChange('previousTreatmentsDetails', v)}
                                    detailsPlaceholder="Please specify treatment and date"
                                />

                                {/* Q5 – Complications */}
                                <MedicalQuestion
                                    number={5}
                                    question="Have you ever experienced a complication or reaction to cosmetic treatments?"
                                    value={formData.complications}
                                    details={formData.complicationsDetails}
                                    onValueChange={(v) => handleInputChange('complications', v)}
                                    onDetailsChange={(v) => handleInputChange('complicationsDetails', v)}
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
                                                checked={formData.pregnantOrBreastfeeding === 'no'}
                                                onChange={(e) => handleInputChange('pregnantOrBreastfeeding', e.target.value)}
                                                className="w-4 h-4 accent-primary"
                                            />
                                            <span className="text-sm text-foreground/80 group-hover:text-foreground transition">No</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="pregnantOrBreastfeeding"
                                                value="yes"
                                                checked={formData.pregnantOrBreastfeeding === 'yes'}
                                                onChange={(e) => handleInputChange('pregnantOrBreastfeeding', e.target.value)}
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
                                    value={formData.activeInfections}
                                    details={formData.activeInfectionsDetails}
                                    onValueChange={(v) => handleInputChange('activeInfections', v)}
                                    onDetailsChange={(v) => handleInputChange('activeInfectionsDetails', v)}
                                />

                                {/* Q8 – Cold sores */}
                                <MedicalQuestion
                                    number={8}
                                    question="Do you suffer from any cold sores?"
                                    value={formData.coldSores}
                                    details={formData.coldSoresDetails}
                                    onValueChange={(v) => handleInputChange('coldSores', v)}
                                    onDetailsChange={(v) => handleInputChange('coldSoresDetails', v)}
                                />

                                {/* Q9 – Aims and motivations */}
                                <div className="space-y-3 p-6 border border-accent/30 bg-white/50">
                                    <p className="text-sm text-foreground font-medium">
                                        <span className="text-muted-foreground mr-2">9.</span>
                                        What are your aims and motivations for having this procedure?
                                    </p>
                                    <textarea
                                        value={formData.aimsMotivations}
                                        onChange={(e) => handleInputChange('aimsMotivations', e.target.value)}
                                        rows={4}
                                        className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40 resize-none"
                                        placeholder="Please describe your goals and what you hope to achieve from the treatment..."
                                    />
                                </div>
                            </section>

                            {/* ── TREATMENT CONSENT & DECLARATION ── */}
                            <section className="space-y-5 md:space-y-8">
                                <div className="flex items-center gap-3 border-b border-accent/50 pb-4">
                                    <span className="text-xl">💉</span>
                                    <h2 className="text-xl md:text-2xl font-light text-foreground tracking-wide">Treatment Consent &amp; Declaration</h2>
                                </div>
                                <p className="text-sm text-muted-foreground">Please read and confirm each statement below:</p>

                                <div className="space-y-4">
                                    <ConsentCheckbox
                                        checked={formData.consentTrueInfo}
                                        onChange={(v) => handleInputChange('consentTrueInfo', v)}
                                        label="I confirm that all information provided is true and complete to the best of my knowledge."
                                    />
                                    <ConsentCheckbox
                                        checked={formData.consentNature}
                                        onChange={(v) => handleInputChange('consentNature', v)}
                                        label="I understand the nature and purpose of injectable treatments and have had the opportunity to ask questions."
                                    />
                                    <ConsentCheckbox
                                        checked={formData.consentResultsVary}
                                        onChange={(v) => handleInputChange('consentResultsVary', v)}
                                        label="I understand that results vary and no guarantees can be given."
                                    />
                                    <ConsentCheckbox
                                        checked={formData.consentSideEffects}
                                        onChange={(v) => handleInputChange('consentSideEffects', v)}
                                        label="I understand common side effects include redness, swelling, bruising, tenderness, and temporary asymmetry."
                                    />
                                    <ConsentCheckbox
                                        checked={formData.consentRareRisks}
                                        onChange={(v) => handleInputChange('consentRareRisks', v)}
                                        label="I understand rare but serious risks include infection, allergic reaction, vascular occlusion, tissue damage, scarring, delayed inflammatory reactions, and unsatisfactory results."
                                    />
                                    <ConsentCheckbox
                                        checked={formData.consentAdditionalTreatments}
                                        onChange={(v) => handleInputChange('consentAdditionalTreatments', v)}
                                        label="I understand that additional treatments may be required to achieve or maintain results at additional cost."
                                    />
                                    <ConsentCheckbox
                                        checked={formData.consentAftercare}
                                        onChange={(v) => handleInputChange('consentAftercare', v)}
                                        label="I agree to follow all pre and after care instructions provided."
                                    />
                                    <ConsentCheckbox
                                        checked={formData.consentEmergency}
                                        onChange={(v) => handleInputChange('consentEmergency', v)}
                                        label="I consent to emergency treatment if required."
                                    />
                                    <ConsentCheckbox
                                        checked={formData.consentOver18}
                                        onChange={(v) => handleInputChange('consentOver18', v)}
                                        label="I confirm that I am over 18 years of age."
                                    />
                                    <ConsentCheckbox
                                        checked={formData.consentProceed}
                                        onChange={(v) => handleInputChange('consentProceed', v)}
                                        label="I consent to proceed with today's treatment."
                                    />
                                </div>
                            </section>

                            {/* ── SIGNATURE ── */}
                            <section className="space-y-5 md:space-y-8">
                                <div className="flex items-center gap-3 border-b border-accent/50 pb-4">
                                    <span className="text-xl">✍️</span>
                                    <h2 className="text-xl md:text-2xl font-light text-foreground tracking-wide">Client Signature</h2>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                        Please sign below <span className="text-red-500">*</span>
                                    </label>
                                    <div className="border border-accent/50 bg-white p-1 relative">
                                        <canvas
                                            ref={canvasRef}
                                            width={600}
                                            height={200}
                                            className="w-full h-[200px] cursor-crosshair touch-none"
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                        />
                                        {!hasSignature && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <p className="text-muted-foreground/30 text-sm tracking-widest">Draw your signature here</p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        className="text-xs tracking-widest text-muted-foreground hover:text-foreground transition uppercase font-medium"
                                    >
                                        Clear Signature
                                    </button>
                                </div>

                                <div className="max-w-xs">
                                    <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.signatureDate}
                                        onChange={(e) => handleInputChange('signatureDate', e.target.value)}
                                        className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition"
                                    />
                                </div>
                            </section>

                            {/* ── SUBMIT ── */}
                            <div className="pt-4 pb-8 border-t border-accent/30">
                                <button
                                    type="submit"
                                    disabled={!allConsentsChecked || !hasSignature}
                                    className={`w-full py-4 text-sm tracking-widest font-medium transition ${allConsentsChecked && hasSignature
                                            ? 'bg-primary text-primary-foreground hover:opacity-90 cursor-pointer'
                                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                                        }`}
                                >
                                    SUBMIT CONSENT FORM
                                </button>
                                {(!allConsentsChecked || !hasSignature) && (
                                    <p className="text-xs text-muted-foreground mt-3 text-center">
                                        Please complete all consent checkboxes and provide your signature to submit.
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}


/* ── Reusable Medical Question Component ── */
function MedicalQuestion({
    number,
    question,
    hint,
    value,
    details,
    onValueChange,
    onDetailsChange,
    detailsPlaceholder = 'Please specify below...',
}: {
    number: number;
    question: string;
    hint?: string;
    value: string;
    details: string;
    onValueChange: (v: string) => void;
    onDetailsChange: (v: string) => void;
    detailsPlaceholder?: string;
}) {
    return (
        <div className="space-y-3 p-6 border border-accent/30 bg-white/50">
            <div>
                <p className="text-sm text-foreground font-medium">
                    <span className="text-muted-foreground mr-2">{number}.</span>
                    {question}
                </p>
                {hint && <p className="text-xs text-muted-foreground mt-1 ml-5">({hint})</p>}
            </div>
            <div className="flex gap-6 ml-5">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="radio"
                        name={`medical-${number}`}
                        value="no"
                        checked={value === 'no'}
                        onChange={(e) => onValueChange(e.target.value)}
                        className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition">No</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="radio"
                        name={`medical-${number}`}
                        value="yes"
                        checked={value === 'yes'}
                        onChange={(e) => onValueChange(e.target.value)}
                        className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition">Yes – please specify below</span>
                </label>
            </div>
            {value === 'yes' && (
                <div className="ml-5 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <textarea
                        value={details}
                        onChange={(e) => onDetailsChange(e.target.value)}
                        rows={3}
                        className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40 resize-none"
                        placeholder={detailsPlaceholder}
                    />
                </div>
            )}
        </div>
    );
}


/* ── Reusable Consent Checkbox Component ── */
function ConsentCheckbox({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
}) {
    return (
        <label className="flex items-start gap-3 p-4 border border-accent/30 bg-white/50 cursor-pointer group hover:border-primary/30 transition">
            <div className="pt-0.5">
                <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${checked ? 'bg-primary border-primary' : 'border-accent group-hover:border-primary/50'
                        }`}
                >
                    {checked && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>
            <span className="text-sm text-foreground/80 leading-relaxed">{label}</span>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only"
            />
        </label>
    );
}
