"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  WindowState, 
  Desktop, 
  TerminalWindow 
} from "./index";

interface MacScreenProps {
  animationProgress?: number;
}

const MacScreen: React.FC<MacScreenProps> = ({ animationProgress = 0 }) => {
  const [terminalWindow, setTerminalWindow] = useState<WindowState>({
    id: 'terminal',
    isOpen: true, // 从一开始就打开
    isMinimized: false,
    position: { x: 0, y: 0 }, // 全屏位置
    size: { width: 800, height: 600 }, // 会被CSS覆盖为全屏
    zIndex: 1
  });

  // 移除自动打开窗口的逻辑，因为Terminal从开始就是打开的

  const closeWindow = () => {
    setTerminalWindow(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const minimizeWindow = () => {
    setTerminalWindow(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized
    }));
  };

  const focusWindow = () => {
    // Terminal是唯一窗口，不需要做什么
  };

  const updateWindowPosition = (position: { x: number; y: number }) => {
    setTerminalWindow(prev => ({
      ...prev,
      position
    }));
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Terminal窗口 - 全屏显示 */}
      <AnimatePresence>
        {terminalWindow.isOpen && (
          <TerminalWindow
            key="terminal"
            windowState={terminalWindow}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            onPositionChange={updateWindowPosition}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MacScreen;
