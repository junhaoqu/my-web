"use client";
import { animate } from 'animejs';
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { scrollManager } from "./scrollManager";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 注册到统一的滚动管理器
    const macbookSection = {
      id: 'macbook',
      start: 0,      // 从页面开始
      end: 0.5,      // 到 50% 位置结束
      onProgress: (progress: number) => {
        // Stage 1: 0-25% 打开屏幕并变大
        // Stage 2: 25-50% 反向回到初始状态
        let animationProgress = 0;
        
        if (progress <= 0.5) {
          // Stage 1: 打开
          animationProgress = progress * 2; // 0 to 1
        } else {
          // Stage 2: 关闭
          animationProgress = (1 - progress) * 2; // 1 to 0
        }

        // 应用缓动函数
        const easedProgress = animationProgress < 0.5 
          ? 2 * animationProgress * animationProgress 
          : 1 - Math.pow(-2 * animationProgress + 2, 2) / 2;

        // 动画屏幕
        animate('.animated-screen', {
          rotateX: -70 + easedProgress * 70,
          duration: 200,
          easing: 'easeOutQuad'
        });

        // 缩放和移动容器
        if (containerRef.current) {
          const scale = 1 + easedProgress * 0.3;
          const translateY = easedProgress * 50;
          containerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }

        setProgress(progress);
      }
    };

    scrollManager.addSection(macbookSection);

    return () => {
      scrollManager.removeSection('macbook');
    };
  }, []);

  const handleClick = () => {
    // 手动控制动画进度
    const newProgress = progress === 0 ? 1 : 0;
    setProgress(newProgress);
    
    const easedProgress = newProgress < 0.5 
      ? 2 * newProgress * newProgress 
      : 1 - Math.pow(-2 * newProgress + 2, 2) / 2;

    animate('.animated-screen', {
      rotateX: -70 + easedProgress * 70,
      duration: 600,
      easing: 'easeOutQuad'
    });

    if (containerRef.current) {
      const scale = 1 + easedProgress * 0.3;
      const translateY = easedProgress * 50;
      containerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="macbook-container relative transform-gpu [perspective:800px] cursor-pointer"
      style={{ 
        transformStyle: 'preserve-3d',
      }}
      onClick={handleClick}
    >
      <div 
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
              transform: "rotateX(-70deg)"
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
  );
}

// Helper components
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

      {/* Additional keyboard rows... simplified for brevity */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
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
