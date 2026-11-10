"use client";

import { useState, useRef, useCallback, useMemo, useSyncExternalStore } from "react";
import QRCode from "@cheprasov/qrcode";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { sileo } from "sileo";
import {
  Download,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Link2,
  Grid3X3,
  Circle,
  Square,
  Hexagon,
} from "lucide-react";

type QRSize = "sm" | "md" | "lg";
type QRPattern = "squares" | "dots" | "rounded" | "classy" | "elegant";

const sizeMap: Record<QRSize, number> = {
  sm: 150,
  md: 200,
  lg: 280,
};

const colorPresets = [
  { name: "Classic", fg: "#000000", bg: "#ffffff" },
  { name: "Indigo", fg: "#4f46e5", bg: "#ffffff" },
  { name: "Ocean", fg: "#0891b2", bg: "#ffffff" },
  { name: "Emerald", fg: "#059669", bg: "#ffffff" },
  { name: "Rose", fg: "#e11d48", bg: "#ffffff" },
  { name: "Violet", fg: "#7c3aed", bg: "#ffffff" },
];

const patternOptions: { name: QRPattern; icon: typeof Grid3X3; label: string }[] = [
  { name: "squares", icon: Square, label: "Square" },
  { name: "dots", icon: Circle, label: "Dots" },
  { name: "rounded", icon: Grid3X3, label: "Rounded" },
  { name: "classy", icon: Hexagon, label: "Classy" },
  { name: "elegant", icon: Sparkles, label: "Elegant" },
];

// QR Code generation using canvas with different patterns
function generateQRWithPattern(
  text: string,
  size: number,
  pattern: QRPattern,
  fgColor: string,
  bgColor: string
): string {
  const qr = new QRCode.QRCodeRaw(text, { level: "H" });
  const modules = qr.getData();
  
  if (!modules) return "";
  
  const moduleCount = modules.length;
  const cellSize = size / moduleCount;
  
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) return "";
  
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);
  
  ctx.fillStyle = fgColor;
  
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (modules[row][col]) {
        const x = col * cellSize;
        const y = row * cellSize;
        
        switch (pattern) {
          case "dots":
            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "rounded":
            drawRoundedRect(ctx, x + 1, y + 1, cellSize - 2, cellSize - 2, cellSize * 0.3);
            break;
          case "classy":
            ctx.beginPath();
            ctx.moveTo(x + cellSize / 2, y + 2);
            ctx.lineTo(x + cellSize - 2, y + cellSize / 2);
            ctx.lineTo(x + cellSize / 2, y + cellSize - 2);
            ctx.lineTo(x + 2, y + cellSize / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case "elegant":
            const hasRight = col < moduleCount - 1 && modules[row][col + 1];
            const hasBottom = row < moduleCount - 1 && modules[row + 1][col];
            const hasLeft = col > 0 && modules[row][col - 1];
            const hasTop = row > 0 && modules[row - 1][col];
            drawConnectedModule(ctx, x, y, cellSize, hasTop, hasRight, hasBottom, hasLeft);
            break;
          case "squares":
          default:
            ctx.fillRect(x, y, cellSize, cellSize);
            break;
        }
      }
    }
  }
  
  return canvas.toDataURL("image/png");
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function drawConnectedModule(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, hasTop: boolean, hasRight: boolean, hasBottom: boolean, hasLeft: boolean) {
  const radius = size * 0.4;
  const margin = 1;
  
  ctx.beginPath();
  
  if (hasTop || hasLeft) {
    ctx.moveTo(x + margin, y + margin);
  } else {
    ctx.moveTo(x + margin + radius, y + margin);
    ctx.quadraticCurveTo(x + margin, y + margin, x + margin, y + margin + radius);
  }
  
  if (hasBottom || hasLeft) {
    ctx.lineTo(x + margin, y + size - margin);
  } else {
    ctx.lineTo(x + margin, y + size - margin - radius);
    ctx.quadraticCurveTo(x + margin, y + size - margin, x + margin + radius, y + size - margin);
  }
  
  if (hasBottom || hasRight) {
    ctx.lineTo(x + size - margin, y + size - margin);
  } else {
    ctx.lineTo(x + size - margin - radius, y + size - margin);
    ctx.quadraticCurveTo(x + size - margin, y + size - margin, x + size - margin, y + size - margin - radius);
  }
  
  if (hasTop || hasRight) {
    ctx.lineTo(x + size - margin, y + margin);
  } else {
    ctx.lineTo(x + size - margin, y + margin + radius);
    ctx.quadraticCurveTo(x + size - margin, y + margin, x + size - margin - radius, y + margin);
  }
  
  ctx.closePath();
  ctx.fill();
}

const SAMPLE = "https://qraft.ashutoshswamy.in";
const EASE = [0.16, 1, 0.3, 1] as const;

function buildQR(value: string, size: number, pattern: QRPattern, color: { fg: string; bg: string }) {
  try {
    return generateQRWithPattern(value, size, pattern, color.fg, color.bg);
  } catch {
    return "";
  }
}

const chipBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97]";
const chipOn = "border-accent bg-accent text-accent-text";
const chipOff = "border-line text-ink hover:bg-ink/6";

export default function QRGenerator() {
  const [inputValue, setInputValue] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedSize, setSelectedSize] = useState<QRSize>("md");
  const [selectedColor, setSelectedColor] = useState(colorPresets[0]);
  const [selectedPattern, setSelectedPattern] = useState<QRPattern>("rounded");
  const [pass, setPass] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // Canvas needs the browser; keeps server and first client render identical.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const hasResult = qrValue !== "";

  const qrImageUrl = useMemo(() => {
    if (!mounted) return "";
    return buildQR(qrValue || SAMPLE, sizeMap[selectedSize] * 2, selectedPattern, selectedColor);
  }, [mounted, qrValue, selectedSize, selectedPattern, selectedColor]);

  const handleGenerate = useCallback(() => {
    const value = inputValue.trim();
    if (!value) {
      sileo.warning({ title: "Nothing to encode", description: "Paste a link or some text first." });
      return;
    }
    if (!buildQR(value, 64, "squares", selectedColor)) {
      sileo.error({
        title: "Couldn't generate that code",
        description: "The text is too long for a QR code. Try something shorter.",
      });
      return;
    }
    setQrValue(value);
    setPass((p) => p + 1);
    sileo.success({ title: "QR code ready", description: "Download it as a PNG when you like it." });
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() =>
        stageRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }),
      );
    }
  }, [inputValue, selectedColor, reduceMotion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleGenerate();
  };

  const handleDownload = useCallback(() => {
    if (!hasResult || !qrImageUrl) return;
    const link = document.createElement("a");
    link.download = "qraft-qrcode.png";
    link.href = qrImageUrl;
    link.click();
    sileo.success({ title: "Download started", description: "qraft-qrcode.png" });
  }, [hasResult, qrImageUrl]);

  const handleCopy = useCallback(async () => {
    if (!inputValue) {
      sileo.warning({ title: "Nothing to copy", description: "The field is empty." });
      return;
    }
    try {
      await navigator.clipboard.writeText(inputValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      sileo.success({ title: "Copied to clipboard" });
    } catch {
      sileo.error({ title: "Couldn't copy", description: "Your browser blocked clipboard access." });
    }
  }, [inputValue]);

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:px-8">
      {/* Controls */}
      <section aria-labelledby="qr-heading">
        <motion.h1
          id="qr-heading"
          {...rise(0)}
          className="font-display text-balance text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-on-ground sm:text-5xl lg:text-6xl"
        >
          Encode anything into a <span className="overprint">scannable mark.</span>
        </motion.h1>
        <motion.p {...rise(0.08)} className="mt-4 max-w-md text-lg text-on-ground-soft">
          Paste a link or text, choose a shape, generate.
        </motion.p>

        <motion.div
          {...rise(0.16)}
          className="mt-8 rounded-3xl bg-paper p-5 shadow-[0_28px_56px_-28px_rgb(8_6_70/0.6)] sm:p-7"
        >
          {/* Source */}
          <label htmlFor="qr-source" className="label mb-2 block">
            Link or text
          </label>
          <div className="relative">
            <Link2
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft"
              strokeWidth={2}
              aria-hidden
            />
            <input
              id="qr-source"
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ashutoshswamy.in"
              className="h-14 w-full rounded-xl border-2 border-line bg-transparent pl-12 pr-14 text-base text-ink transition-colors duration-200 focus:border-accent"
            />
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy text"
              title="Copy text"
              className="absolute right-1.5 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-ink/6 hover:text-ink"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "check" : "copy"}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="grid place-items-center"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-accent" strokeWidth={2.5} />
                  ) : (
                    <Copy className="h-5 w-5" strokeWidth={2} />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {/* Pattern */}
          <div className="mt-6" role="radiogroup" aria-labelledby="pattern-label">
            <span id="pattern-label" className="label mb-2 block">
              Pattern
            </span>
            <div className="flex flex-wrap gap-2">
              {patternOptions.map(({ name, icon: Icon, label }) => (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={selectedPattern === name}
                  onClick={() => setSelectedPattern(name)}
                  className={`${chipBase} ${selectedPattern === name ? chipOn : chipOff}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Size and ink */}
          <div className="mt-6 grid gap-6">
            <div role="radiogroup" aria-labelledby="size-label">
              <span id="size-label" className="label mb-2 block">
                Size
              </span>
              <div className="flex gap-2">
                {(["sm", "md", "lg"] as QRSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    role="radio"
                    aria-checked={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                    className={`${chipBase} min-w-12 ${selectedSize === size ? chipOn : chipOff}`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div role="radiogroup" aria-labelledby="ink-label">
              <span id="ink-label" className="label mb-2 block">
                Ink <span className="font-medium text-ink-soft">{selectedColor.name}</span>
              </span>
              <div className="flex flex-wrap gap-2.5">
                {colorPresets.map((color) => {
                  const on = selectedColor.name === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-label={color.name}
                      title={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`grid h-11 w-11 place-items-center rounded-full transition-transform duration-200 active:scale-90 ${
                        on ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "hover:scale-105"
                      }`}
                    >
                      <span
                        className="h-8 w-8 rounded-full border border-ink/25"
                        style={{ backgroundColor: color.fg }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Generate */}
          <motion.button
            type="button"
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98, y: 0 }}
            onClick={handleGenerate}
            disabled={!inputValue.trim()}
            className="mt-7 flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-coral text-base font-bold text-[#15123a] shadow-[0_14px_28px_-14px_rgb(255_92_71/0.9)] transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
          >
            Generate QR code
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </motion.button>
        </motion.div>
      </section>

      {/* Print sheet */}
      <motion.aside
        ref={stageRef}
        aria-label="QR code preview"
        initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: 2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        className="relative mx-auto w-full max-w-md max-lg:pr-4 max-lg:pb-3 lg:sticky lg:top-8 lg:max-w-none"
      >
        <div
          aria-hidden
          className="absolute inset-0 translate-x-3 translate-y-3 rotate-[2.5deg] rounded-3xl bg-coral"
        />
        <div className="relative rounded-3xl bg-paper p-8 sm:p-12">
          <span className="crop crop-tl" aria-hidden />
          <span className="crop crop-tr" aria-hidden />
          <span className="crop crop-bl" aria-hidden />
          <span className="crop crop-br" aria-hidden />

          <div className="mx-auto grid aspect-square w-full max-w-[320px] place-items-center overflow-hidden rounded-2xl p-4" style={{ backgroundColor: selectedColor.bg }}>
            {qrImageUrl && (
              <div className="relative">
                {/* client-generated data: URI, next/image optimization doesn't apply here */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageUrl}
                  alt={hasResult ? "Generated QR code" : "Sample QR code preview"}
                  width={sizeMap[selectedSize]}
                  height={sizeMap[selectedSize]}
                  className={`block h-auto max-w-full transition-opacity duration-300 ${hasResult ? "" : "opacity-40"}`}
                />
                {!reduceMotion && hasResult && (
                  <motion.span
                    key={pass}
                    aria-hidden
                    initial={{ top: "-3%", opacity: 1 }}
                    animate={{ top: "103%", opacity: [1, 1, 0] }}
                    transition={{ duration: 0.75, ease: "easeInOut" }}
                    className="pointer-events-none absolute left-0 right-0 h-1 rounded-full bg-coral"
                  />
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <p
              className="max-w-full truncate text-center text-sm text-ink-soft"
              title={hasResult ? qrValue : undefined}
            >
              {hasResult ? qrValue : "Sample preview. Yours appears here."}
            </p>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!hasResult}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-ink px-6 text-base font-bold text-paper transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Download className="h-5 w-5" strokeWidth={2.5} aria-hidden />
              Download PNG
            </button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
