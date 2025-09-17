"use client";
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
      
      // 动画屏幕打开
      animate('.mac-animated-screen', {
        rotateX: -70 + clampedProgress * 70, // 从-70度到0度
        duration: 200,
        easing: 'easeOutQuad'
      });
    }
  }));

  // 键盘事件监听
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

    // 添加全局键盘事件监听
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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
        width: '32rem',  // 恢复固定宽度
        height: '44rem', // 恢复固定高度
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
        className="macbook-base absolute bottom-0 left-1/2 -translate-x-1/2 rounded-2xl will-change-transform [transform-style:preserve-3d]"
        style={{ 
          width: '32rem',  // 恢复固定宽度
          height: '22rem', // 恢复固定高度
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
            top: '-22rem', // 恢复原来的定位
            width: '32rem', // 恢复固定宽度
            height: '22rem', // 恢复固定高度
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

const Keypad = ({ pressedKeys }: { pressedKeys: Set<string> }) => {
  // 键盘映射：将键盘码映射到对应的按键标识
  const keyMapping: Record<string, string> = {
    // 第一行
    'Escape': 'esc',
    'F1': 'F1',
    'F2': 'F2',
    'F3': 'F3',
    'F4': 'F4',
    'F5': 'F5',
    'F6': 'F6',
    'F7': 'F7',
    'F8': 'F8',
    'F9': 'F9',
    'F10': 'F10',
    'F11': 'F11',
    'F12': 'F12',
    
    // 第二行
    'Backquote': '`',
    'Digit1': '1',
    'Digit2': '2',
    'Digit3': '3',
    'Digit4': '4',
    'Digit5': '5',
    'Digit6': '6',
    'Digit7': '7',
    'Digit8': '8',
    'Digit9': '9',
    'Digit0': '0',
    'Minus': '-',
    'Equal': '=',
    'Backspace': 'delete',
    
    // 第三行
    'Tab': 'tab',
    'KeyQ': 'q',
    'KeyW': 'w',
    'KeyE': 'e',
    'KeyR': 'r',
    'KeyT': 't',
    'KeyY': 'y',
    'KeyU': 'u',
    'KeyI': 'i',
    'KeyO': 'o',
    'KeyP': 'p',
    'BracketLeft': '[',
    'BracketRight': ']',
    'Backslash': '\\',
    
    // 第四行
    'CapsLock': 'capslock',
    'KeyA': 'a',
    'KeyS': 's',
    'KeyD': 'd',
    'KeyF': 'f',
    'KeyG': 'g',
    'KeyH': 'h',
    'KeyJ': 'j',
    'KeyK': 'k',
    'KeyL': 'l',
    'Semicolon': ';',
    'Quote': "'",
    'Enter': 'enter',
    
    // 第五行
    'ShiftLeft': 'shift',
    'ShiftRight': 'shift',
    'KeyZ': 'z',
    'KeyX': 'x',
    'KeyC': 'c',
    'KeyV': 'v',
    'KeyB': 'b',
    'KeyN': 'n',
    'KeyM': 'm',
    'Comma': ',',
    'Period': '.',
    'Slash': '/',
    
    // 第六行
    'Fn': 'fn',
    'ControlLeft': 'control',
    'AltLeft': 'alt',
    'MetaLeft': 'meta',
    'Space': ' ',
    'MetaRight': 'meta',
    'AltRight': 'alt',
    'ArrowUp': 'arrowup',
    'ArrowDown': 'arrowdown',
    'ArrowLeft': 'arrowleft',
    'ArrowRight': 'arrowright'
  };

  // 检查某个按键是否被按下
  const isKeyPressed = (keyId: string): boolean => {
    return Array.from(pressedKeys).some(code => keyMapping[code] === keyId);
  };
  return (
    <div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1 [will-change:transform]">
      {/* First Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
          isPressed={isKeyPressed('esc')}
        >
          esc
        </KBtn>
        <KBtn isPressed={isKeyPressed('F1')}>
          <IconBrightnessDown className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F1</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('F2')}>
          <IconBrightnessUp className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F2</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('F3')}>
          <IconTable className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F3</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('F4')}>
          <IconSearch className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F4</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('F5')}>
          <IconMicrophone className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F5</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('F6')}>
          <IconMoon className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F6</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('F7')}>
          <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F7</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('F8')}>
          <IconPlayerSkipForward className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F8</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('F9')}>
          <IconPlayerTrackNext className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F9</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('F10')}>
          <IconVolume3 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F10</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('F11')}>
          <IconVolume2 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F11</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('F12')}>
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
        <KBtn isPressed={isKeyPressed('`')}>
          <span className="block">~</span>
          <span className="mt-1 block">`</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('1')}>
          <span className="block">!</span>
          <span className="block">1</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('2')}>
          <span className="block">@</span>
          <span className="block">2</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('3')}>
          <span className="block">#</span>
          <span className="block">3</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('4')}>
          <span className="block">$</span>
          <span className="block">4</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('5')}>
          <span className="block">%</span>
          <span className="block">5</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('6')}>
          <span className="block">^</span>
          <span className="block">6</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('7')}>
          <span className="block">&</span>
          <span className="block">7</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('8')}>
          <span className="block">*</span>
          <span className="block">8</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('9')}>
          <span className="block">(</span>
          <span className="block">9</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('0')}>
          <span className="block">)</span>
          <span className="block">0</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('-')}>
          <span className="block">&mdash;</span>
          <span className="block">_</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('=')}>
          <span className="block">+</span>
          <span className="block"> = </span>
        </KBtn>
        <KBtn
          className="w-10 items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
          isPressed={isKeyPressed('delete')}
        >
          delete
        </KBtn>
      </div>

      {/* Third row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
          isPressed={isKeyPressed('tab')}
        >
          tab
        </KBtn>
        <KBtn isPressed={isKeyPressed('q')}>
          <span className="block">Q</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('w')}>
          <span className="block">W</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('e')}>
          <span className="block">E</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('r')}>
          <span className="block">R</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('t')}>
          <span className="block">T</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('y')}>
          <span className="block">Y</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('u')}>
          <span className="block">U</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('i')}>
          <span className="block">I</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('o')}>
          <span className="block">O</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('p')}>
          <span className="block">P</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('[')}>
          <span className="block">{`{`}</span>
          <span className="block">{`[`}</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed(']')}>
          <span className="block">{`}`}</span>
          <span className="block">{`]`}</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('\\')}>
          <span className="block">{`|`}</span>
          <span className="block">{`\\`}</span>
        </KBtn>
      </div>

      {/* Fourth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-[2.8rem] items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
          isPressed={isKeyPressed('capslock')}
        >
          caps lock
        </KBtn>
        <KBtn isPressed={isKeyPressed('a')}>
          <span className="block">A</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('s')}>
          <span className="block">S</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('d')}>
          <span className="block">D</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('f')}>
          <span className="block">F</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('g')}>
          <span className="block">G</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('h')}>
          <span className="block">H</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('j')}>
          <span className="block">J</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('k')}>
          <span className="block">K</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('l')}>
          <span className="block">L</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed(';')}>
          <span className="block">{`:`}</span>
          <span className="block">{`;`}</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed("'")}>
          <span className="block">{`"`}</span>
          <span className="block">{`'`}</span>
        </KBtn>
        <KBtn
          className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
          isPressed={isKeyPressed('enter')}
        >
          return
        </KBtn>
      </div>

      {/* Fifth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-[3.65rem] items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
          isPressed={isKeyPressed('shift')}
        >
          shift
        </KBtn>
        <KBtn isPressed={isKeyPressed('z')}>
          <span className="block">Z</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('x')}>
          <span className="block">X</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('c')}>
          <span className="block">C</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('v')}>
          <span className="block">V</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('b')}>
          <span className="block">B</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('n')}>
          <span className="block">N</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('m')}>
          <span className="block">M</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed(',')}>
          <span className="block">{`<`}</span>
          <span className="block">{`,`}</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('.')}>
          <span className="block">{`>`}</span>
          <span className="block">{`.`}</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('/')}>
          <span className="block">{`?`}</span>
          <span className="block">{`/`}</span>
        </KBtn>
        <KBtn
          className="w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
          isPressed={isKeyPressed('shift')}
        >
          shift
        </KBtn>
      </div>

      {/* Sixth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]" isPressed={isKeyPressed('fn')}>
          <div className="flex w-full justify-end pr-1">
            <span className="block">fn</span>
          </div>
          <div className="flex w-full justify-start pl-1">
            <IconWorld className="h-[6px] w-[6px]" />
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]" isPressed={isKeyPressed('control')}>
          <div className="flex w-full justify-end pr-1">
            <IconChevronUp className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">control</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]" isPressed={isKeyPressed('alt')}>
          <div className="flex w-full justify-end pr-1">
            <OptionKey className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-[4px]"
          isPressed={isKeyPressed('meta')}
        >
          <div className="flex w-full justify-end pr-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="w-[8.2rem]" isPressed={isKeyPressed(' ')}></KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-[4px]"
          isPressed={isKeyPressed('meta')}
        >
          <div className="flex w-full justify-start pl-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]" isPressed={isKeyPressed('alt')}>
          <div className="flex w-full justify-start pl-1">
            <OptionKey className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <div className="mt-[2px] flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-[4px] p-[0.5px]">
          <KBtn className="h-3 w-6" isPressed={isKeyPressed('arrowup')}>
            <IconCaretUpFilled className="h-[6px] w-[6px]" />
          </KBtn>
          <div className="flex">
            <KBtn className="h-3 w-6" isPressed={isKeyPressed('arrowleft')}>
              <IconCaretLeftFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn className="h-3 w-6" isPressed={isKeyPressed('arrowdown')}>
              <IconCaretDownFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn className="h-3 w-6" isPressed={isKeyPressed('arrowright')}>
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
  isPressed = false,
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  backlit?: boolean;
  isPressed?: boolean;
}) => {
  return (
    <div
      className={cn(
        "[transform:translateZ(0)] rounded-[4px] p-[0.5px] [will-change:transform] transition-all duration-75",
        backlit && "bg-white/[0.2] shadow-xl shadow-white",
        isPressed && "bg-blue-400/[0.6] shadow-2xl shadow-blue-400/50 scale-95"
      )}
    >
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-[3.5px] transition-all duration-75",
          isPressed ? "bg-blue-500" : "bg-[#0A090D]",
          className,
        )}
        style={{
          boxShadow: isPressed 
            ? "0px 0px 8px 2px rgba(59, 130, 246, 0.5), 0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset"
            : "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
        }}
      >
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center text-[5px] transition-all duration-75",
            isPressed ? "text-white font-bold" : "text-neutral-200",
            childrenClassName,
            backlit && !isPressed && "text-white",
          )}
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

