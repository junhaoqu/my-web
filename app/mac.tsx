"use client";
import { animate, createScope } from 'animejs';
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSearch,
  IconWorld,
  IconCommand,
  IconCaretLeftFilled,
  IconCaretDownFilled,
} from "@tabler/icons-react";

export default function MacbookScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!rootRef.current) return;

    scopeRef.current = createScope({ root: rootRef.current }).add((self: any) => {
      
      // Set initial transforms
      if (containerRef.current) {
        containerRef.current.style.transformStyle = 'preserve-3d';
      }
      
      if (lidRef.current) {
        // We don't animate the lid itself anymore, but the screen inside it
      }
      
      if (baseRef.current) {
        baseRef.current.style.transformOrigin = 'center center';
        baseRef.current.style.transformStyle = 'preserve-3d';
      }

      // Register animation methods
      self.add('updateMacBookAnimation', (newProgress: number) => {
        const clampedProgress = Math.max(0, Math.min(1, newProgress));
        
        // Animate the new screen panel - from closed to fully open with scroll down
        animate('.animated-screen', {
          rotateX: -70 + clampedProgress * 70, // From -70deg (closed) to 0deg (fully open)
          duration: 300, // Faster animation
          ease: 'outQuad'
        });
      });

      // Create scroll-triggered animation using anime.js
      // We'll handle this directly in the scroll listener for better control

    });

    // Initialize animation
    if (scopeRef.current?.methods?.updateMacBookAnimation) {
      scopeRef.current.methods.updateMacBookAnimation(0);
    }

    // Add scroll listener for automatic animation
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate overall progress (0 to 1)
      const overallProgress = Math.min(1, scrollTop / (windowHeight * 1.5));
      
      // Apply easing for smooth animation
      const easedProgress = overallProgress < 0.5 
        ? 2 * overallProgress * overallProgress 
        : 1 - Math.pow(-2 * overallProgress + 2, 2) / 2;
      
      // Animate the screen with anime.js
      animate('.animated-screen', {
        rotateX: -70 + easedProgress * 70, // From -70deg (closed) to 0deg (fully open)
        duration: 200, // Smooth animation duration
        easing: 'easeOutQuad'
      });
      
      // Also, scale and move the entire container
      if (containerRef.current) {
        const scale = 1 + easedProgress * 0.5; // Scale from 1 to 1.5
        const translateY = easedProgress * 150; // Move down by 150px at full progress
        containerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      }
      
      setProgress(overallProgress);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      scopeRef.current?.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    const newProgress = progress === 0 ? 1 : 0;
    setProgress(newProgress);
    if (scopeRef.current?.methods?.updateMacBookAnimation) {
      scopeRef.current.methods.updateMacBookAnimation(newProgress);
    }
  };

  return (
    <div ref={rootRef} className="relative min-h-[300vh] bg-white overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      {/* Scroll Section 1 - Initial state */}
      <div className="scroll-section h-screen flex items-center justify-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-20">
          <h2 className="text-4xl font-bold text-black mb-4">
            This MacBook is built with Framer Motion & Anime.js
          </h2>
          <p className="text-xl text-gray-600">Scroll down to open the screen</p>
        </div>

        <div 
          ref={containerRef} 
          className="macbook-container relative transform-gpu [perspective:800px] cursor-pointer"
          style={{ 
            transformStyle: 'preserve-3d',
          }}
          onClick={handleClick}
        >
          <div 
            ref={baseRef}
            className="macbook-base relative h-[22rem] w-[32rem] rounded-2xl bg-gray-200 dark:bg-[#272729] will-change-transform [transform-style:preserve-3d]"
          >
            {/* Keyboard layout */}
            <div className="relative h-10 w-full">
              <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
            </div>
            <div className="relative flex">
              <div className="mx-auto h-full w-[10%] overflow-hidden"><SpeakerGrid /></div>
              <div className="mx-auto h-full w-[80%]"><Keypad /></div>
              <div className="mx-auto h-full w-[10%] overflow-hidden"><SpeakerGrid /></div>
            </div>
            <Trackpad />
            <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
            
            {/* Lid and Screen */}
            <div
              ref={lidRef}
              className="macbook-lid absolute h-[22rem] w-[32rem] rounded-t-2xl bg-transparent p-2"
              style={{
                transformOrigin: 'bottom center',
                transformStyle: 'preserve-3d',
                top: '-21.9rem',
                left: '0',
                zIndex: 10
              }}
            >
              {/* This is the screen part that animates */}
              <motion.div
                className="animated-screen absolute inset-0 h-full w-full rounded-2xl bg-[#010101] p-2"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "bottom",
                }}
              >
                <div className="absolute inset-0 rounded-lg bg-[#272729]" />
                <img
                  src="/images/github.png"
                  alt="GitHub Profile"
                  className="absolute inset-0 h-full w-full rounded-lg object-cover object-left-top"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Section 2 - Animation trigger area */}
      <div className="scroll-section h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Keep scrolling...</h3>
          <p className="text-gray-600">The screen will open as you scroll</p>
        </div>
      </div>

      {/* Scroll Section 3 - Final state */}
      <div className="scroll-section h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Screen Fully Open!</h3>
          <p className="text-gray-600">Scroll back up to close it</p>
        </div>
      </div>
    </div>
  );
}

// ... Keep the rest of the components (Trackpad, Keypad, KBtn, etc.) as they are
const Trackpad = () => {
  return (
    <div
      className="mx-auto my-1 h-32 w-[40%] rounded-xl"
      style={{
        boxShadow: "0px 0px 1px 1px #00000020 inset",
      }}
    ></div>
  );
};

const Keypad = () => {
  return (
    <div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1 [will-change:transform]">
      {/* First Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn className="w-10 items-end justify-start pb-[2px] pl-[4px]" childrenClassName="items-start">
          esc
        </KBtn>
        <KBtn>
          <IconBrightnessDown className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F1</span>
        </KBtn>
        <KBtn>
          <IconBrightnessUp className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F2</span>
        </KBtn>
        <KBtn>
          <IconTable className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F3</span>
        </KBtn>
        <KBtn>
          <IconSearch className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F4</span>
        </KBtn>
        <KBtn>
          <IconMicrophone className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F5</span>
        </KBtn>
        <KBtn>
          <IconMoon className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F6</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F7</span>
        </KBtn>
        <KBtn>
          <IconPlayerSkipForward className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F8</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackNext className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F9</span>
        </KBtn>
        <KBtn>
          <IconVolume3 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F10</span>
        </KBtn>
        <KBtn>
          <IconVolume2 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F11</span>
        </KBtn>
        <KBtn>
          <IconVolume className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F12</span>
        </KBtn>
        <KBtn>
          <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
            <div className="h-full w-full rounded-full bg-black" />
          </div>
        </KBtn>
      </div>

      {/* Second row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn>
          <span className="block">~</span>
          <span className="mt-1 block">`</span>
        </KBtn>
        <KBtn>
          <span className="block">!</span>
          <span className="block">1</span>
        </KBtn>
        <KBtn>
          <span className="block">@</span>
          <span className="block">2</span>
        </KBtn>
        <KBtn>
          <span className="block">#</span>
          <span className="block">3</span>
        </KBtn>
        <KBtn>
          <span className="block">$</span>
          <span className="block">4</span>
        </KBtn>
        <KBtn>
          <span className="block">%</span>
          <span className="block">5</span>
        </KBtn>
        <KBtn>
          <span className="block">^</span>
          <span className="block">6</span>
        </KBtn>
        <KBtn>
          <span className="block">&</span>
          <span className="block">7</span>
        </KBtn>
        <KBtn>
          <span className="block">*</span>
          <span className="block">8</span>
        </KBtn>
        <KBtn>
          <span className="block">(</span>
          <span className="block">9</span>
        </KBtn>
        <KBtn>
          <span className="block">)</span>
          <span className="block">0</span>
        </KBtn>
        <KBtn>
          <span className="block">—</span>
          <span className="block">_</span>
        </KBtn>
        <KBtn>
          <span className="block">+</span>
          <span className="block"> = </span>
        </KBtn>
        <KBtn className="w-10 items-end justify-end pr-[4px] pb-[2px]" childrenClassName="items-end">
          delete
        </KBtn>
      </div>

      {/* Third row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn className="w-10 items-end justify-start pb-[2px] pl-[4px]" childrenClassName="items-start">
          tab
        </KBtn>
        <KBtn><span className="block">Q</span></KBtn>
        <KBtn><span className="block">W</span></KBtn>
        <KBtn><span className="block">E</span></KBtn>
        <KBtn><span className="block">R</span></KBtn>
        <KBtn><span className="block">T</span></KBtn>
        <KBtn><span className="block">Y</span></KBtn>
        <KBtn><span className="block">U</span></KBtn>
        <KBtn><span className="block">I</span></KBtn>
        <KBtn><span className="block">O</span></KBtn>
        <KBtn><span className="block">P</span></KBtn>
        <KBtn>
          <span className="block">&#123;</span>
          <span className="block">[</span>
        </KBtn>
        <KBtn>
          <span className="block">&#125;</span>
          <span className="block">]</span>
        </KBtn>
        <KBtn>
          <span className="block">|</span>
          <span className="block">\</span>
        </KBtn>
      </div>

      {/* Fourth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn className="w-[2.8rem] items-end justify-start pb-[2px] pl-[4px]" childrenClassName="items-start">
          caps lock
        </KBtn>
        <KBtn><span className="block">A</span></KBtn>
        <KBtn><span className="block">S</span></KBtn>
        <KBtn><span className="block">D</span></KBtn>
        <KBtn><span className="block">F</span></KBtn>
        <KBtn><span className="block">G</span></KBtn>
        <KBtn><span className="block">H</span></KBtn>
        <KBtn><span className="block">J</span></KBtn>
        <KBtn><span className="block">K</span></KBtn>
        <KBtn><span className="block">L</span></KBtn>
        <KBtn>
          <span className="block">:</span>
          <span className="block">;</span>
        </KBtn>
        <KBtn>
          <span className="block">"</span>
          <span className="block">'</span>
        </KBtn>
        <KBtn className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]" childrenClassName="items-end">
          return
        </KBtn>
      </div>

      {/* Fifth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn className="w-[3.65rem] items-end justify-start pb-[2px] pl-[4px]" childrenClassName="items-start">
          shift
        </KBtn>
        <KBtn><span className="block">Z</span></KBtn>
        <KBtn><span className="block">X</span></KBtn>
        <KBtn><span className="block">C</span></KBtn>
        <KBtn><span className="block">V</span></KBtn>
        <KBtn><span className="block">B</span></KBtn>
        <KBtn><span className="block">N</span></KBtn>
        <KBtn><span className="block">M</span></KBtn>
        <KBtn>
          <span className="block">&lt;</span>
          <span className="block">,</span>
        </KBtn>
        <KBtn>
          <span className="block">&gt;</span>
          <span className="block">.</span>
        </KBtn>
        <KBtn>
          <span className="block">?</span>
          <span className="block">/</span>
        </KBtn>
        <KBtn className="w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]" childrenClassName="items-end">
          shift
        </KBtn>
      </div>

      {/* Sixth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <span className="block">fn</span>
          </div>
          <div className="flex w-full justify-start pl-1">
            <IconWorld className="h-[6px] w-[6px]" />
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <IconChevronUp className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">control</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <OptionKey className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <KBtn className="w-8" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="w-[8.2rem]"></KBtn>
        <KBtn className="w-8" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-start pl-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-start pl-1">
            <OptionKey className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <div className="mt-[2px] flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-[4px] p-[0.5px]">
          <KBtn className="h-3 w-6">
            <IconCaretUpFilled className="h-[6px] w-[6px]" />
          </KBtn>
          <div className="flex">
            <KBtn className="h-3 w-6">
              <IconCaretLeftFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn className="h-3 w-6">
              <IconCaretDownFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn className="h-3 w-6">
              <IconCaretRightFilled className="h-[6px] w-[6px]" />
            </KBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

const KBtn = ({
  className,
  children,
  childrenClassName,
  backlit = true,
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  backlit?: boolean;
}) => {
  return (
    <div
      className={`[transform:translateZ(0)] rounded-[4px] p-[0.5px] [will-change:transform] ${backlit ? "bg-white/[0.2] shadow-xl shadow-white" : ""}`}
    >
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-[3.5px] bg-[#0A090D] ${className || ""}`}
        style={{
          boxShadow: "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
        }}
      >
        <div
          className={`flex w-full flex-col items-center justify-center text-[5px] text-neutral-200 ${childrenClassName || ""} ${backlit ? "text-white" : ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const SpeakerGrid = () => {
  return (
    <div
      className="mt-2 flex h-40 gap-[2px] px-[0.5px]"
      style={{
        backgroundImage: "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
        backgroundSize: "3px 3px",
      }}
    ></div>
  );
};

const OptionKey = ({ className }: { className: string }) => {
  return (
    <svg
      fill="none"
      version="1.1"
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <rect stroke="currentColor" strokeWidth={2} x="18" y="5" width="10" height="2" />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
      />
      <rect id="_Transparent_Rectangle_" className="st0" width="32" height="32" stroke="none" />
    </svg>
  );
};

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};
