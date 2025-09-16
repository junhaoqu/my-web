"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BaseWindow from "./BaseWindow";
import { WindowState } from "../types";

interface TerminalWindowProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

const TerminalWindow: React.FC<TerminalWindowProps> = (props) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentLine, setCurrentLine] = useState(1);

  // Mac组件的实际代码
  const macComponentCode = `"use client";
import { animate } from 'animejs';
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import MacScreen from "@/components/MacScreen/MacScreen";

export interface MacbookRef {
  updateAnimation: (progress: number) => void;
}

const MacbookScroll = forwardRef<MacbookRef>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const [animationProgress, setAnimationProgress] = React.useState(0);

  useImperativeHandle(ref, () => ({
    updateAnimation: (progress: number) => {
      const clampedProgress = Math.max(0, Math.min(1, progress));
      setAnimationProgress(clampedProgress);
      
      // 动画屏幕打开
      animate('.mac-animated-screen', {
        rotateX: -70 + clampedProgress * 70, // 从-70度到0度
        duration: 200,
        easing: 'easeOutQuad'
      });
    }
  }));

  useEffect(() => {
    // 初始化屏幕状态
    animate('.mac-animated-screen', {
      rotateX: -70,
      duration: 0
    });
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="macbook-container relative transform-gpu [perspective:800px] cursor-pointer"
      style={{ 
        width: '32rem',
        height: '44rem',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 发光底层 */}
      <div 
        className="absolute rounded-2xl opacity-40 blur-xl animate-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.7), rgba(59, 130, 246, 0.5), rgba(168, 85, 247, 0.3), transparent)',
          width: '32rem',
          height: '44rem', 
          top: '100%',
          left: '50%',
          transform: 'translate(-50%, -80%) translateZ(-50px) scale(1.1)',
          zIndex: -1
        }}
      ></div>
      
      <div 
        ref={baseRef}
        className="macbook-base absolute bottom-0 left-1/2 -translate-x-1/2 rounded-2xl"
        style={{ 
          width: '32rem',
          height: '22rem',
          backgroundColor: 'var(--device-background)',
          color: 'var(--device-foreground)',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}
      >
        {/* Keyboard and components */}
        <Trackpad />
        
        {/* Lid and Screen */}
        <div
          ref={lidRef}
          className="macbook-lid absolute left-1/2 -translate-x-1/2 rounded-t-2xl bg-transparent p-2"
          style={{
            transformOrigin: 'bottom center',
            transformStyle: 'preserve-3d',
            top: '-22rem',
            width: '32rem',
            height: '22rem',
            zIndex: 10
          }}
        >
          <motion.div
            className="mac-animated-screen absolute inset-0 h-full w-full rounded-2xl bg-[#010101] p-[2%] overflow-hidden"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "bottom",
            }}
          >
            <div className="absolute inset-0 rounded-lg bg-[#272729]" />
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <MacScreen animationProgress={animationProgress} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

export default MacbookScroll;`;

  const vimHeader = `vim ~/projects/my-web/app/mac.tsx

"mac.tsx" 120L, 3247C                                          1,1           All`;

  const fullText = vimHeader + "\n\n" + macComponentCode;

  useEffect(() => {
    // 立即开始动画，不需要等待窗口打开
    const timer = setInterval(() => {
      if (displayedText.length < fullText.length) {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
        
        // 更新当前行数
        const lines = displayedText.split('\n');
        setCurrentLine(lines.length);
      }
    }, 20); // 更快的打字速度

    return () => clearInterval(timer);
  }, [displayedText, fullText]);

  return (
    <div className="absolute inset-0 w-full h-full font-mono">
      <div className="h-full bg-black text-green-400 p-4 overflow-auto text-xs leading-relaxed">
        {/* Vim 界面 */}
        <div className="h-full flex flex-col">
          {/* 代码内容区域 */}
          <div className="flex-1 overflow-auto">
            <div className="flex">
              {/* 行号 */}
              <div className="w-8 text-right pr-2 text-gray-600 select-none">
                {displayedText.split('\n').map((_, i) => (
                  <div key={i + 1} className="leading-relaxed">
                    {i + 1}
                  </div>
                ))}
              </div>
              
              {/* 代码内容 */}
              <div className="flex-1">
                <pre className="whitespace-pre-wrap text-green-400 leading-relaxed">
                  <span className="text-blue-400">{vimHeader}</span>
                  {displayedText.slice(vimHeader.length) && (
                    <>
                      <br /><br />
                      <span>{displayedText.slice(vimHeader.length + 2)}</span>
                    </>
                  )}
                  <motion.span
                    className="bg-green-400 w-2 h-4 inline-block"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </pre>
              </div>
            </div>
          </div>

          {/* Vim 状态栏 */}
          <div className="h-6 bg-gray-800 text-white text-xs flex items-center justify-between px-2 mt-2">
            <div className="flex items-center space-x-4">
              <span className="bg-gray-700 px-2 py-1 rounded">NORMAL</span>
              <span>mac.tsx</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>typescript</span>
              <span>utf-8</span>
              <span>{currentLine},{displayedText.length - displayedText.lastIndexOf('\n')}</span>
              <span>{Math.round((displayedText.length / fullText.length) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalWindow;
