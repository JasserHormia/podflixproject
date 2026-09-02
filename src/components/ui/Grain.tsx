/**
 * Cinematic overlay: fixed film-grain texture + a soft vignette.
 * Pure CSS/SVG (no assets), pointer-events-none, sits above content but below cursor.
 * Server component — no interactivity.
 */
const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export default function Grain() {
  return (
    <>
      {/* Grain */}
      <div
        aria-hidden
        className="touch-hide pointer-events-none fixed inset-0 z-[55] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
          backgroundSize: "160px 160px",
        }}
      />
      {/* Vignette — darkens the edges for depth */}
      <div
        aria-hidden
        className="touch-hide pointer-events-none fixed inset-0 z-[54]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </>
  );
}
