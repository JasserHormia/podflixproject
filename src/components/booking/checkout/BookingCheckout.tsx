"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { formatPrice } from "@/lib/booking";
import { TIMEZONE, calSessionForBookingId } from "@/lib/cal";
import PaymentStep from "./PaymentStep";

/**
 * Step 4 — date, time, details and payment, inline on our own page.
 *
 * Replaces the SimplyBook embed entirely: Cal.com is now only an availability
 * and calendar engine sitting behind our API routes, and Stripe Elements is
 * mounted here rather than on a hosted page, so the customer never leaves the
 * brand and never sees a third-party UI.
 *
 * Importing @/lib/cal here is safe: the only secret it touches is read inside
 * calApiKey() at call time, which no client path reaches, and event type ids
 * are already public — /api/cal/slots takes one from the browser.
 */

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const CARD = "border border-cream/10 bg-surface p-6 md:p-8";
const EYEBROW = "text-[10px] uppercase tracking-[0.3em] text-gold";

/** Publishable key only — the secret key never reaches the browser. */
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

/**
 * Stripe's iframe re-skinned to the site palette. The font is pulled from
 * Google inside the iframe because next/font's self-hosted files are not
 * reachable from Stripe's origin; it falls back to system-ui if blocked.
 */
const ELEMENTS_APPEARANCE = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#A98F74",
    colorBackground: "#0A0807",
    colorText: "#EBE0D6",
    colorTextSecondary: "#A98F74",
    // Stripe's default placeholder grey lands at 3.4:1 on this background;
    // this is the same tone the transactional emails use, at 5.2:1.
    colorTextPlaceholder: "#8A8178",
    colorDanger: "#FCA5A5",
    fontFamily: "Alexandria, ui-sans-serif, system-ui, sans-serif",
    fontSizeBase: "15px",
    borderRadius: "0px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": { border: "1px solid rgba(235,224,214,0.15)", boxShadow: "none" },
    ".Input:focus": { border: "1px solid #A98F74", boxShadow: "none" },
    ".Label": { color: "#9A9089", fontSize: "12px", letterSpacing: "0.06em" },
    ".Tab": { border: "1px solid rgba(235,224,214,0.15)", boxShadow: "none" },
    ".Tab:hover": { color: "#EBE0D6" },
    ".Tab--selected": { borderColor: "#A98F74", color: "#EBE0D6" },
    ".Error": { color: "#FCA5A5" },
  },
};

const ELEMENTS_FONTS = [
  {
    cssSrc:
      "https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500&display=swap",
  },
];

const ADDRESS = "Tamani Arts Building, 9th Floor, Studio 902, Business Bay, Dubai";

type Slots = { date: string; times: string[] }[];
type Details = { name: string; email: string; phone: string };
type Phase = "pick" | "pay" | "done";

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: TIMEZONE }).format(
    new Date(iso)
  );

const timeLabel = (iso: string) =>
  fmt(iso, { hour: "2-digit", minute: "2-digit", hour12: false });
const fullDate = (iso: string) =>
  fmt(iso, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/**
 * Availability for the next 30 days. Kept free of state so the effect below
 * only has to deal with the result, not the request.
 */
async function fetchSlots(calId: number): Promise<Slots> {
  const from = new Date().toISOString();
  const to = new Date(Date.now() + 30 * 864e5).toISOString();
  const res = await fetch(
    `/api/cal/slots?eventTypeId=${calId}&startTime=${from}&endTime=${to}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`slots ${res.status}`);
  const body = (await res.json()) as { slots: Slots };
  return body.slots;
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const detailValid = (key: keyof Details, v: string) =>
  key === "email" ? emailOk(v) : v.trim().length >= (key === "phone" ? 6 : 2);

export default function BookingCheckout({
  bookingSessionId,
  sessionLabel,
  format,
  setName,
  addonIds,
  total,
  hours,
  onConfirmed,
}: {
  bookingSessionId: string;
  sessionLabel: string;
  format: string;
  setName: string;
  addonIds: string[];
  total: number;
  hours: number;
  /** Lets the parent lock the summary once money has changed hands. */
  onConfirmed?: () => void;
}) {
  const reduce = useReducedMotion();
  const calSession = useMemo(
    () => calSessionForBookingId(bookingSessionId),
    [bookingSessionId]
  );

  const [phase, setPhase] = useState<Phase>("pick");
  const [slots, setSlots] = useState<Slots | null>(null);
  const [slotsError, setSlotsError] = useState(false);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>({ name: "", email: "", phone: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Details, boolean>>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slotTaken, setSlotTaken] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingUid, setBookingUid] = useState<string | null>(null);

  const [reload, setReload] = useState(0);
  const pickerRef = useRef<HTMLElement>(null);

  /** Re-fetch, showing the loading state again. Bumping the token is what the
   *  effect below listens to, so refreshing is an event, not a render. */
  const refreshSlots = useCallback(() => {
    setSlots(null);
    setSlotsError(false);
    setReload((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!calSession) return;
    // The token is the trigger; reading it keeps the dependency honest.
    void reload;
    let live = true;
    fetchSlots(calSession.calId)
      .then((next) => {
        if (!live) return;
        setSlots(next);
        // Keep the customer on the day they were looking at if it still has
        // times; otherwise fall to the first available day.
        setActiveDate((current) =>
          current && next.some((d) => d.date === current)
            ? current
            : next[0]?.date ?? null
        );
      })
      .catch(() => {
        if (live) setSlotsError(true);
      });
    return () => {
      live = false;
    };
  }, [calSession, reload]);

  const times = slots?.find((d) => d.date === activeDate)?.times ?? [];
  const detailsValid = (Object.keys(details) as (keyof Details)[]).every((k) =>
    detailValid(k, details[k])
  );
  const canSubmit = Boolean(time) && detailsValid && !busy;

  /**
   * Holds the slot and opens payment. The Cal booking is created here, so from
   * this point there is a real hold on the calendar — releasing it is what
   * "Change time" below does.
   */
  const startPayment = async () => {
    if (!calSession || !time) return;
    setBusy(true);
    setError(null);
    setSlotTaken(false);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: calSession.id,
          start: time,
          name: details.name.trim(),
          email: details.email.trim(),
          phone: details.phone.trim(),
          metadata: { format, setName, addons: addonIds },
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        clientSecret?: string;
        bookingUid?: string;
        error?: string;
      };

      if (res.status === 409) {
        // Taken while they were filling the form. Send them back to a freshly
        // loaded picker rather than into a dead end — and take them there,
        // since the button they pressed is a screen below the calendar.
        setSlotTaken(true);
        setTime(null);
        refreshSlots();
        pickerRef.current?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
        return;
      }
      if (!res.ok || !body.clientSecret) {
        setError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      setClientSecret(body.clientSecret);
      setBookingUid(body.bookingUid ?? null);
      setPhase("pay");
    } catch {
      setError(
        "We couldn't reach the booking system. Check your connection and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  /** Releases the hold before going back, so an abandoned time frees up now
   *  rather than waiting for the reconciliation cron. */
  const changeTime = async () => {
    const uid = bookingUid;
    setPhase("pick");
    setClientSecret(null);
    setBookingUid(null);
    setTime(null);
    refreshSlots();
    if (!uid) return;
    try {
      await fetch("/api/booking/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingUid: uid,
          reason: "Customer chose another time",
        }),
      });
    } catch {
      // The reconciliation cron releases it either way.
    }
  };

  const calendarHref = () => {
    if (!time) return "#";
    const start = new Date(time);
    const end = new Date(start.getTime() + hours * 3600_000);
    const stamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
    const q = new URLSearchParams({
      action: "TEMPLATE",
      text: `Podflix — ${sessionLabel}`,
      dates: `${stamp(start)}/${stamp(end)}`,
      details: `${format} · ${setName}`,
      location: ADDRESS,
    });
    return `https://calendar.google.com/calendar/render?${q}`;
  };

  if (!calSession) {
    return (
      <p className={`${CARD} text-sm text-cream/60`}>
        This session can&apos;t be booked online yet — message us on WhatsApp and
        we&apos;ll set it up for you.
      </p>
    );
  }

  /* ── Confirmed ── */
  if (phase === "done") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="border border-gold/30 bg-surface p-8 text-center md:p-12"
      >
        <span
          aria-hidden
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold font-display text-xl font-black text-background"
        >
          ✓
        </span>
        <p className={`mt-6 ${EYEBROW}`}>Booking confirmed</p>
        <h3 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-black leading-[1.05] text-cream">
          You&apos;re booked.
        </h3>
        <p className="mx-auto mt-4 max-w-md font-body text-cream/60">
          {time ? `${fullDate(time)} at ${timeLabel(time)}` : ""}
          <span className="block text-cream/40">
            {sessionLabel} · {formatPrice(total)} paid
          </span>
        </p>
        <p className="mx-auto mt-6 max-w-md font-body text-sm leading-relaxed text-cream/50">
          Check your email — your confirmation and everything you need for the
          day is on its way. Please arrive 10 minutes early at {ADDRESS}.
        </p>
        <a
          href={calendarHref()}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-8 inline-block border border-gold px-8 py-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-background ${FOCUS}`}
        >
          Add to calendar →
        </a>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "pick" ? (
        <motion.div
          key="pick"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* ── 1 · WHEN ── */}
          <section ref={pickerRef} className={`scroll-mt-40 ${CARD}`}>
            <p className={EYEBROW}>Pick a date</p>

            {slotTaken && (
              <p
                role="alert"
                className="mt-4 border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-cream"
              >
                That time was taken while you were filling in your details.
                We&apos;ve refreshed the times below — please choose another.
              </p>
            )}

            {slots === null && !slotsError && (
              <p className="mt-6 animate-pulse text-sm text-cream/40">
                Loading available times…
              </p>
            )}

            {slotsError && (
              <div className="mt-6">
                <p className="text-sm text-cream/60">
                  We couldn&apos;t load available times.
                </p>
                <button
                  type="button"
                  onClick={refreshSlots}
                  className={`mt-3 min-h-11 border border-gold px-5 text-xs uppercase tracking-widest text-gold transition-colors hover:bg-gold hover:text-background ${FOCUS}`}
                >
                  Try again
                </button>
              </div>
            )}

            {slots?.length === 0 && (
              <p className="mt-6 text-sm text-cream/60">
                Nothing available in the next 30 days. Message us on WhatsApp and
                we&apos;ll find you a slot.
              </p>
            )}

            {slots && slots.length > 0 && (
              <>
                {/* Edge-to-edge scroller: the negative margins let the strip run
                    to the card edge on a phone while the content stays inset. */}
                <div className="-mx-6 mt-5 flex snap-x gap-2 overflow-x-auto px-6 pb-2 md:-mx-8 md:px-8">
                  {slots.map((d) => {
                    const on = d.date === activeDate;
                    const ref = d.times[0];
                    return (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => {
                          setActiveDate(d.date);
                          setTime(null);
                        }}
                        aria-pressed={on}
                        className={`flex h-20 w-16 shrink-0 snap-start flex-col items-center justify-center gap-0.5 border transition-colors ${FOCUS} ${
                          on
                            ? "border-gold bg-gold text-background"
                            : "border-cream/15 text-cream hover:border-gold/60"
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-widest opacity-70">
                          {fmt(ref, { weekday: "short" })}
                        </span>
                        <span className="font-display text-xl font-black leading-none">
                          {fmt(ref, { day: "numeric" })}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest opacity-70">
                          {fmt(ref, { month: "short" })}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className={`mt-7 ${EYEBROW}`}>Pick a time · Dubai</p>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {times.map((t) => {
                    const on = t === time;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        aria-pressed={on}
                        className={`min-h-11 border px-2 font-display text-sm font-semibold transition-colors ${FOCUS} ${
                          on
                            ? "border-gold bg-gold text-background"
                            : "border-cream/15 text-cream hover:border-gold/60"
                        }`}
                      >
                        {timeLabel(t)}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          {/* ── 2 · WHO ── */}
          <section className={CARD}>
            <p className={EYEBROW}>Your details</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {(
                [
                  ["name", "Full name", "text", "name", "Your name"],
                  ["email", "Email", "email", "email", "you@company.com"],
                  ["phone", "Phone", "tel", "tel", "+971 50 000 0000"],
                ] as const
              ).map(([key, label, type, autoComplete, placeholder]) => {
                const value = details[key];
                const invalid = Boolean(touched[key]) && !detailValid(key, value);
                return (
                  <label key={key} className={key === "name" ? "sm:col-span-2" : ""}>
                    <span className="block text-[10px] uppercase tracking-[0.25em] text-cream/40">
                      {label}
                    </span>
                    <input
                      type={type}
                      value={value}
                      autoComplete={autoComplete}
                      placeholder={placeholder}
                      inputMode={key === "phone" ? "tel" : undefined}
                      onChange={(e) =>
                        setDetails((d) => ({ ...d, [key]: e.target.value }))
                      }
                      onBlur={() => setTouched((t) => ({ ...t, [key]: true }))}
                      aria-invalid={invalid || undefined}
                      className={`mt-2 min-h-12 w-full border bg-background px-4 font-body text-sm text-cream transition-colors placeholder:text-cream/25 ${FOCUS} ${
                        invalid
                          ? "border-red-400/60"
                          : "border-cream/15 focus:border-gold"
                      }`}
                    />
                    {invalid && (
                      <span className="mt-2 block text-xs text-red-300">
                        {key === "email"
                          ? "Enter a valid email address."
                          : `Enter your ${label.toLowerCase()}.`}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-cream/40">
              Your confirmation and studio details go to this email. We only use
              your number if something changes on the day.
            </p>
          </section>

          {/* ── Continue ── */}
          <div>
            {error && (
              <p
                role="alert"
                className="mb-4 border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200"
              >
                {error}{" "}
                <button
                  type="button"
                  onClick={() => void startPayment()}
                  className={`underline underline-offset-4 ${FOCUS}`}
                >
                  Try again
                </button>
              </p>
            )}
            <button
              type="button"
              onClick={() => void startPayment()}
              disabled={!canSubmit}
              className={`w-full bg-gold px-10 py-5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-gold sm:w-auto ${FOCUS}`}
            >
              {busy
                ? "Holding your slot…"
                : `Continue to payment · ${formatPrice(total)}`}
            </button>
            {!canSubmit && !busy && (
              <p className="mt-3 text-xs text-cream/40">
                {time
                  ? "Add your details to continue."
                  : "Choose a date and time to continue."}
              </p>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="pay"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Locked selection — changing it releases the hold first. */}
          <section className={`${CARD} flex flex-wrap items-start justify-between gap-4`}>
            <div>
              <p className={EYEBROW}>Your slot is held</p>
              <p className="mt-2 font-display text-lg font-semibold text-cream">
                {time ? `${fullDate(time)} · ${timeLabel(time)}` : ""}
              </p>
              <p className="mt-1 text-sm text-cream/40">
                {details.name} · {details.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void changeTime()}
              className={`-m-3 p-3 text-xs text-cream/40 underline-offset-4 transition-colors hover:text-cream hover:underline ${FOCUS}`}
            >
              Change time
            </button>
          </section>

          <section className={CARD}>
            <p className={EYEBROW}>Payment</p>
            <p className="mt-2 font-body text-sm text-cream/40">
              Your slot is held while you pay. One charge, now — nothing later.
            </p>

            <div className="mt-6">
              {clientSecret && stripePromise ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: ELEMENTS_APPEARANCE,
                    fonts: ELEMENTS_FONTS,
                  }}
                >
                  <PaymentStep
                    total={formatPrice(total)}
                    onPaid={() => {
                      setPhase("done");
                      onConfirmed?.();
                    }}
                  />
                </Elements>
              ) : (
                <p className="text-sm text-cream/60">
                  Payment is unavailable right now. Please message us on WhatsApp.
                </p>
              )}
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
