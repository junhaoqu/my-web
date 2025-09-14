// app/ipad.tsx
"use client";
import { animate } from "animejs";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { scrollManager } from "./scrollManager";

export default function IpadScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 注册到统一的滚动管理器
    const ipadSection = {
      id: 'ipad',
      start: 0.4,    // 从 40% 位置开始
      end: 1.0,      // 到 100% 位置结束
      onProgress: (progress: number) => {
        // 应用缓动函数
        const easedProgress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // 动画屏幕
        animate(".ipad-screen", {
          rotateX: -70 + easedProgress * 70,
          duration: 200,
          easing: "easeOutQuad",
        });

        // 缩放和移动容器
        if (containerRef.current) {
          const scale = 1 + easedProgress * 0.4;
          const translateY = easedProgress * 120;
          containerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }
      }
    };

    scrollManager.addSection(ipadSection);

    return () => {
      scrollManager.removeSection('ipad');
    };
  }, []);

  return (
    <div className="relative min-h-[150vh] bg-white overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      <div className="scroll-section h-screen flex items-center justify-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-20">
          <h2 className="text-4xl font-bold text-black mb-4">
            This iPad is also built with Framer Motion & Anime.js
          </h2>
          <p className="text-xl text-gray-600">It animates together with the MacBook</p>
        </div>

        <div
          ref={containerRef}
          className="ipad-container relative transform-gpu [perspective:800px] cursor-pointer"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="ipad-base relative h-[28rem] w-[20rem] rounded-2xl bg-gray-200 dark:bg-[#272729] will-change-transform [transform-style:preserve-3d]"
          >
            {/* Screen */}
            <motion.div
              className="ipad-screen absolute inset-0 h-full w-full rounded-2xl bg-[#010101] p-2"
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

      {/* Second section for scroll continuation */}
      <div className="scroll-section h-[50vh] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Synchronized Animation</h3>
          <p className="text-gray-600">Both devices respond to the same scroll</p>
        </div>
      </div>
    </div>
  );
}