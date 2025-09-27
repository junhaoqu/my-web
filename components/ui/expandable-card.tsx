"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import GlassSurface from "../GlassSurface";

interface CardData {
  description: string;
  title: string;
  src: string;
  expandedSrc?: string;
  ctaText?: string;
  ctaLink?: string;
  content?: () => React.ReactNode;
}

export function ExpandableCard({ card, active, setActive, isDark }: { card: CardData, active: CardData | null, setActive: (card: CardData | null) => void, isDark: boolean }) {
  const id = useId();

  return (
    <motion.div
      layoutId={`card-${card.title}-${id}`}
      key={`card-${card.title}-${id}`}
      onClick={() => setActive(card)}
      className="cursor-target p-4 flex flex-col md:flex-row justify-between items-center rounded-xl cursor-pointer"
    >
      <div className="flex gap-4 flex-col md:flex-row items-center">
        <motion.div layoutId={`image-${card.title}-${id}`}>
          <img
            width={100}
            height={100}
            src={card.src}
            alt={card.title}
            className="h-14 w-14 rounded-lg object-cover object-top"
          />
        </motion.div>
        <div>
          <motion.h3
            layoutId={`title-${card.title}-${id}`}
            className={`font-medium text-center md:text-left ${isDark ? 'text-white' : 'text-neutral-800'}`}
          >
            {card.title}
          </motion.h3>
          <motion.p
            layoutId={`description-${card.description}-${id}`}
            className={`text-center md:text-left ${isDark ? 'text-gray-300' : 'text-neutral-600'}`}
          >
            {card.description}
          </motion.p>
        </div>
      </div>
      <div
        className="mt-4 md:mt-0"
      >
        <GlassSurface
          width={40}
          height={40}
          borderRadius={20}
          style={{
            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <span className={isDark ? "text-white" : "text-black"}>→</span>
        </GlassSurface>
      </div>
    </motion.div>
  );
}

export function ExpandedCardModal({ active, setActive, isDark }: { active: CardData | null, setActive: (card: CardData | null) => void, isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = contentRef.current;
    const thumb = thumbRef.current;
    if (!el) return;
    const container = el as HTMLDivElement;

    function updateThumb() {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const ratio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(16, Math.floor(clientHeight * ratio));
      const maxTop = clientHeight - thumbHeight;
      const top = scrollHeight === clientHeight ? 0 : Math.min(maxTop, Math.floor((scrollTop / (scrollHeight - clientHeight)) * maxTop));
      if (thumb) {
        thumb.style.height = thumbHeight + 'px';
        thumb.style.transform = `translateY(${top}px)`;
      }
    }

    updateThumb();
    container.addEventListener('scroll', updateThumb, { passive: true });
    window.addEventListener('resize', updateThumb);
    return () => {
      container.removeEventListener('scroll', updateThumb);
      window.removeEventListener('resize', updateThumb);
    };
  }, [active]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, setActive]);

  useOutsideClick(ref, () => setActive(null));

  if (!active) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 h-full w-full z-10"
      />
      <div className="fixed inset-0 grid place-items-center z-[100]">
        <motion.button
          key={`button-${active.title}-${id}`}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.05 } }}
          className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
          onClick={() => setActive(null)}
        >
          <CloseIcon />
        </motion.button>
        <motion.div
          layoutId={`card-${active.title}-${id}`}
          ref={ref}
          className={`w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col sm:rounded-3xl overflow-hidden ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
        >
            <motion.div layoutId={`image-${active.title}-${id}`}>
            <img
              width={200}
              height={200}
              src={active.expandedSrc ?? active.src}
              alt={active.title}
              className="w-full h-48 lg:h-56 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
            />
          </motion.div>
          <div>
            <div className="flex justify-between items-start p-4">
              <div>
                {/* Header intentionally omitted in expanded modal — details contain the necessary info */}
              </div>
              {/* Visit link removed per request */}
            </div>
            <div className="pt-4 relative px-4">
              <div className="relative">
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  ref={contentRef}
                    className={`text-lg md:text-xl lg:text-2xl h-[200px] md:h-[300px] pb-10 flex flex-col items-start gap-4 overflow-auto pr-4 ${isDark ? 'text-gray-300' : 'text-neutral-600'} [-webkit-overflow-scrolling:touch]`}
                >
                  {typeof active.content === "function" ? active.content() : active.content}
                </motion.div>

                {/* custom scrollbar */}
                <div aria-hidden className="absolute top-0 right-0 h-full w-3 flex items-start">
                  <div
                    ref={thumbRef}
                    className="absolute right-0 w-1.5 rounded-sm transition-transform"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
