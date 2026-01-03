"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link,
  Download,
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
  Github,
  Linkedin,
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
  const QRCode = require("@cheprasov/qrcode");
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
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedSize, setSelectedSize] = useState<QRSize>("md");
  const [selectedColor, setSelectedColor] = useState(colorPresets[0]);
  const [selectedPattern, setSelectedPattern] = useState<QRPattern>("rounded");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showPatternPicker, setShowPatternPicker] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const generateQR = useCallback(() => {
    if (!qrValue) return;
    
    const url = generateQRWithPattern(
      qrValue,
      sizeMap[selectedSize] * 2,
      selectedPattern,
      selectedColor.fg,
      selectedColor.bg
    );
    setQrImageUrl(url);
  }, [qrValue, selectedSize, selectedPattern, selectedColor]);

  useEffect(() => {
    if (qrValue) {
      generateQR();
    }
  }, [qrValue, selectedSize, selectedPattern, selectedColor, generateQR]);

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg mx-auto px-2 sm:px-0"
    >
      <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 gradient-border">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-secondary mb-3 sm:mb-4 shadow-lg">
            <QrCode className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Qraft
          </h1>
          <p className="text-xs sm:text-sm text-muted px-2">
            Generate beautiful QR codes with custom patterns
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 sm:mb-6"
        >
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted">
              <Link className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter URL or text..."
              className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-10 sm:pr-12 rounded-xl sm:rounded-2xl bg-white/80 border border-border text-sm sm:text-base text-foreground placeholder:text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-sm"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              title="Copy to clipboard"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="w-5 h-5 text-emerald-500" />
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

        {/* Options Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6"
        >
          {/* Size Selector */}
          <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-lg sm:rounded-xl bg-white/80 border border-border shadow-sm">
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted ml-1.5 sm:ml-2" />
            {(["sm", "md", "lg"] as QRSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  selectedSize === size
                    ? "bg-primary text-white shadow-md"
                    : "text-muted hover:text-foreground hover:bg-gray-100"
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Pattern Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPatternPicker(!showPatternPicker);
                setShowColorPicker(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/80 border border-border text-muted hover:text-foreground transition-all duration-300 shadow-sm"
            >
              <Grid3X3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium capitalize hidden sm:inline">{selectedPattern}</span>
            </button>

            <AnimatePresence>
              {showPatternPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 sm:left-0 right-auto mt-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-border shadow-xl z-20 min-w-[150px] sm:min-w-[180px]"
                >
                  <div className="flex flex-col gap-1">
                    {patternOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.name}
                          onClick={() => {
                            setSelectedPattern(option.name);
                            setShowPatternPicker(false);
                          }}
                          className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 ${
                            selectedPattern === option.name
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-gray-100 text-foreground"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Color Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowPatternPicker(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/80 border border-border text-muted hover:text-foreground transition-all duration-300 shadow-sm"
            >
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: selectedColor.fg }}
              />
            </button>

            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-border shadow-xl z-20 min-w-[160px] sm:min-w-[200px]"
                >
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {colorPresets.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color);
                          setShowColorPicker(false);
                        }}
                        className={`flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 ${
                          selectedColor.name === color.name
                            ? "bg-primary/10 ring-2 ring-primary/30"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border-2 border-white shadow-md"
                          style={{ backgroundColor: color.fg }}
                        />
                        <span className="text-[10px] sm:text-xs text-muted font-medium whitespace-nowrap">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Generate Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={!inputValue.trim()}
          className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-primary-hover text-white text-sm sm:text-base font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 glow-primary shadow-lg"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          Generate QR Code
        </motion.button>

        {/* QR Code Display */}
        <AnimatePresence>
          {qrImageUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 sm:mt-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                {/* QR Code */}
                <div
                  ref={qrRef}
                  className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-2xl animate-float"
                >
                  <img
                    src={qrImageUrl}
                    alt="QR Code"
                    width={sizeMap[selectedSize]}
                    height={sizeMap[selectedSize]}
                    className="block"
                  />
                </div>

                {/* Download Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="mt-4 sm:mt-6 flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-border text-sm sm:text-base text-foreground hover:bg-gray-50 transition-all duration-300 shadow-md"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download PNG
                </motion.button>

                {/* URL Preview */}
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted max-w-[200px] sm:max-w-xs text-center truncate px-2">
                  {qrValue}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Developer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/50"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted">Built by Ashutosh Swamy</span>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/ashutoshswamy"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-gray-100 text-muted hover:text-foreground transition-all duration-300"
                title="GitHub"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://linkedin.com/in/ashutoshswamy"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-gray-100 text-muted hover:text-foreground transition-all duration-300"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
