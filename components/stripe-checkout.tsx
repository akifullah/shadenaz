'use client';

import { forwardRef, useImperativeHandle, useEffect, useRef as useReactRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Shield, Lock } from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface StripeCheckoutHandle {
  confirmPayment: () => Promise<{ success: boolean; paymentIntentId?: string; error?: string }>;
}

interface CheckoutFormProps {
  totalPrice: number;
}

const CheckoutForm = forwardRef<StripeCheckoutHandle, CheckoutFormProps>(
  ({ totalPrice }, ref) => {
    const stripe = useStripe();
    const elements = useElements();
    const scrollPosRef = useReactRef<number>(0);

    // Save scroll position before Stripe iframe mounts and steals focus
    useEffect(() => {
      scrollPosRef.current = window.scrollY;
    }, []);

    const handleReady = () => {
      // Restore scroll position after Stripe's iframe auto-focuses
      window.scrollTo({ top: scrollPosRef.current });
    };

    useImperativeHandle(ref, () => ({
      confirmPayment: async () => {
        if (!stripe || !elements) {
          return { success: false, error: 'Payment system not ready. Please wait a moment.' };
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.href,
          },
          redirect: 'if_required',
        });

        if (error) {
          return { success: false, error: error.message || 'Payment failed. Please try again.' };
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          return { success: true, paymentIntentId: paymentIntent.id };
        } else {
          return { success: false, error: 'Payment was not completed. Please try again.' };
        }
      },
    }));

    return (
      <div className="space-y-6">
        {/* Payment Summary Card */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground">Booking Deposit</h4>
              <p className="text-xs text-muted-foreground">Partial payment required to confirm</p>
            </div>
          </div>
          <div className="flex items-end justify-between border-t border-primary/10 pt-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Treatment Total</p>
              <p className="text-sm text-foreground">£{totalPrice.toFixed(2)}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs text-muted-foreground">Pay Now (Deposit)</p>
              <p className="text-2xl font-bold text-primary">£44.00</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground bg-background/50 p-3 border border-accent/30">
            💡 Remaining balance of <strong>£{(totalPrice - 44).toFixed(2)}</strong> is due at your appointment.
          </p>
        </div>

        {/* Stripe Payment Element */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground tracking-wide flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Payment Details
          </label>
          <div className="border border-accent bg-background p-4">
            <PaymentElement
              onReady={handleReady}
              options={{
                layout: 'tabs',
              }}
            />
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-4 h-4 text-green-600" />
          <span>Payments are secure and encrypted by Stripe</span>
        </div>
      </div>
    );
  }
);

CheckoutForm.displayName = 'CheckoutForm';

interface StripeCheckoutProps {
  clientSecret: string;
  totalPrice: number;
}

const StripeCheckout = forwardRef<StripeCheckoutHandle, StripeCheckoutProps>(
  ({ clientSecret, totalPrice }, ref) => {
    const options = {
      clientSecret,
      appearance: {
        theme: 'stripe' as const,
        variables: {
          colorPrimary: '#2563eb',
          borderRadius: '0px',
        },
      },
      developerTools: {
        assistant: {
          enabled: false,
        },
      },
    };

    return (
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm ref={ref} totalPrice={totalPrice} />
      </Elements>
    );
  }
);

StripeCheckout.displayName = 'StripeCheckout';

export default StripeCheckout;
