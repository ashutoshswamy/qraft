"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import QRCode from "@cheprasov/qrcode";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Link,
  Download,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  QrCode,
  Palette,
  Maximize2,
  Grid3X3,
  Circle,
  Square,
  Hexagon,
  Globe,
} from "lucide-react";
import { GithubLogo, LinkedinLogo, XLogo } from "./BrandIcons";

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

export default function QRGenerator() {
  const [inputValue, setInputValue] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedSize, setSelectedSize] = useState<QRSize>("md");
  const [selectedColor, setSelectedColor] = useState(colorPresets[0]);
  const [selectedPattern, setSelectedPattern] = useState<QRPattern>("rounded");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showPatternPicker, setShowPatternPicker] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const qrImageUrl = useMemo(() => {
    if (!qrValue) return "";
    return generateQRWithPattern(
      qrValue,
      sizeMap[selectedSize] * 2,
      selectedPattern,
      selectedColor.fg,
      selectedColor.bg
    );
  }, [qrValue, selectedSize, selectedPattern, selectedColor]);

  const handleGenerate = useCallback(() => {
    if (inputValue.trim()) {
      setQrValue(inputValue.trim());
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  const handleDownload = useCallback(() => {
    if (!qrImageUrl) return;
    
    const link = document.createElement("a");
    link.download = `qraft-qrcode.png`;
    link.href = qrImageUrl;
    link.click();
  }, [qrImageUrl]);

  const handleCopy = useCallback(() => {
    if (inputValue) {
      navigator.clipboard.writeText(inputValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [inputValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto px-2 sm:px-0"
    >
      <div className="bg-panel border border-line rounded-[20px] p-5 sm:p-8 md:p-10 shadow-[0_1px_2px_rgba(23,22,15,0.04),0_16px_40px_rgba(23,22,15,0.06)]">
        {/* Masthead */}
        <div className="flex items-center mb-8 sm:mb-10 pb-5 border-b border-line">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-ink" aria-hidden />
            <span className="font-sans font-extrabold text-base sm:text-lg tracking-tight">
              QRAFT
            </span>
          </div>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 sm:mb-10"
        >
          <h1 className="font-sans font-extrabold text-[1.75rem] sm:text-4xl leading-[1.08] tracking-tight mb-2">
            Encode anything into
            <br />a scannable mark.
          </h1>
          <p className="text-ink-soft text-sm sm:text-base">
            Paste a link or text, choose a shape, generate.
          </p>
        </motion.div>

        {/* Source input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-5 sm:mb-6"
        >
          <label htmlFor="qr-source" className="label block mb-2">
            Source
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-ink-soft">
              <Link className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              id="qr-source"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ashutoshswamy.in"
              className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-10 sm:pr-12 rounded-lg bg-paper border border-line font-mono lowercase tracking-widest text-xs sm:text-sm text-ink placeholder:text-ink-soft focus:border-ink/40 focus:ring-4 focus:ring-ink/[0.04] transition-all duration-200"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink transition-colors"
              title="Copy to clipboard"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="w-5 h-5 text-signal" />
                  </motion.div>
                ) : (
                  <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>

        {/* Field table: size / pattern / color */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 border border-line rounded-lg overflow-visible mb-6 sm:mb-8 divide-y sm:divide-y-0 sm:divide-x divide-line"
        >
          {/* Size */}
          <div className="p-3 sm:p-3.5">
            <span className="label flex items-center gap-1.5 mb-2.5">
              <Maximize2 className="w-3 h-3" />
              Size
            </span>
            <div className="flex gap-1">
              {(["sm", "md", "lg"] as QRSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    selectedSize === size
                      ? "bg-ink text-paper"
                      : "text-ink-soft hover:text-ink hover:bg-paper"
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div className="p-3 sm:p-3.5 relative">
            <span className="label flex items-center gap-1.5 mb-2.5">
              <Grid3X3 className="w-3 h-3" />
              Pattern
            </span>
            <button
              onClick={() => {
                setShowPatternPicker(!showPatternPicker);
                setShowColorPicker(false);
              }}
              className="flex items-center justify-between w-full gap-2 px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-medium text-ink hover:bg-paper transition-colors duration-200 capitalize"
            >
              {selectedPattern}
            </button>

            <AnimatePresence>
              {showPatternPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-3 right-3 sm:left-0 sm:right-0 mt-1 p-1.5 rounded-lg bg-panel border border-line shadow-lg z-20"
                >
                  <div className="flex flex-col gap-0.5">
                    {patternOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.name}
                          onClick={() => {
                            setSelectedPattern(option.name);
                            setShowPatternPicker(false);
                          }}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors duration-200 ${
                            selectedPattern === option.name
                              ? "bg-laser-soft text-laser"
                              : "hover:bg-paper text-ink"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-xs sm:text-sm font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Color */}
          <div className="p-3 sm:p-3.5 relative">
            <span className="label flex items-center gap-1.5 mb-2.5">
              <Palette className="w-3 h-3" />
              Color
            </span>
            <button
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowPatternPicker(false);
              }}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-medium text-ink hover:bg-paper transition-colors duration-200"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-line"
                style={{ backgroundColor: selectedColor.fg }}
              />
              {selectedColor.name}
            </button>

            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-3 right-3 sm:left-auto sm:right-0 mt-1 p-3 rounded-lg bg-panel border border-line shadow-lg z-20 sm:min-w-[190px]"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {colorPresets.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color);
                          setShowColorPicker(false);
                        }}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-md transition-colors duration-200 ${
                          selectedColor.name === color.name
                            ? "bg-laser-soft ring-1 ring-laser/40"
                            : "hover:bg-paper"
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-full border border-line"
                          style={{ backgroundColor: color.fg }}
                        />
                        <span className="text-[10px] text-ink-soft font-medium whitespace-nowrap">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Generate */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98, y: 0 }}
          onClick={handleGenerate}
          disabled={!inputValue.trim()}
          className="w-full h-12 sm:h-14 rounded-lg bg-ink text-paper text-sm sm:text-base font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-[background-color,box-shadow] duration-200 hover:bg-ink/90 shadow-[0_1px_2px_rgba(23,22,15,0.08),0_8px_20px_rgba(23,22,15,0.14)]"
        >
          Generate QR code
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Result */}
        <AnimatePresence>
          {qrImageUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-line"
            >
              <div className="flex flex-col items-center">
                <div className="viewfinder p-5 sm:p-6 bg-paper border border-line rounded-lg shadow-[0_1px_2px_rgba(23,22,15,0.04),0_12px_28px_rgba(23,22,15,0.05)]">
                  <span className="vf-tr" />
                  <span className="vf-bl" />
                  <div ref={qrRef} className="relative overflow-hidden rounded-sm">
                    {/* client-generated data: URI — next/image optimization doesn't apply here */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrImageUrl}
                      alt="Generated QR code"
                      width={sizeMap[selectedSize]}
                      height={sizeMap[selectedSize]}
                      className="block"
                    />
                    {!reduceMotion && (
                      <motion.div
                        key={qrImageUrl}
                        initial={{ top: "-4%" }}
                        animate={{ top: "104%" }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-[3px] bg-laser shadow-[0_0_10px_var(--laser)] pointer-events-none"
                      />
                    )}
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="mt-5 sm:mt-6 flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-line text-sm sm:text-base text-ink hover:bg-paper transition-colors duration-200"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download PNG
                </button>

                <p className="font-mono lowercase tracking-widest text-[0.6875rem] text-ink-soft mt-4 max-w-[220px] sm:max-w-xs text-center truncate">
                  {qrValue}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Colophon */}
        <div className="mt-8 sm:mt-10 pt-5 border-t border-line flex items-center justify-between">
          <span className="label">Built by Ashutosh Swamy</span>
          <div className="flex items-center gap-1">
            <a
              href="https://github.com/ashutoshswamy"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-md text-ink-soft hover:text-ink hover:bg-paper transition-colors duration-200"
              title="GitHub"
            >
              <GithubLogo className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </a>
            <a
              href="https://linkedin.com/in/ashutoshswamy"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-md text-ink-soft hover:text-ink hover:bg-paper transition-colors duration-200"
              title="LinkedIn"
            >
              <LinkedinLogo className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </a>
            <a
              href="https://x.com/ashutoshswamy_"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-md text-ink-soft hover:text-ink hover:bg-paper transition-colors duration-200"
              title="X"
            >
              <XLogo className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </a>
            <a
              href="https://ashutoshswamy.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-md text-ink-soft hover:text-ink hover:bg-paper transition-colors duration-200"
              title="Portfolio"
            >
              <Globe className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
