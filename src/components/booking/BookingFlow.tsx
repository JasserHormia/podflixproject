"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import EnterpriseBlock from "@/components/booking/EnterpriseBlock";
import BookingCheckout from "@/components/booking/checkout/BookingCheckout";
import PriceTag from "@/components/ui/PriceTag";
import PromoBadge from "@/components/ui/PromoBadge";
import { promoPrice } from "@/lib/promo";
import {
  ADDONS,
  FORMATS,
  durationLabel,
  hourlyRate,
  originalHourlyRate,
  SESSIONS,
  SETS,
  UNDECIDED_SET,
  formatPrice,
  headcountToFormat,
  sessionsIn,
  type FormatId,
  type SessionCategory,
} from "@/lib/booking";

const STEP_NAMES = ["People", "Set", "Session", "Confirm"] as const;
const HEADCOUNTS = [1, 2, 3, 4] as const;


const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * True only for devices that genuinely hover. Touch screens report
 * `(hover: none)`, and gating on this is what stops the includes panel from
 * being unreachable on a phone — hover-only reveal would hide the contents
 * of every tier from mobile buyers.
 */
function useHoverCapable() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false
  );
}

const seatLabel = (n: number) =>
  n === 1 ? "1 person" : n === 2 ? "2 people" : "3–4 people";

export default function BookingFlow() {
  const reduce = useReducedMotion();
  const hoverCapable = useHoverCapable();

  const [step, setStep] = useState(1);
  const [headcount, setHeadcount] = useState<number | null>(null);
  const [hoverCount, setHoverCount] = useState<number | null>(null);
  const [setId, setSetId] = useState<string | null>(null);
  const [category, setCategory] = useState<SessionCategory>("studio");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [addons, setAddons] = useState<string[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  /** Set once payment has succeeded — the choices behind it are no longer
   *  editable, so the escape hatches on step 4 change meaning. */
  const [confirmed, setConfirmed] = useState(false);

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  // ── Derived ──
  const format: FormatId | null =
    headcount === null ? null : headcountToFormat(headcount);
  const sets = format ? SETS[format] : [];
  const session = SESSIONS.find((s) => s.id === sessionId) ?? null;
  const chosenAddons = ADDONS.filter((a) => addons.includes(a.id));
  // promoPrice() per line, mirroring api/booking/create exactly. Discounting
  // the sum instead would round once and could land a dirham away from the
  // amount the server charges.
  const total =
    promoPrice(session?.price ?? 0) +
    chosenAddons.reduce((sum, a) => sum + promoPrice(a.price), 0);
  /** Pre-promotion total, for the struck-through comparison only. */
  const originalTotal =
    (session?.price ?? 0) + chosenAddons.reduce((sum, a) => sum + a.price, 0);
  const sessionValid = session !== null;

  const chosenSet = sets.find((s) => s.id === setId) ?? null;
  const setName =
    setId === UNDECIDED_SET ? "Not sure yet — needs a recommendation" : chosenSet?.name ?? "—";
  const sessionLabel = session
    ? `${session.name} · ${durationLabel(session.hours)}`
    : "—";
  const addonLabel = chosenAddons.length
    ? chosenAddons.map((a) => `${a.name} (+${formatPrice(promoPrice(a.price))})`).join(" · ")
    : "None";

  const rows = sessionsIn(category);

  /** Switching tab clears the previous tab's pick — the tiers are not
   *  interchangeable, so a carried-over selection would be wrong. */
  const selectCategory = (next: SessionCategory) => {
    setCategory(next);
    setSessionId(null);
    setHovered(null);
  };

  const toggleAddon = (id: string) =>
    setAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

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
    setCategory("studio");
    setSessionId(null);
    setAddons([]);
    setConfirmed(false);
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
            {step > 1 && !confirmed && (
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
                          alt={s.alt}
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

                {/* Renders nothing once PROMO_ACTIVE is false, so this cannot
                    outlive the discount it advertises. */}
                <PromoBadge className="mt-6" />

                {/* Category tabs */}
                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-1 border-b border-cream/10">
                  {(
                    [
                      ["studio", "Studio Only"],
                      ["editing", "Studio + Editing"],
                      ["package", "Packages"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectCategory(id)}
                      aria-pressed={category === id}
                      className={`relative -mb-px flex min-h-11 items-end pb-3 pt-2 font-body text-sm transition-colors ${FOCUS} ${
                        category === id ? "text-gold" : "text-cream/40 hover:text-cream/70"
                      }`}
                    >
                      {label}
                      {category === id && (
                        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gold" />
                      )}
                    </button>
                  ))}
                </div>

                {/* One unified list for all three tabs. The includes panel
                    reveals on hover where hovering exists, and on selection
                    where it does not — a hover-only reveal would leave touch
                    users unable to see what a tier contains. */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={category}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="mt-6"
                  >
                    {rows.map((s) => {
                      const active = sessionId === s.id;
                      const open = active || (hoverCapable && hovered === s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSessionId(s.id)}
                          onMouseEnter={hoverCapable ? () => setHovered(s.id) : undefined}
                          onMouseLeave={hoverCapable ? () => setHovered(null) : undefined}
                          onFocus={hoverCapable ? () => setHovered(s.id) : undefined}
                          onBlur={hoverCapable ? () => setHovered(null) : undefined}
                          aria-pressed={active}
                          aria-expanded={open}
                          className={`group relative w-full cursor-pointer overflow-hidden border-b border-cream/10 px-2 py-7 text-left transition-colors duration-300 ${FOCUS} ${
                            active
                              ? "border-l-2 border-l-gold bg-surface pl-4"
                              : "hover:bg-surface/50 focus-visible:bg-surface/50"
                          }`}
                        >
                          <span className="flex items-start justify-between gap-4">
                            {/* LEFT */}
                            <span className="min-w-0">
                              <span
                                className={`block font-display text-xl font-semibold transition-colors duration-300 md:text-2xl ${
                                  active ? "text-gold" : "text-cream group-hover:text-gold"
                                }`}
                              >
                                {s.name}
                              </span>
                              {s.category === "package" && (
                                <span className="mt-0.5 block text-sm text-gold">
                                  {s.tagline}
                                </span>
                              )}
                              {s.category !== "package" && (
                                <span className="mt-1 block text-sm text-cream/40">
                                  {s.tagline}
                                </span>
                              )}
                              <span className="mt-3 inline-block border border-cream/20 px-2 py-1 text-[10px] uppercase tracking-widest text-cream/50">
                                {durationLabel(s.hours)}
                              </span>
                            </span>

                            {/* RIGHT */}
                            <span className="shrink-0 text-right">
                              {s.recommended && (
                                <span className="mb-1 block bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-background">
                                  Popular
                                </span>
                              )}
                              <PriceTag
                                original={s.price}
                                stacked
                                className="font-display text-2xl font-black text-gold"
                                strikeClassName="font-display text-sm font-semibold text-cream/30"
                              />
                              {s.hours > 1 && (
                                <span className="mt-1 block text-xs text-cream/30">
                                  <PriceTag
                                    original={originalHourlyRate(s)}
                                    current={hourlyRate(s)}
                                    suffix="/hour"
                                    strikeClassName="text-cream/30"
                                  />
                                </span>
                              )}
                            </span>
                          </span>

                          {/* Touch devices get an explicit affordance, since
                              there is no hover to discover the panel with. */}
                          {!hoverCapable && (
                            <span className="mt-3 inline-flex items-center gap-1 text-xs text-cream/40">
                              What&apos;s included
                              <span
                                aria-hidden
                                className={`inline-block transition-transform duration-300 ${
                                  open ? "rotate-180" : ""
                                }`}
                              >
                                ↓
                              </span>
                            </span>
                          )}

                          <AnimatePresence initial={false}>
                            {open && (
                              <motion.span
                                className="block overflow-hidden"
                                initial={reduce ? false : { height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={reduce ? undefined : { height: 0, opacity: 0 }}
                                transition={{
                                  duration: reduce ? 0 : 0.3,
                                  ease: [0.04, 0.62, 0.23, 0.98],
                                }}
                              >
                                <span className="block pb-2 pt-5">
                                  {s.category === "package" && (
                                    <span className="mb-3 block text-sm text-cream/50">
                                      {s.description}
                                    </span>
                                  )}
                                  <span className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                                    {s.includes.map((inc) => (
                                      <span
                                        key={inc}
                                        className="flex gap-2 text-sm text-cream/60"
                                      >
                                        <span aria-hidden className="text-gold">
                                          ✓
                                        </span>
                                        {inc}
                                      </span>
                                    ))}
                                  </span>
                                  {s.revisions && (
                                    <span className="mt-3 block text-[10px] uppercase tracking-[0.25em] text-gold/70">
                                      {s.revisions}
                                    </span>
                                  )}
                                </span>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                {/* ── Add-ons — stackable, any combination ── */}
                <div className="mt-8 border border-gold/30 bg-gold/10 p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Add-ons</p>

                  <div className="mt-4 space-y-4">
                    {ADDONS.map((a) => {
                      const on = addons.includes(a.id);
                      return (
                        <label key={a.id} className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggleAddon(a.id)}
                            className="peer sr-only"
                          />
                          <span
                            aria-hidden
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ${
                              on ? "border-gold bg-gold text-background" : "border-cream/30"
                            }`}
                          >
                            {on ? "✓" : ""}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-body text-sm text-cream">
                              {a.name} — +
                              <PriceTag
                                original={a.price}
                                className="text-cream"
                                strikeClassName="text-cream/30"
                              />
                            </span>
                            <span className="mt-0.5 block text-xs text-cream/40">
                              {a.description}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {sessionValid && (
                    <p className="mt-5 font-display text-3xl font-black text-gold">
                      Total:{" "}
                      <PriceTag
                        original={originalTotal}
                        current={total}
                        className="text-gold"
                        strikeClassName="text-xl text-cream/30"
                      />
                    </p>
                  )}
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
                    <p className="mt-3 text-xs text-cream/40">Select a session to continue.</p>
                  )}
                </div>

                {/* Sits after Continue, not between the total and the CTA —
                    it is a sales enquiry, not a step in the purchase. Renders
                    on all three tabs, outside the tab AnimatePresence. */}
                <EnterpriseBlock className="mt-10" />
              </motion.div>
            )}

            {/* ═══ STEP 4 — CONFIRM ═══ */}
            {step === 4 && (
              <motion.div key="s4" {...variants} transition={{ duration: 0.35, ease: "easeOut" }}>
                    <h2 className="font-display text-[clamp(32px,4vw,56px)] font-black leading-[0.95] text-cream">
                      {confirmed ? "All set." : "Confirm & schedule."}
                    </h2>

                    {/* Summary */}
                    <div className="mt-10 border border-gold/30 bg-surface p-6">
                      <div className="flex items-start justify-between">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold">
                          Your session
                        </h3>
                        {/* Nothing here is editable once it has been paid for. */}
                        {!confirmed && (
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className={`-m-3 p-3 text-xs text-cream/40 underline-offset-4 hover:text-cream hover:underline ${FOCUS}`}
                          >
                            Edit
                          </button>
                        )}
                      </div>

                      <dl className="mt-6 space-y-3 text-sm">
                        {[
                          ["People", `${headcount}`],
                          ["Format", format ? FORMATS[format].name : "—"],
                          ["Set", setName],
                          ["Session", sessionLabel],
                          ["Add-ons", addonLabel],
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
                            <PriceTag
                              original={originalTotal}
                              current={total}
                              className="text-gold"
                              strikeClassName="text-base text-cream/30"
                            />
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Date, details and payment — all inline, no redirect and
                        no embed. Steps 1–3 above are the input; this is where
                        the booking is actually made. */}
                    <div className="mt-8">
                      {session && (
                        <BookingCheckout
                          bookingSessionId={session.id}
                          sessionLabel={sessionLabel}
                          format={format ? FORMATS[format].name : "—"}
                          setName={setName}
                          addonIds={addons}
                          total={total}
                          hours={session.hours}
                          onConfirmed={() => setConfirmed(true)}
                        />
                      )}
                    </div>

                    <p className="mt-8 text-sm">
                      <button
                        type="button"
                        onClick={reset}
                        className={`-m-3 p-3 text-cream/40 underline-offset-4 transition-colors hover:text-cream hover:underline ${FOCUS}`}
                      >
                        {confirmed ? "Book another session" : "Start over"}
                      </button>
                    </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
