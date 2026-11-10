export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-ground" aria-hidden>
      {/* Halftone ink fields, the second spot color of the print */}
      <div className="halftone halftone-coral absolute -right-32 -top-32 h-[460px] w-[460px] sm:h-[640px] sm:w-[640px]" />
      <div className="halftone halftone-light absolute -bottom-32 -left-24 h-[360px] w-[360px] sm:h-[480px] sm:w-[480px]" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
