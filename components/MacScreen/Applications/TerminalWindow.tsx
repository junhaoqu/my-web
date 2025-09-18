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
  
  export interface MacbookRef {
    updateAnimation: (progress: number) => void;
  }
  
  const MacbookScroll = forwardRef<MacbookRef>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lidRef = useRef<HTMLDivElement>(null);
    const baseRef = useRef<HTMLDivElement>(null);
    const [animationProgress, setAnimationProgress] = React.useState(0);
    const [pressedKeys, setPressedKeys] = React.useState<Set<string>>(new Set());
  
    useImperativeHandle(ref, () => ({
      updateAnimation: (progress: number) => {
        const clampedProgress = Math.max(0, Math.min(1, progress));
        setAnimationProgress(clampedProgress);
        
        // open screen
        animate('.mac-animated-screen', {
          rotateX: -70 + clampedProgress * 70, // 从-70度到0度
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    }));
  
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        setPressedKeys(prev => new Set(prev).add(event.code));
      };
  
      const handleKeyUp = (event: KeyboardEvent) => {
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(event.code);
          return newSet;
        });
      };
  
      // keyboard event listeners
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);
  
    useEffect(() => {
      //initialize screen state
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
          className="macbook-base absolute bottom-0 left-1/2 -translate-x-1/2 rounded-2xl will-change-transform [transform-style:preserve-3d]"
          style={{ 
            width: '32rem',  
            height: '22rem', 
            backgroundColor: 'var(--device-background)',
            color: 'var(--device-foreground)',
            transition: 'background-color 0.3s ease, color 0.3s ease'
          }}
        >
          {/* Keyboard layout */}
          <div className="relative h-[12%] w-full">
            <div className="absolute inset-x-0 mx-auto h-[60%] w-[80%] bg-[#050505]" />
          </div>
          <div className="relative flex h-[48%]">
            <div className="mx-auto h-full w-[10%] overflow-hidden"><SpeakerGrid /></div>
            <div className="mx-auto h-full w-[80%]"><Keypad pressedKeys={pressedKeys} /></div>
            <div className="mx-auto h-full w-[10%] overflow-hidden"><SpeakerGrid /></div>
          </div>
          <Trackpad />
          <div className="absolute inset-x-0 bottom-0 mx-auto h-[3%] w-[25%] rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
          
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
            {/* Screen that animates */}
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
  
  MacbookScroll.displayName = 'MacbookScroll';
  
  export default MacbookScroll;
  
  // ... Keep the rest of the components (Trackpad, Keypad, KBtn, etc.) as they are
  const Trackpad = () => {
    return (
      <div
        className="mx-auto my-[2%] h-[25%] w-[40%] rounded-xl"
        style={{
          boxShadow: "0px 0px 1px 1px #00000020 inset",
        }}
      ></div>
    );
  };
  
  
    // 彩虹颜色数组
    const rainbowColors = [
      '#ec4899', // 粉色
      '#8b5cf6', // 紫色  
      '#3b82f6', // 蓝色
      '#06b6d4', // 青色
      '#22c55e', // 绿色
    ];
  
    // 检查某个按键是否被按下
    const isKeyPressed = (keyId: string): boolean => {
      return Array.from(pressedKeys).some(code => keyMapping[code] === keyId);
    };
  
    // 获取按键的颜色（单键时蓝色，多键时彩虹色）
    const getKeyColor = (keyId: string): { color: string; isMultiKey: boolean } => {
      const pressedKeyIds = Array.from(pressedKeys).map(code => keyMapping[code]).filter(Boolean);
      const isPressed = pressedKeyIds.includes(keyId);
      
      if (!isPressed) {
        return { color: '', isMultiKey: false };
      }
      
      if (pressedKeyIds.length === 1) {
        return { color: '#3b82f6', isMultiKey: false };
      }
      
      const keyIndex = pressedKeyIds.indexOf(keyId);
      const colorIndex = keyIndex % rainbowColors.length;
      return { color: rainbowColors[colorIndex], isMultiKey: true };
    };
  
    const renderKBtn = (keyId: string, props?: any, children?: React.ReactNode) => {
      const keyColorData = getKeyColor(keyId);
      return (
        <KBtn 
          isPressed={isKeyPressed(keyId)}
          keyColor={keyColorData.color}
          isMultiKey={keyColorData.isMultiKey}
          {...props}
        >
          {children}
        </KBtn>
      );
    };
    return (
      <div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1 [will-change:transform]">
        {/* First Row */}
        <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
          {renderKBtn('esc', {
            className: "w-10 items-end justify-start pb-[2px] pl-[4px]",
            childrenClassName: "items-start"
          }, 'esc')}
          {renderKBtn('F1', {}, <>
            <IconBrightnessDown className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F1</span>
          </>)}
          {renderKBtn('F2', {}, <>
            <IconBrightnessUp className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F2</span>
          </>)}
          {renderKBtn('F3', {}, <>
            <IconTable className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F3</span>
          </>)}
          {renderKBtn('F4', {}, <>
            <IconSearch className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F4</span>
          </>)}
          {renderKBtn('F5', {}, <>
            <IconMicrophone className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F5</span>
          </>)}
          {renderKBtn('F6', {}, <>
            <IconMoon className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F6</span>
          </>)}
          {renderKBtn('F7', {}, <>
            <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F7</span>
          </>)}
          {renderKBtn('F8', {}, <>
            <IconPlayerSkipForward className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F8</span>
          </>)}
          {renderKBtn('F9', {}, <>
            <IconPlayerTrackNext className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F9</span>
          </>)}
          {renderKBtn('F10', {}, <>
            <IconVolume3 className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F10</span>
          </>)}
          {renderKBtn('F11', {}, <>
            <IconVolume2 className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F11</span>
          </>)}
          {renderKBtn('F12', {}, <>
            <IconVolume className="h-[6px] w-[6px]" />
            <span className="mt-1 inline-block">F12</span>
          </>)}
          <KBtn>
            <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
              <div className="h-full w-full rounded-full bg-black" />
            </div>
          </KBtn>
        </div>
  
  const KBtn = ({
    className,
    children,
    childrenClassName,
    backlit = true,
    isPressed = false,
    keyColor = '#3b82f6',
    isMultiKey = false,
    keyId,
    pressedKeys,
    keyMapping,
  }: {
    className?: string;
    children?: React.ReactNode;
    childrenClassName?: string;
    backlit?: boolean;
    isPressed?: boolean;
    keyColor?: string;
    isMultiKey?: boolean;
    keyId?: string;
    pressedKeys?: Set<string>;
    keyMapping?: Record<string, string>;
  }) => {
    let finalColor = keyColor;
    let finalIsMultiKey = isMultiKey;
    
    if (keyId && pressedKeys && keyMapping) {
      const rainbowColors = [
        '#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#22c55e'
      ];
      
      const pressedKeyIds = Array.from(pressedKeys).map(code => keyMapping[code]).filter(Boolean);
      const isKeyPressed = pressedKeyIds.includes(keyId);
      
      if (isKeyPressed) {
        if (pressedKeyIds.length === 1) {
          finalColor = '#3b82f6';
          finalIsMultiKey = false;
        } else {
          const keyIndex = pressedKeyIds.indexOf(keyId);
          const colorIndex = keyIndex % rainbowColors.length;
          finalColor = rainbowColors[colorIndex];
          finalIsMultiKey = true;
        }
      }
    }
`;

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
