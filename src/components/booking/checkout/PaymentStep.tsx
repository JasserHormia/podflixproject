"use client";

import { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Inline card entry. `redirect: "if_required"` keeps the customer on our page
 * for ordinary cards; only 3DS challenges hand off, and those come straight
 * back to /booking.
 *
 * Payment success is reported to the UI here, but the booking is only truly
 * confirmed by the Stripe webhook — the browser is never the source of truth.
 */
export default function PaymentStep({
  total,
  onPaid,
}: {
  total: string;
  onPaid: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);

    const { error: err, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/booking` },
      redirect: "if_required",
    });

    if (err) {
      // Card declines and validation problems land here. The Elements state is
      // untouched, so the customer can correct and retry without re-entering.
      setError(err.message ?? "That payment could not be completed.");
      setBusy(false);
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      onPaid();
      return;
    }
    setError("Payment did not complete. Please try again.");
    setBusy(false);
  };

  return (
    <form onSubmit={submit}>
      <PaymentElement onReady={() => setReady(true)} />

      {error && (
        <p
          role="alert"
          className="mt-4 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !ready || busy}
        className={`mt-6 w-full bg-gold px-10 py-5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-cream disabled:opacity-40 ${FOCUS}`}
      >
        {busy ? "Processing…" : `Pay ${total}`}
      </button>
      <p className="mt-3 text-center text-xs tracking-widest text-cream/45">
        🔒 Secured by Stripe
      </p>
    </form>
  );
}
