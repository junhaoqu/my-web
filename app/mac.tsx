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
    
    // 如果只有一个键被按下，使用蓝色
    if (pressedKeyIds.length === 1) {
      return { color: '#3b82f6', isMultiKey: false };
    }
    
    // 如果多个键被按下，使用彩虹色
    const keyIndex = pressedKeyIds.indexOf(keyId);
    const colorIndex = keyIndex % rainbowColors.length;
    return { color: rainbowColors[colorIndex], isMultiKey: true };
  };

  // 渲染按键的辅助函数
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

      {/* Second row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        {renderKBtn('`', {}, <>
          <span className="block">~</span>
          <span className="mt-1 block">`</span>
        </>)}
        {renderKBtn('1', {}, <>
          <span className="block">!</span>
          <span className="block">1</span>
        </>)}
        {renderKBtn('2', {}, <>
          <span className="block">@</span>
          <span className="block">2</span>
        </>)}
        {renderKBtn('3', {}, <>
          <span className="block">#</span>
          <span className="block">3</span>
        </>)}
        {renderKBtn('4', {}, <>
          <span className="block">$</span>
          <span className="block">4</span>
        </>)}
        {renderKBtn('5', {}, <>
          <span className="block">%</span>
          <span className="block">5</span>
        </>)}
        {renderKBtn('6', {}, <>
          <span className="block">^</span>
          <span className="block">6</span>
        </>)}
        {renderKBtn('7', {}, <>
          <span className="block">&</span>
          <span className="block">7</span>
        </>)}
        {renderKBtn('8', {}, <>
          <span className="block">*</span>
          <span className="block">8</span>
        </>)}
        {renderKBtn('9', {}, <>
          <span className="block">(</span>
          <span className="block">9</span>
        </>)}
        {renderKBtn('0', {}, <>
          <span className="block">)</span>
          <span className="block">0</span>
        </>)}
        {renderKBtn('-', {}, <>
          <span className="block">&mdash;</span>
          <span className="block">_</span>
        </>)}
        {renderKBtn('=', {}, <>
          <span className="block">+</span>
          <span className="block"> = </span>
        </>)}
        {renderKBtn('delete', {
          className: "w-10 items-end justify-end pr-[4px] pb-[2px]",
          childrenClassName: "items-end"
        }, 'delete')}
      </div>

      {/* Third row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
          isPressed={isKeyPressed('tab')}
          keyId="tab"
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
        >
          tab
        </KBtn>
        <KBtn isPressed={isKeyPressed('q')} keyId="q" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">Q</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('w')} keyId="w" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">W</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('e')} keyId="e" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">E</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('r')} keyId="r" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">R</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('t')} keyId="t" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">T</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('y')} keyId="y" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">Y</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('u')} keyId="u" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">U</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('i')} keyId="i" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">I</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('o')} keyId="o" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">O</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('p')} keyId="p" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">P</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('[')} keyId="[" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">{`{`}</span>
          <span className="block">{`[`}</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed(']')} keyId="]" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">{`}`}</span>
          <span className="block">{`]`}</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('\\')} keyId="\\" pressedKeys={pressedKeys} keyMapping={keyMapping}>
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
          keyId="capslock"
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
        >
          caps lock
        </KBtn>
        <KBtn isPressed={isKeyPressed('a')} keyId="a" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">A</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('s')} keyId="s" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">S</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('d')} keyId="d" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">D</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('f')} keyId="f" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">F</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('g')} keyId="g" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">G</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('h')} keyId="h" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">H</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('j')} keyId="j" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">J</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('k')} keyId="k" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">K</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('l')} keyId="l" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">L</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed(';')} keyId=";" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">{`:`}</span>
          <span className="block">{`;`}</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed("'")} keyId="'" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">{`"`}</span>
          <span className="block">{`'`}</span>
        </KBtn>
        <KBtn
          className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
          isPressed={isKeyPressed('enter')}
          keyId="enter"
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
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
          keyId="shift"
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
        >
          shift
        </KBtn>
        <KBtn isPressed={isKeyPressed('z')} keyId="z" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">Z</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('x')} keyId="x" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">X</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('c')} keyId="c" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">C</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('v')} keyId="v" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">V</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('b')} keyId="b" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">B</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('n')} keyId="n" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">N</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('m')} keyId="m" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">M</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed(',')} keyId="," pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">{`<`}</span>
          <span className="block">{`,`}</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('.')} keyId="." pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">{`>`}</span>
          <span className="block">{`.`}</span>
        </KBtn>
        <KBtn isPressed={isKeyPressed('/')} keyId="/" pressedKeys={pressedKeys} keyMapping={keyMapping}>
          <span className="block">{`?`}</span>
          <span className="block">{`/`}</span>
        </KBtn>
        <KBtn
          className="w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
          isPressed={isKeyPressed('shift')}
          keyId="shift"
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
        >
          shift
        </KBtn>
      </div>

      {/* Sixth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn 
          className="" 
          childrenClassName="h-full justify-between py-[4px]" 
          isPressed={isKeyPressed('fn')}
          keyId="fn"
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
        >
          <div className="flex w-full justify-end pr-1">
            <span className="block">fn</span>
          </div>
          <div className="flex w-full justify-start pl-1">
            <IconWorld className="h-[6px] w-[6px]" />
          </div>
        </KBtn>
        <KBtn 
          className="" 
          childrenClassName="h-full justify-between py-[4px]" 
          isPressed={isKeyPressed('control')}
          keyId="control"
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
        >
          <div className="flex w-full justify-end pr-1">
            <IconChevronUp className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">control</span>
          </div>
        </KBtn>
        <KBtn 
          className="" 
          childrenClassName="h-full justify-between py-[4px]" 
          isPressed={isKeyPressed('alt')}
          keyId="alt"
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
        >
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
          keyId="meta"
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
        >
          <div className="flex w-full justify-end pr-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn 
          className="w-[8.2rem]" 
          isPressed={isKeyPressed(' ')}
          keyId=" "
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
        ></KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-[4px]"
          isPressed={isKeyPressed('meta')}
          keyId="meta"
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
        >
          <div className="flex w-full justify-start pl-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn 
          className="" 
          childrenClassName="h-full justify-between py-[4px]" 
          isPressed={isKeyPressed('alt')}
          keyId="alt"
          pressedKeys={pressedKeys}
          keyMapping={keyMapping}
        >
          <div className="flex w-full justify-start pl-1">
            <OptionKey className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <div className="mt-[2px] flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-[4px] p-[0.5px]">
          <KBtn 
            className="h-3 w-6" 
            isPressed={isKeyPressed('arrowup')}
            keyId="arrowup"
            pressedKeys={pressedKeys}
            keyMapping={keyMapping}
          >
            <IconCaretUpFilled className="h-[6px] w-[6px]" />
          </KBtn>
          <div className="flex">
            <KBtn 
              className="h-3 w-6" 
              isPressed={isKeyPressed('arrowleft')}
              keyId="arrowleft"
              pressedKeys={pressedKeys}
              keyMapping={keyMapping}
            >
              <IconCaretLeftFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn 
              className="h-3 w-6" 
              isPressed={isKeyPressed('arrowdown')}
              keyId="arrowdown"
              pressedKeys={pressedKeys}
              keyMapping={keyMapping}
            >
              <IconCaretDownFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn 
              className="h-3 w-6" 
              isPressed={isKeyPressed('arrowright')}
              keyId="arrowright"
              pressedKeys={pressedKeys}
              keyMapping={keyMapping}
            >
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
  // 如果提供了keyId和相关参数，自动计算颜色
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

  return (
    <div
      className={cn(
        "[transform:translateZ(0)] rounded-[4px] p-[0.5px] [will-change:transform] transition-all duration-150",
        backlit && "bg-white/[0.2] shadow-xl shadow-white",
        isPressed && "shadow-2xl scale-95"
      )}
      style={{
        background: isPressed 
          ? finalIsMultiKey 
            ? `linear-gradient(135deg, ${finalColor}, ${finalColor}dd, ${finalColor}bb)` 
            : `${finalColor}80` 
          : undefined,
        boxShadow: isPressed
          ? `0px 0px 20px 4px ${finalColor}40`
          : undefined
      }}
    >
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-[3.5px] transition-all duration-150 relative overflow-hidden",
          className,
        )}
        style={{
          background: isPressed 
            ? finalColor
            : "#0A090D",
          boxShadow: isPressed 
            ? `0px 0px 12px 2px ${finalColor}60, 0px -0.5px 2px 0 rgba(255,255,255,0.2) inset, -0.5px 0px 2px 0 rgba(255,255,255,0.2) inset`
            : "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
        }}
      >
        {/* 多键时的特效层 */}
        {isPressed && finalIsMultiKey && (
          <>
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
                animation: "shimmer 1.5s ease-in-out infinite"
              }}
            />
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: "radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, transparent 70%)",
                animation: "pulse 2s ease-in-out infinite"
              }}
            />
          </>
        )}
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center text-[5px] transition-all duration-150 relative z-10",
            isPressed ? "text-white font-bold drop-shadow-lg" : "text-neutral-200",
            childrenClassName,
            backlit && !isPressed && "text-white",
          )}
          style={{
            textShadow: isPressed ? "0 0 8px rgba(255,255,255,0.8)" : undefined
          }}
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

