"use client";
import { animate } from "animejs";
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { motion } from "framer-motion";

export interface IpadRef {
  updateAnimation: (progress: number) => void;
}

const IpadScroll = forwardRef<IpadRef>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    updateAnimation: (progress: number) => {
      const clampedProgress = Math.max(0, Math.min(1, progress));
      
      // 动画屏幕 - 从微微关闭到完全打开
      animate(".ipad-animated-screen", {
        rotateX: -15 + clampedProgress * 15, // 从-15度到0度（iPad稍微不那么关闭）
        duration: 200,
        easing: "easeOutQuad",
      });
    }
  }));

  useEffect(() => {
    // 初始化屏幕状态为微微关闭
    animate('.ipad-animated-screen', {
      rotateX: -15, // 改为-15度，微微关闭状态
      duration: 0
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="ipad-container relative transform-gpu [perspective:800px] cursor-pointer w-full h-full"
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: 'center center'
      }}
    >
      {/* 发光底层 */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-45 blur-xl animate-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.7), rgba(59, 130, 246, 0.5), rgba(168, 85, 247, 0.3), transparent)',
          transform: 'translateZ(-50px) scale(1.25)',
          zIndex: -1
        }}
      ></div>
      
      <div
        className="ipad-base absolute top-0 left-0 rounded-2xl bg-gray-200 dark:bg-[#272729] will-change-transform [transform-style:preserve-3d]"
        style={{ 
          width: '20rem', // 恢复固定尺寸
          height: '28rem' // 恢复固定尺寸
        }}
      >
        {/* Screen */}
        <motion.div
          className="ipad-animated-screen absolute inset-0 h-full w-full rounded-2xl bg-[#010101] p-[2%]"
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
  );
});

IpadScroll.displayName = 'IpadScroll';

export default IpadScroll;