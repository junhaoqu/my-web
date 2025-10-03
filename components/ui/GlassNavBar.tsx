"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { killAllGsap } from "@/lib/gsapUtils";

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "PROJ", href: "/project" },
  { label: "ART", href: "/art" },
  { label: "PHOTO", href: "/photo" },
];

const GlassNavBar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  const handleNavigate = (href: string) => {
    setIsNavOpen(false);
    
    // Attempt to clean up animations before the refresh, to prevent visual glitches.
    try {
      killAllGsap();
    } catch (e) {
      console.error("Failed to kill GSAP animations on navigation", e);
    }

    // Force a full page refresh to ensure a clean state.
    window.location.href = href;
  };

  // Close nav menu on outside click or escape key
  useEffect(() => {
    if (!isNavOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsNavOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isNavOpen]);

  return (
    <div 
      ref={navRef}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
    >
      <div className="relative flex items-center justify-center">
        {/* Main Navigation Button */}
        <div
          className="flex items-center justify-center"
          style={{
            height: '58px',
            width: '58px',
            borderRadius: '29px',
            backgroundColor: 'rgba(30, 30, 30, 0.75)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 10px 30px rgba(30, 64, 175, 0.35)",
          }}
        >
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={isNavOpen}
            aria-controls="glass-nav-menu"
            onClick={() => setIsNavOpen((prev) => !prev)}
            className="flex h-full w-full items-center justify-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
            style={{
              background: "transparent",
              color: "rgba(241, 245, 249, 0.95)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isNavOpen ? "rotate-90" : ""}`}
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation Menu Popup */}
        {isNavOpen && (
          <div
            id="glass-nav-menu"
            className="absolute bottom-[72px] left-1/2 z-50 flex -translate-x-1/2 flex-col items-stretch"
            style={{ pointerEvents: "auto" }}
          >
            <div
              className="overflow-hidden"
              style={{
                width: '240px',
                height: '108px',
                borderRadius: '18px',
                backgroundColor: 'rgba(30, 30, 30, 0.75)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 18px 45px rgba(30, 64, 175, 0.35)",
                padding: "12px",
              }}
            >
              <div className="grid grid-cols-4 gap-3">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    className="flex h-20 w-full items-center justify-center rounded-xl px-4 py-3 text-xs font-medium transition-transform duration-150 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "rgba(226, 232, 240, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 20px rgba(30, 64, 175, 0.2)",
                      fontFamily: "var(--font-audiowide)",
                      writingMode: "vertical-rl",
                      textOrientation: "upright",
                      letterSpacing: "-0.3em",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlassNavBar;
