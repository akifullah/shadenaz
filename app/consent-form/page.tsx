'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState, useRef, useEffect, useCallback } from 'react';

interface FormData {
    fullName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postcode: string;
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

// ─── Optimised Signature Pad (extracted as its own component) ───
function SignaturePad({
    onSignatureChange,
}: {
    onSignatureChange: (hasSignature: boolean) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);
    const pointsRef = useRef<{ x: number; y: number; time: number }[]>([]);
    const [hasSignature, setHasSignature] = useState(false);

    // High-DPI canvas setup
    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 200 * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = '200px';

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#1a1a2e';
    }, []);

    useEffect(() => {
        setupCanvas();
        const handleResize = () => {
            // Save current signature data before resize
            const canvas = canvasRef.current;
            if (!canvas) return;
            const data = canvas.toDataURL();
            setupCanvas();
            // Restore after resize
            if (hasSignature) {
                const img = new Image();
                img.onload = () => {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        const dpr = window.devicePixelRatio || 1;
                        ctx.scale(1 / dpr, 1 / dpr);
                        ctx.drawImage(img, 0, 0);
                        ctx.scale(dpr, dpr);
                    }
                };
                img.src = data;
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setupCanvas, hasSignature]);

    const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }
        if ('clientX' in e) {
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        }
        return { x: 0, y: 0 };
    };

    // Velocity-based variable width for natural pen feel
    const getLineWidth = (velocity: number) => {
        const minWidth = 1;
        const maxWidth = 3.5;
        const speed = Math.min(velocity, 10);
        return maxWidth - ((maxWidth - minWidth) * speed) / 10;
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const coords = getCoords(e);
        isDrawingRef.current = true;
        lastPointRef.current = coords;
        pointsRef.current = [{ ...coords, time: Date.now() }];

        if (!hasSignature) {
            setHasSignature(true);
            onSignatureChange(true);
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (!isDrawingRef.current) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx || !lastPointRef.current) return;

        const coords = getCoords(e);
        const now = Date.now();
        const lastPoint = lastPointRef.current;
        const lastTime = pointsRef.current.length > 0 ? pointsRef.current[pointsRef.current.length - 1].time : now;

        // Calculate velocity
        const dx = coords.x - lastPoint.x;
        const dy = coords.y - lastPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const dt = Math.max(now - lastTime, 1);
        const velocity = dist / dt;

        // Quadratic bezier for smooth curves using midpoints
        const midX = (lastPoint.x + coords.x) / 2;
        const midY = (lastPoint.y + coords.y) / 2;

        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midX, midY);
        ctx.lineWidth = getLineWidth(velocity * 10);
        ctx.stroke();

        lastPointRef.current = coords;
        pointsRef.current.push({ ...coords, time: now });
    };

    const stopDrawing = () => {
        isDrawingRef.current = false;
        lastPointRef.current = null;
        pointsRef.current = [];
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        setHasSignature(false);
        onSignatureChange(false);
    };

    // Export as data URL
    const getDataURL = () => {
        return canvasRef.current?.toDataURL('image/png') || '';
    };

    // Expose getDataURL via ref-like pattern
    useEffect(() => {
        if (canvasRef.current) {
            (canvasRef.current as HTMLCanvasElement & { getSignatureData: () => string }).getSignatureData = getDataURL;
        }
    });

    return (
        <div className="space-y-3">
            <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                Please sign below <span className="text-red-500">*</span>
            </label>
            <div
                ref={containerRef}
                className="border border-accent/50 bg-white relative overflow-hidden group"
                style={{ borderRadius: '2px' }}
            >
                {/* Signature line */}
                <div className="absolute bottom-[40px] left-6 right-6 border-b border-dashed border-muted-foreground/15 pointer-events-none" />

                <canvas
                    ref={canvasRef}
                    className="w-full cursor-crosshair touch-none"
                    style={{ height: '200px' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />

                {!hasSignature && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
                        <svg className="w-6 h-6 text-muted-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 20h9" strokeLinecap="round" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        <p className="text-muted-foreground/25 text-sm tracking-widest">Sign here</p>
                    </div>
                )}

                {/* Undo/clear floating button */}
                {hasSignature && (
                    <button
                        type="button"
                        onClick={clear}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm border border-accent/30 rounded-sm hover:bg-white hover:border-accent transition-all opacity-0 group-hover:opacity-100"
                        title="Clear signature"
                    >
                        <svg className="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div>
            <button
                type="button"
                onClick={clear}
                className="text-xs tracking-widest text-muted-foreground hover:text-foreground transition uppercase font-medium"
            >
                Clear Signature
            </button>
        </div>
    );
}


export default function ConsentFormPage() {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postcode: '',
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

    const [hasSignature, setHasSignature] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const signatureCanvasRef = useRef<(HTMLCanvasElement & { getSignatureData?: () => string }) | null>(null);

    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Get signature data from canvas
            const canvasEl = document.querySelector('canvas') as HTMLCanvasElement & { getSignatureData?: () => string };
            const signatureData = canvasEl?.getSignatureData?.() || canvasEl?.toDataURL('image/png') || '';

            const payload = {
                full_name: formData.fullName,
                date_of_birth: formData.dateOfBirth,
                phone_number: formData.phoneNumber,
                email: formData.email || null,
                address_line_1: formData.addressLine1,
                address_line_2: formData.addressLine2 || null,
                city: formData.city,
                postcode: formData.postcode,
                gender: formData.gender,
                emergency_contact_name: formData.emergencyContactName,
                emergency_contact_number: formData.emergencyContactNumber,
                medical_conditions: formData.medicalConditions,
                medical_conditions_details: formData.medicalConditionsDetails || null,
                medications: formData.medications,
                medications_details: formData.medicationsDetails || null,
                allergies: formData.allergies,
                allergies_details: formData.allergiesDetails || null,
                previous_treatments: formData.previousTreatments,
                previous_treatments_details: formData.previousTreatmentsDetails || null,
                complications: formData.complications,
                complications_details: formData.complicationsDetails || null,
                pregnant_or_breastfeeding: formData.pregnantOrBreastfeeding,
                active_infections: formData.activeInfections,
                active_infections_details: formData.activeInfectionsDetails || null,
                cold_sores: formData.coldSores,
                cold_sores_details: formData.coldSoresDetails || null,
                aims_motivations: formData.aimsMotivations || null,
                consent_true_info: formData.consentTrueInfo,
                consent_nature: formData.consentNature,
                consent_results_vary: formData.consentResultsVary,
                consent_side_effects: formData.consentSideEffects,
                consent_rare_risks: formData.consentRareRisks,
                consent_additional_treatments: formData.consentAdditionalTreatments,
                consent_aftercare: formData.consentAftercare,
                consent_emergency: formData.consentEmergency,
                consent_over_18: formData.consentOver18,
                consent_proceed: formData.consentProceed,
                signature_data: signatureData,
                signature_date: formData.signatureDate,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/consent-form`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to submit consent form. Please try again.');
            }

            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
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
                                {/* ── ID Warning ── */}
                                <div className="flex items-start gap-3 border border-amber-300 bg-amber-50 px-4 py-3 rounded-sm">
                                    <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    </svg>
                                    <p className="text-xs text-amber-800 leading-relaxed">
                                        <span className="font-semibold">Important:</span> You <span className="font-semibold">MUST</span> enter your real, full name, date of birth and address exactly as they appear on your official identification document.{' '}
                                        <span className="italic">(Do not use nicknames, abbreviations, or alternative spellings).</span>
                                    </p>
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
                                    <div className="md:col-span-2">
                                        <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                            Address Line 1 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.addressLine1}
                                            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                                            className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40"
                                            placeholder="House number and street name"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                            Address Line 2
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.addressLine2}
                                            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                                            className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40"
                                            placeholder="Apartment, flat, suite (optional)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs tracking-widest text-muted-foreground font-medium uppercase mb-2">
                                            Postcode <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.postcode}
                                            onChange={(e) => handleInputChange('postcode', e.target.value)}
                                            className="w-full border border-accent/50 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition placeholder:text-muted-foreground/40"
                                            placeholder="Postcode"
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

                                <SignaturePad onSignatureChange={setHasSignature} />


                            </section>

                            {/* ── ERROR MESSAGE ── */}
                            {submitError && (
                                <div className="flex items-start gap-3 border border-red-300 bg-red-50 px-4 py-3 rounded-sm">
                                    <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    </svg>
                                    <p className="text-xs text-red-800 leading-relaxed">{submitError}</p>
                                </div>
                            )}

                            {/* ── SUBMIT ── */}
                            <div className="pt-4 pb-8 border-t border-accent/30">
                                <button
                                    type="submit"
                                    disabled={!allConsentsChecked || !hasSignature || isSubmitting}
                                    className={`w-full py-4 text-sm tracking-widest font-medium transition ${allConsentsChecked && hasSignature && !isSubmitting
                                            ? 'bg-primary text-primary-foreground hover:opacity-90 cursor-pointer'
                                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            SUBMITTING...
                                        </span>
                                    ) : (
                                        'SUBMIT CONSENT FORM'
                                    )}
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
