"use client";
import { motion } from "framer-motion";

interface NavigationBarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const sections = ["work", "project", "connect"];

export function NavigationBar({ activeSection, onNavigate }: NavigationBarProps) {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="mt-4 flex items-center gap-4 rounded-full bg-white/10 p-2 backdrop-blur-md">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => onNavigate(section)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeSection === section ? "text-white" : "text-gray-400"
            }`}
          >
            {activeSection === section && (
              <motion.div
                layoutId="active-section"
                className="absolute inset-0 rounded-full bg-white/20"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{section}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
