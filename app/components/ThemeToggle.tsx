"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { setThemePref, useResolvedTheme, useThemePref, type ThemePref } from "./theme";

const options: { value: ThemePref; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function ThemeToggle() {
  const pref = useThemePref();
  const resolved = useResolvedTheme();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const TriggerIcon = resolved === "dark" ? Moon : Sun;

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  // Close on outside pointer press.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Move focus to the active option when the menu opens.
  useEffect(() => {
    if (!open) return;
    const i = Math.max(0, options.findIndex((o) => o.value === pref));
    itemRefs.current[i]?.focus();
  }, [open, pref]);

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const idx = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label="Theme"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-on-ground/35 pl-3.5 pr-3 text-sm font-semibold text-on-ground transition-colors duration-200 hover:bg-on-ground/12 active:scale-[0.98]"
      >
        <TriggerIcon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
        <span className="hidden sm:inline">Theme</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Theme"
            onKeyDown={onMenuKeyDown}
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-full z-40 mt-2 w-44 rounded-2xl border border-line bg-paper p-1.5 text-ink shadow-[0_20px_40px_-12px_rgb(8_6_60/0.5)]"
          >
            {options.map((o, i) => {
              const Icon = o.icon;
              const active = pref === o.value;
              return (
                <button
                  key={o.value}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setThemePref(o.value);
                    close();
                  }}
                  className={`flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-sm font-semibold transition-colors duration-150 ${
                    active ? "bg-accent text-accent-text" : "hover:bg-ink/8"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                  <span className="flex-1 text-left">{o.label}</span>
                  {active && <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
