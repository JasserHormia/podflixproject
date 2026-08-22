"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  ADDON_REELS,
  DEFAULT_RENTAL_INDEX,
  FORMATS,
  PACKAGES,
  RENTAL_RATES,
  SETS,
  UNDECIDED_SET,
  formatPrice,
  headcountToFormat,
  type FormatId,
} from "@/lib/booking";
import { SOCIAL } from "@/lib/brand";

const STEP_NAMES = ["People", "Set", "Session", "Confirm"] as const;
const HEADCOUNTS = [1, 2, 3, 4] as const;
type Mode = "rental" | "package";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const seatLabel = (n: number) =>
  n === 1 ? "1 person" : n === 2 ? "2 people" : "3–4 people";

export default function BookingFlow() {
  const reduce = useReducedMotion();

  const [step, setStep] = useState(1);
  const [headcount, setHeadcount] = useState<number | null>(null);
  const [hoverCount, setHoverCount] = useState<number | null>(null);
  const [setId, setSetId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("rental");
  const [rentalIndex, setRentalIndex] = useState(DEFAULT_RENTAL_INDEX);
  const [packageId, setPackageId] = useState<string | null>(null);
  const [addReels, setAddReels] = useState(false);
  const [sent, setSent] = useState(false);

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  // ── Derived ──
  const format: FormatId | null =
    headcount === null ? null : headcountToFormat(headcount);
  const sets = format ? SETS[format] : [];
  const rate = RENTAL_RATES[rentalIndex];
  const pkg = PACKAGES.find((p) => p.id === packageId) ?? null;
  const base = mode === "rental" ? rate.price : (pkg?.price ?? 0);
  const total = base + (addReels ? ADDON_REELS.price : 0);
  const sessionValid = mode === "rental" || pkg !== null;

  const chosenSet = sets.find((s) => s.id === setId) ?? null;
  const setName =
    setId === UNDECIDED_SET ? "Not sure yet — needs a recommendation" : chosenSet?.name ?? "—";
  const sessionLabel =
    mode === "rental"
      ? `Studio rental · ${rate.hours}h`
      : pkg
        ? `${pkg.name} (${pkg.duration})`
        : "—";

  // ── Actions ──
  const pickHeadcount = (n: number) => {
    setHeadcount(n);
    setSetId(null); // a different format means a different set list
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => setStep(2), 300);
  };

  const reset = () => {
    setStep(1);
    setHeadcount(null);
    setHoverCount(null);
    setSetId(null);
    setMode("rental");
    setRentalIndex(DEFAULT_RENTAL_INDEX);
    setPackageId(null);
    setAddReels(false);
    setSent(false);
  };

  const whatsappHref = () => {
    const body = [
      "New Booking Request — Podflix",
      `People: ${headcount}`,
      `Format: ${format ? FORMATS[format].name : "—"}`,
      `Set: ${setName}`,
      `Session: ${sessionLabel}`,
      `Add-on: ${addReels ? `3 Reels +${formatPrice(ADDON_REELS.price)}` : "none"}`,
      `Total: ${formatPrice(total)}`,
    ].join("\n");
    return `${SOCIAL.whatsapp}?text=${encodeURIComponent(body)}`;
  };

  const sendToWhatsApp = () => {
    window.open(whatsappHref(), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  // ── Step transition ──
  const variants = reduce
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
      };

  const feedbackFor = hoverCount ?? headcount;

  return (
    <section className="relative bg-background">
      <div className="mx-auto max-w-4xl px-6 pb-32 pt-24 md:pb-24">
        {/* ── Progress ── */}
        <div className="sticky top-16 z-20 -mx-6 mb-14 bg-background/95 px-6 py-4 backdrop-blur-md">
          {/* Carries the backdrop up through the 64px the fixed navbar occupies.
              When the bar is stuck this hides content scrolling past above it;
              when it is not, it sits over the section's own top padding and is
              invisible. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-full h-16 bg-background/95 backdrop-blur-md"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
              Step {String(step).padStart(2, "0")} / 04
            </span>
            {step > 1 && !sent && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                // Negative margin keeps the layout identical while giving the
                // hit area real size on touch.
                className={`-m-3.5 p-3.5 text-xs text-cream/40 transition-colors hover:text-cream ${FOCUS}`}
              >
                ← Back
              </button>
            )}
          </div>

          <div className="mt-3 flex gap-2" aria-hidden>
            {STEP_NAMES.map((name, i) => (
              <span
                key={name}
                className={`h-px flex-1 transition-colors duration-500 ${
                  i <= step - 1 ? "bg-gold" : "bg-cream/10"
                }`}
              />
            ))}
          </div>

          <div className="mt-3 flex justify-between">
            {STEP_NAMES.map((name, i) => (
              <span
                key={name}
                className={`text-[10px] uppercase tracking-[0.25em] transition-colors duration-500 ${
                  i === step - 1 ? "text-gold" : "text-cream/30"
                }`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* ── Steps ──
             overflow-hidden clips the ±40px slide between steps, which would
             otherwise widen the document mid-transition. The -mx-2/px-2 pair
             pushes the clip edge clear of focus rings without moving content. */}
        <div className="-mx-2 min-h-136 overflow-hidden px-2">
          <AnimatePresence mode="wait">
            {/* ═══ STEP 1 — PEOPLE ═══ */}
            {step === 1 && (
              <motion.div key="s1" {...variants} transition={{ duration: 0.35, ease: "easeOut" }}>
                <h2 className="font-display text-[clamp(32px,4vw,56px)] font-black leading-[0.95] text-cream">
                  How many people are recording?
                </h2>

                <div
                  className="mt-12 flex flex-wrap gap-4"
                  onMouseLeave={() => setHoverCount(null)}
                >
                  {HEADCOUNTS.map((n) => {
                    const active = headcount === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => pickHeadcount(n)}
                        onMouseEnter={() => setHoverCount(n)}
                        onFocus={() => setHoverCount(n)}
                        onBlur={() => setHoverCount(null)}
                        aria-pressed={active}
                        aria-label={`${n} ${n === 1 ? "person" : "people"}`}
                        className={`h-20 w-20 border font-display text-2xl font-black transition-colors duration-300 ${FOCUS} ${
                          active
                            ? "border-gold bg-gold text-background"
                            : "border-cream/20 text-cream hover:border-gold/60"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-8 min-h-6 text-sm tracking-widest text-gold">
                  {feedbackFor !== null
                    ? (() => {
                        const f = headcountToFormat(feedbackFor);
                        return `${seatLabel(feedbackFor)} → ${FORMATS[f].name} · ${SETS[f].length} sets available`;
                      })()
                    : ""}
                </p>
              </motion.div>
            )}

            {/* ═══ STEP 2 — SET ═══ */}
            {step === 2 && format && (
              <motion.div key="s2" {...variants} transition={{ duration: 0.35, ease: "easeOut" }}>
                <h2 className="font-display text-[clamp(32px,4vw,56px)] font-black leading-[0.95] text-cream">
                  Choose your set.
                </h2>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-gold">
                  {FORMATS[format].name} · {sets.length} sets
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {sets.map((s) => {
                    const active = setId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSetId(s.id)}
                        aria-pressed={active}
                        className={`group relative aspect-4/3 overflow-hidden text-left transition-colors ${FOCUS} ${
                          active ? "border-2 border-gold" : "border border-cream/10"
                        }`}
                      >
                        <Image
                          src={s.image}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 30vw, 45vw"
                          quality={75}
                          className={`object-cover transition-transform duration-500 ${
                            reduce ? "" : "group-hover:scale-[1.04]"
                          }`}
                        />
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent"
                        />
                        {active && (
                          <span
                            aria-hidden
                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-black text-background"
                          >
                            ✓
                          </span>
                        )}
                        <span className="absolute inset-x-3 bottom-3">
                          <span className="block font-display text-xl font-black text-cream">
                            {s.name}
                          </span>
                          <span className="mt-1 flex flex-wrap gap-1">
                            {s.moods.map((m) => (
                              <span
                                key={m}
                                className="bg-cream/10 px-2 py-0.5 text-[10px] tracking-widest text-cream/60"
                              >
                                {m}
                              </span>
                            ))}
                          </span>
                        </span>
                      </button>
                    );
                  })}

                  {/* Escape hatch for guests who would rather be advised */}
                  <button
                    type="button"
                    onClick={() => setSetId(UNDECIDED_SET)}
                    aria-pressed={setId === UNDECIDED_SET}
                    className={`flex aspect-4/3 flex-col items-center justify-center border border-dashed bg-surface p-4 text-center transition-colors ${FOCUS} ${
                      setId === UNDECIDED_SET
                        ? "border-gold border-solid border-2"
                        : "border-cream/20 hover:border-gold/50"
                    }`}
                  >
                    <span className="font-display text-base font-black text-cream">
                      Not sure
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-widest text-cream/40">
                      Help me choose
                    </span>
                  </button>
                </div>

                {setId && (
                  <div className="mt-10">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className={`w-full bg-gold px-10 py-5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-cream sm:w-auto ${FOCUS}`}
                    >
                      Continue →
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══ STEP 3 — SESSION ═══ */}
            {step === 3 && (
              <motion.div key="s3" {...variants} transition={{ duration: 0.35, ease: "easeOut" }}>
                <h2 className="font-display text-[clamp(32px,4vw,56px)] font-black leading-[0.95] text-cream">
                  What kind of session?
                </h2>

                {/* Mode tabs */}
                <div className="mt-8 flex gap-8 border-b border-cream/10">
                  {(
                    [
                      ["rental", "Studio Rental"],
                      ["package", "Production Package"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMode(id)}
                      aria-pressed={mode === id}
                      className={`relative -mb-px flex min-h-11 items-end pb-3 pt-2 font-body text-sm transition-colors ${FOCUS} ${
                        mode === id
                          ? "text-gold"
                          : "text-cream/40 hover:text-cream/70"
                      }`}
                    >
                      {label}
                      {mode === id && (
                        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gold" />
                      )}
                    </button>
                  ))}
                </div>

                {/* ── Mode A: rental stepper ── */}
                {mode === "rental" && (
                  <div className="mt-10 border border-cream/10 bg-surface p-8 text-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40">
                      Session duration
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-8">
                      <button
                        type="button"
                        onClick={() => setRentalIndex((i) => Math.max(0, i - 1))}
                        disabled={rentalIndex === 0}
                        aria-label="Shorter session"
                        className={`flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 text-xl text-cream transition-colors hover:border-gold disabled:opacity-30 disabled:hover:border-cream/20 ${FOCUS}`}
                      >
                        −
                      </button>

                      <span
                        aria-live="polite"
                        className="min-w-20 font-display text-5xl font-black text-cream"
                      >
                        {rate.hours}h
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setRentalIndex((i) => Math.min(RENTAL_RATES.length - 1, i + 1))
                        }
                        disabled={rentalIndex === RENTAL_RATES.length - 1}
                        aria-label="Longer session"
                        className={`flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 text-xl text-cream transition-colors hover:border-gold disabled:opacity-30 disabled:hover:border-cream/20 ${FOCUS}`}
                      >
                        +
                      </button>
                    </div>

                    {/* Keyed so Framer remounts and fades on every change. No
                        AnimatePresence: mode="wait" would hold the previous
                        price on screen through its exit, leaving the number
                        visibly a step behind the duration above it. */}
                    <motion.p
                      key={rate.hours}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="mt-6 font-display text-4xl font-black text-gold"
                    >
                      {formatPrice(rate.price)}
                    </motion.p>

                    {"recommended" in rate && rate.recommended && (
                      <span className="mt-3 inline-block bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-background">
                        Most popular
                      </span>
                    )}

                    <p className="mt-6 text-sm text-cream/40">
                      Raw footage delivery · Studio operator included
                    </p>
                  </div>
                )}

                {/* ── Mode B: production packages ── */}
                {mode === "package" && (
                  <div className="mt-10">
                    {PACKAGES.map((p) => {
                      const active = packageId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPackageId(p.id)}
                          aria-pressed={active}
                          className={`flex w-full items-start justify-between gap-4 border-b border-cream/10 py-6 text-left transition-colors ${FOCUS} ${
                            active ? "border-l-2 border-l-gold bg-surface pl-4" : "pl-0"
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="font-display text-xl font-semibold text-cream">
                                {p.name}
                              </span>
                              {p.recommended && (
                                <span className="bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-background">
                                  Best value
                                </span>
                              )}
                            </span>
                            <span className="mt-1 block text-sm text-cream/40">
                              {p.duration} · {p.includes.join(", ")}
                            </span>
                          </span>
                          <span className="shrink-0 font-display text-xl font-black text-gold">
                            {formatPrice(p.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ── Add-on ── */}
                <div className="mt-8 border border-gold/30 bg-gold/10 p-5">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addReels}
                      onChange={(e) => setAddReels(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ${
                        addReels ? "border-gold bg-gold text-background" : "border-cream/30"
                      }`}
                    >
                      {addReels ? "✓" : ""}
                    </span>
                    <span className="font-body text-sm text-cream">
                      {ADDON_REELS.label} — +{formatPrice(ADDON_REELS.price)}
                    </span>
                  </label>

                  <p className="mt-4 font-display text-3xl font-black text-gold">
                    Total: {sessionValid ? formatPrice(total) : "—"}
                  </p>
                </div>

                <div className="mt-10">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    disabled={!sessionValid}
                    className={`w-full bg-gold px-10 py-5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-cream disabled:opacity-30 disabled:hover:bg-gold sm:w-auto ${FOCUS}`}
                  >
                    Continue →
                  </button>
                  {!sessionValid && (
                    <p className="mt-3 text-xs text-cream/40">Select a package to continue.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 4 — CONFIRM ═══ */}
            {step === 4 && (
              <motion.div key="s4" {...variants} transition={{ duration: 0.35, ease: "easeOut" }}>
                {sent ? (
                  <div className="flex flex-col items-center py-16 text-center">
                    <span
                      aria-hidden
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-2xl font-black text-background"
                    >
                      ✓
                    </span>
                    <h2 className="mt-8 font-display text-4xl font-black text-cream">
                      Request sent.
                    </h2>
                    <p className="mt-4 text-cream/50">
                      We&apos;ll confirm your slot within 15 minutes.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className={`mt-8 text-sm text-gold underline-offset-4 hover:underline ${FOCUS}`}
                    >
                      Book another session
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-[clamp(32px,4vw,56px)] font-black leading-[0.95] text-cream">
                      Choose your time.
                    </h2>

                    {/* Summary */}
                    <div className="mt-10 border border-gold/30 bg-surface p-6">
                      <div className="flex items-start justify-between">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold">
                          Your session
                        </h3>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className={`text-xs text-cream/40 underline-offset-4 hover:text-cream hover:underline ${FOCUS}`}
                        >
                          Edit
                        </button>
                      </div>

                      <dl className="mt-6 space-y-3 text-sm">
                        {[
                          ["People", `${headcount}`],
                          ["Format", format ? FORMATS[format].name : "—"],
                          ["Set", setName],
                          ["Session", sessionLabel],
                          [
                            "Add-on",
                            addReels
                              ? `3 edited reels · +${formatPrice(ADDON_REELS.price)}`
                              : "None",
                          ],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="flex justify-between gap-6 border-b border-cream/5 pb-3"
                          >
                            <dt className="shrink-0 text-cream/40">{label}</dt>
                            <dd className="text-right text-cream">{value}</dd>
                          </div>
                        ))}
                        <div className="flex items-baseline justify-between gap-6 pt-2">
                          <dt className="text-cream/40">Total</dt>
                          <dd className="font-display text-2xl font-black text-gold">
                            {formatPrice(total)}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/*
                      Simplybook.me mount point.
                      TODO Stage 2: the embed script mounts the calendar + Stripe
                      checkout here. The selections above live in this component's
                      state as headcount, format, setId, mode, rentalIndex,
                      packageId, addReels and total — pass them to the widget as
                      prefill params / intake fields when wiring it up.
                    */}
                    <div id="sb-widget" className="mt-8 min-h-150 w-full">
                      {/* Temporary fallback so the page books real sessions today. */}
                      <div className="flex h-full min-h-150 flex-col items-center justify-center gap-6 border border-cream/10 bg-surface/40 p-8 text-center">
                        <p className="max-w-sm text-cream/50">
                          Confirm your slot on WhatsApp — we reply within 15 minutes.
                        </p>
                        <MagneticButton
                          onClick={sendToWhatsApp}
                          className={`block w-full max-w-sm rounded-none bg-gold px-10 py-5 text-center font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-cream sm:w-auto ${FOCUS}`}
                        >
                          Continue on WhatsApp →
                        </MagneticButton>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
