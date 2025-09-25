"use client";

import { CSSProperties } from "react";
import { motion } from "motion/react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { cn } from "@/lib/utils";

const baseClass = "text-xl font-bold tracking-tight drop-shadow-lg md:text-xl";

interface LayoutTextFlipDemoProps {
  isDark: boolean;
}

export function LayoutTextFlipDemo({ isDark }: LayoutTextFlipDemoProps) {
  const colorStyle: CSSProperties = {
    color: isDark ? "#ffffff" : "#111827",
  };

  return (
    <motion.div
      className={cn("pointer-events-none flex items-center gap-3 whitespace-nowrap text-left", baseClass)}
      style={colorStyle}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <span className={baseClass} style={colorStyle}>
        Beyond the logical world of code, I use
      </span>
      <LayoutTextFlip
        text=""
        words={["brush", "color"]}
        duration={2600}
      />
      <span className={baseClass} style={colorStyle}>
        to construct landscapes of emotion.
      </span>
    </motion.div>
  );
}
