// Single source of truth for the mark. Mirrors public/logo.svg (favicons, app icons and OG art are rendered from it).
// A miniature QR code: three finder patterns plus data modules.
const finders: [number, number][] = [
  [91, 91],
  [301, 91],
  [91, 301],
];
const modules: [number, number][] = [
  [286, 286],
  [390, 286],
  [338, 338],
  [286, 390],
  [390, 390],
];

export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <rect width="512" height="512" rx="112" fill="#15123a" />
      {finders.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="120" height="120" rx="22" fill="none" stroke="#ffffff" strokeWidth="30" />
          <rect x={x + 35} y={y + 35} width="50" height="50" rx="10" fill="#ff5c47" />
        </g>
      ))}
      {modules.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="48" height="48" rx="10" fill="#ff5c47" />
      ))}
    </svg>
  );
}
