import { Resend } from "resend";
import { formatPrice } from "@/lib/booking";
import { TIMEZONE } from "@/lib/cal";

/**
 * Podflix transactional email.
 *
 * Cal.com's own notifications are Cal-branded and sent from hello@cal.com —
 * the client rejected a previous platform over exactly that — so Cal's emails
 * are disabled per event type and these are sent instead, from the Stripe
 * webhook.
 *
 * Sending never fails a booking: every send is wrapped, and a failure is
 * logged and swallowed. A paid session that arrives without an email is
 * recoverable; a payment lost to an SMTP error is not.
 */

const BRAND = {
  bg: "#0A0807",
  surface: "#111009",
  gold: "#A98F74",
  cream: "#EBE0D6",
  border: "#1E1A16",
  logo: "https://podflixpodcast.ae/assets/logos/white-version.png",
  site: "https://podflixpodcast.ae",
  whatsapp: "https://wa.me/971565343070",
  address: "Tamani Arts Building, 9th Floor, Studio 902, Business Bay, Dubai",
  maps: "https://www.google.com/maps/search/?api=1&query=Tamani+Arts+Building+Business+Bay+Dubai",
};

/** Plus Jakarta Sans is not web-safe; email clients fall back down this list. */
const FONT =
  "'Plus Jakarta Sans', 'Segoe UI', -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif";

export type BookingEmailData = {
  to: string;
  name: string;
  sessionName: string;
  start: string;
  hours: number;
  format?: string;
  setName?: string;
  addons?: string[];
  total: number;
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIMEZONE,
  }).format(new Date(iso));

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIMEZONE,
  }).format(new Date(iso));

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};color:${BRAND.cream};opacity:.5;font-size:13px;">${esc(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};color:${BRAND.cream};font-size:14px;text-align:right;">${esc(value)}</td>
    </tr>`;
}

function shell(title: string, inner: string) {
  // Tables and inline styles throughout — email clients strip <style> blocks
  // and have no flex/grid support worth relying on.
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.surface};border:1px solid ${BRAND.border};">
      <tr><td style="padding:32px 32px 0;">
        <img src="${BRAND.logo}" alt="Podflix" width="120" style="display:block;border:0;height:auto;">
      </td></tr>
      <tr><td style="padding:28px 32px 36px;font-family:${FONT};">
        ${inner}
      </td></tr>
      <tr><td style="padding:20px 32px;border-top:1px solid ${BRAND.border};font-family:${FONT};font-size:11px;line-height:1.6;">
        <!-- Colours set per-element, not via a parent opacity: opacity cascades
             to children, which dragged the link down to 1.77:1. -->
        <span style="color:#8A8178;">Podflix · ${esc(BRAND.address)}</span><br>
        <a href="${BRAND.site}" style="color:${BRAND.gold};text-decoration:none;">podflixpodcast.ae</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

export function confirmationEmail(d: BookingEmailData) {
  const details = [
    row("Date", fmtDate(d.start)),
    row("Time", `${fmtTime(d.start)} (${TIMEZONE.split("/")[1]})`),
    row("Duration", `${d.hours} hour${d.hours === 1 ? "" : "s"}`),
    d.format ? row("Format", d.format) : "",
    d.setName ? row("Set", d.setName) : "",
    d.addons?.length ? row("Add-ons", d.addons.join(", ")) : "",
  ].join("");

  return shell(
    "Your session is confirmed",
    `
    <p style="margin:0 0 6px;color:${BRAND.gold};font-size:11px;letter-spacing:.28em;text-transform:uppercase;">Booking confirmed</p>
    <h1 style="margin:0 0 8px;color:${BRAND.cream};font-size:28px;line-height:1.15;font-weight:800;">Your session is confirmed.</h1>
    <p style="margin:0 0 24px;color:${BRAND.cream};opacity:.55;font-size:14px;line-height:1.6;">
      Thanks ${esc(d.name)} — ${esc(d.sessionName)} is booked. Everything you need is below.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${details}
      <tr>
        <td style="padding:16px 0 0;color:${BRAND.cream};opacity:.5;font-size:13px;">Total paid</td>
        <td style="padding:16px 0 0;color:${BRAND.gold};font-size:22px;font-weight:800;text-align:right;">${esc(formatPrice(d.total))}</td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;background:${BRAND.bg};border:1px solid ${BRAND.border};">
      <tr><td style="padding:20px;">
        <p style="margin:0 0 6px;color:${BRAND.gold};font-size:11px;letter-spacing:.28em;text-transform:uppercase;">Where</p>
        <p style="margin:0 0 10px;color:${BRAND.cream};font-size:14px;line-height:1.6;">${esc(BRAND.address)}</p>
        <a href="${BRAND.maps}" style="color:${BRAND.gold};font-size:13px;text-decoration:none;">Open in Google Maps →</a>
      </td></tr>
    </table>

    <p style="margin:24px 0 0;color:${BRAND.cream};opacity:.55;font-size:13px;line-height:1.7;">
      <strong style="color:${BRAND.cream};opacity:1;">Please arrive 10 minutes early</strong> so we can get you set up and start on time.<br>
      Need to change something? Free reschedule up to 24 hours before your session.<br>
      Questions? <a href="${BRAND.whatsapp}" style="color:${BRAND.gold};text-decoration:none;">Message us on WhatsApp →</a>
    </p>`
  );
}

export function cancellationEmail(d: BookingEmailData & { reason?: string }) {
  return shell(
    "Your booking has been cancelled",
    `
    <p style="margin:0 0 6px;color:${BRAND.gold};font-size:11px;letter-spacing:.28em;text-transform:uppercase;">Booking cancelled</p>
    <h1 style="margin:0 0 8px;color:${BRAND.cream};font-size:28px;line-height:1.15;font-weight:800;">Your booking has been cancelled.</h1>
    <p style="margin:0 0 24px;color:${BRAND.cream};opacity:.55;font-size:14px;line-height:1.6;">
      ${esc(d.name)}, your ${esc(d.sessionName)} on ${esc(fmtDate(d.start))} at ${esc(fmtTime(d.start))} has been cancelled and the slot released.
    </p>
    ${d.reason ? `<p style="margin:0 0 24px;color:${BRAND.cream};opacity:.4;font-size:13px;">Reason: ${esc(d.reason)}</p>` : ""}
    <p style="margin:0;color:${BRAND.cream};opacity:.55;font-size:13px;line-height:1.7;">
      If a payment was taken it will be refunded to the original method.<br>
      Ready to rebook? <a href="${BRAND.site}/booking" style="color:${BRAND.gold};text-decoration:none;">Choose a new time →</a>
      or <a href="${BRAND.whatsapp}" style="color:${BRAND.gold};text-decoration:none;">message us on WhatsApp</a>.
    </p>`
  );
}

/** Resend's test sender works before the domain's DNS is verified. */
const FROM = process.env.RESEND_FROM || "Podflix <onboarding@resend.dev>";

/**
 * Fire-and-forget send. Returns whether it worked so callers can log, but
 * never throws — an email failure must not roll back a paid booking.
 */
export type EmailResult = { ok: boolean; id?: string; error?: string };

export async function sendBookingEmail(
  kind: "confirmation" | "cancellation",
  data: BookingEmailData & { reason?: string }
): Promise<EmailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`[email] RESEND_API_KEY missing — skipped ${kind} to ${data.to}`);
    return { ok: false, error: "RESEND_API_KEY missing" };
  }
  try {
    const resend = new Resend(key);
    const { data: sent, error } = await resend.emails.send({
      from: FROM,
      to: data.to,
      subject:
        kind === "confirmation"
          ? `Your Podflix session is confirmed — ${fmtDate(data.start)}`
          : `Your Podflix booking has been cancelled`,
      html:
        kind === "confirmation"
          ? confirmationEmail(data)
          : cancellationEmail(data),
    });
    if (error) {
      console.error(`[email] ${kind} failed`, error);
      return { ok: false, error: error.message ?? String(error) };
    }
    // The message id is what support needs to trace a delivery in Resend.
    console.info(`[email] ${kind} sent`, sent?.id, "→", data.to);
    return { ok: true, id: sent?.id };
  } catch (err) {
    console.error(`[email] ${kind} threw`, err);
    return { ok: false, error: String(err) };
  }
}
