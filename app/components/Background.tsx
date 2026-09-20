export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-paper">
      <div className="absolute inset-0 module-grid opacity-40" />
      {/* Oversized finder mark, cropped off-canvas, top right */}
      <div
        className="finder-mark absolute -top-24 -right-24 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] text-ink opacity-[0.04]"
        aria-hidden
      />
      {/* Oversized finder mark, cropped off-canvas, bottom left */}
      <div
        className="finder-mark absolute -bottom-28 -left-28 w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] text-ink opacity-[0.04]"
        aria-hidden
      />
    </div>
  );
}
