"use client";

import { Toaster } from "sileo";
import { useResolvedTheme } from "./theme";

export default function AppToaster() {
  const theme = useResolvedTheme();
  return <Toaster position="top-center" offset={{ top: 16 }} theme={theme} />;
}
