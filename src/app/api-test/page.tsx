"use client";

import { useEffect, useState } from "react";

/**
 * TEMPORARY — delete once the booking UI is built.
 *
 * Proves the browser → our route → Cal.com path end to end: auth, endpoint
 * shape and timezone, without the API key ever reaching the client.
 */
const CAL_ID = 6839068; // 1 Hour Recording

export default function ApiTestPage() {
  const [out, setOut] = useState<string>("loading…");

  useEffect(() => {
    const start = new Date();
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    const qs = new URLSearchParams({
      eventTypeId: String(CAL_ID),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });
    fetch(`/api/cal/slots?${qs}`)
      .then(async (r) => `HTTP ${r.status}\n\n${JSON.stringify(await r.json(), null, 2)}`)
      .then(setOut)
      .catch((e) => setOut(`fetch failed: ${String(e)}`));
  }, []);

  return (
    <section className="min-h-screen bg-background px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-black text-cream">
          Cal.com API test
        </h1>
        <p className="mt-2 font-body text-sm text-cream/50">
          Event type {CAL_ID} · next 7 days · /api/cal/slots
        </p>
        <pre className="mt-8 overflow-x-auto border border-cream/10 bg-surface p-6 text-xs text-cream/70">
          {out}
        </pre>
      </div>
    </section>
  );
}
