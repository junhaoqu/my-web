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
      
      // 动画屏幕
      animate(".ipad-animated-screen", {
        rotateX: -70 + clampedProgress * 70,
        duration: 200,
        easing: "easeOutQuad",
      });
    }
  }));

  useEffect(() => {
    // 初始化屏幕状态
    animate('.ipad-animated-screen', {
      rotateX: -70,
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
      <div
        className="ipad-base absolute top-0 left-0 rounded-2xl bg-gray-200 dark:bg-[#272729] will-change-transform [transform-style:preserve-3d]"
        style={{ 
          width: '20rem', // 恢复原来的20rem
          height: '28rem' // 恢复原来的28rem
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