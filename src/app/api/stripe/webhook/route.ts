import type Stripe from "stripe";
import {
  alreadyHandledEvent,
  fulfilBooking,
  releaseBooking,
} from "@/lib/fulfilment";
import { stripeClient } from "@/lib/stripe";

/**
 * POST /api/stripe/webhook — the only trustworthy source of payment truth.
 *
 * The browser cannot be believed about whether a payment succeeded: a customer
 * can close the tab mid-3DS, or a card can settle asynchronously.
 *
 * Register in Stripe as https://podflixpodcast.ae/api/stripe/webhook for
 * payment_intent.succeeded, .payment_failed and .canceled.
 *
 * All booking side effects live in lib/fulfilment so this and the
 * reconciliation cron behave identically.
 */

// The signature covers the exact bytes Stripe sent, so the body is read raw.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set");
    return new Response("Misconfigured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = stripeClient().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (alreadyHandledEvent(event.id)) {
    console.info("[webhook] duplicate event ignored", event.id);
    return Response.json({ received: true, duplicate: true });
  }

  console.info("[webhook] received", event.type, event.id);
  const pi = event.data.object as Stripe.PaymentIntent;

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await fulfilBooking(pi, "webhook");
        break;
      case "payment_intent.payment_failed":
      case "payment_intent.canceled":
        await releaseBooking(pi, "Payment was not completed", "webhook");
        break;
      default:
        console.info("[webhook] ignored", event.type);
    }
  } catch (err) {
    // Never return non-200 after a successful payment — Stripe would retry
    // forever. The reconcile cron is the safety net for anything missed here.
    console.error("[webhook] handler error", event.id, err);
  }

  return Response.json({ received: true });
}
