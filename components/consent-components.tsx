import React, { useState, useRef, useEffect, useCallback } from 'react';

// ─── Optimised Signature Pad ───
export function SignaturePad({
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

    // Expose getDataURL via ref-like pattern
    useEffect(() => {
        if (canvasRef.current) {
            (canvasRef.current as HTMLCanvasElement & { getSignatureData?: () => string }).getSignatureData = () => {
                return canvasRef.current?.toDataURL('image/png') || '';
            };
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

/* ── Reusable Medical Question Component ── */
export function MedicalQuestion({
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
export function ConsentCheckbox({
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
