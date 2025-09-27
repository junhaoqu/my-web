"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import GlassSurface from "../GlassSurface";

interface CardData {
  description: string;
  title: string;
  src: string;
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
      <motion.div
        layoutId={`button-${card.title}-${id}`}
        className="mt-4 md:mt-0"
        whileHover={{ scale: 1.1 }}
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
      </motion.div>
    </motion.div>
  );
}

export function ExpandedCardModal({ active, setActive, isDark }: { active: CardData | null, setActive: (card: CardData | null) => void, isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

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
              src={active.src}
              alt={active.title}
              className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
            />
          </motion.div>
          <div>
            <div className="flex justify-between items-start p-4">
              <div>
                <motion.h3
                  layoutId={`title-${active.title}-${id}`}
                  className={`font-bold ${isDark ? 'text-white' : 'text-neutral-700'}`}
                >
                  {active.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${active.description}-${id}`}
                  className={`${isDark ? 'text-gray-300' : 'text-neutral-600'}`}
                >
                  {active.description}
                </motion.p>
              </div>
              <motion.a
                layoutId={`button-${active.title}-${id}`}
                href={active.ctaLink}
                target="_blank"
                className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
              >
                {active.ctaText || "Visit"}
              </motion.a>
            </div>
            <div className="pt-4 relative px-4">
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto ${isDark ? 'text-gray-300' : 'text-neutral-600'} [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"`}
              >
                {typeof active.content === "function" ? active.content() : active.content}
              </motion.div>
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
