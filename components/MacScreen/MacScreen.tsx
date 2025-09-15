"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  WindowState, 
  MenuBar, 
  Desktop, 
  Dock, 
  VSCodeWindow, 
  TerminalWindow, 
  BrowserWindow 
} from "./index";

interface MacScreenProps {
  animationProgress?: number;
}

const MacScreen: React.FC<MacScreenProps> = ({ animationProgress = 0 }) => {
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    vscode: {
      id: 'vscode',
      isOpen: false,
      isMinimized: false,
      position: { x: 50, y: 80 },
      size: { width: 800, height: 500 },
      zIndex: 1
    },
    terminal: {
      id: 'terminal',
      isOpen: false,
      isMinimized: false,
      position: { x: 100, y: 120 },
      size: { width: 600, height: 350 },
      zIndex: 2
    },
    browser: {
      id: 'browser',
      isOpen: false,
      isMinimized: false,
      position: { x: 150, y: 100 },
      size: { width: 700, height: 450 },
      zIndex: 3
    }
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 根据动画进度自动打开窗口
  useEffect(() => {
    if (animationProgress > 0.3 && !windows.vscode.isOpen) {
      openWindow('vscode');
    }
    if (animationProgress > 0.5 && !windows.terminal.isOpen) {
      openWindow('terminal');
    }
    if (animationProgress > 0.7 && !windows.browser.isOpen) {
      openWindow('browser');
    }
  }, [animationProgress, windows]);

  const openWindow = (windowId: string) => {
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        isOpen: true,
        isMinimized: false,
        zIndex: Math.max(...Object.values(prev).map(w => w.zIndex)) + 1
      }
    }));
  };

  const closeWindow = (windowId: string) => {
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        isOpen: false
      }
    }));
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        isMinimized: !prev[windowId].isMinimized
      }
    }));
  };

  const focusWindow = (windowId: string) => {
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        zIndex: Math.max(...Object.values(prev).map(w => w.zIndex)) + 1
      }
    }));
  };

  const updateWindowPosition = (windowId: string, position: { x: number; y: number }) => {
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        position
      }
    }));
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* 桌面壁纸 */}
      <Desktop />
      
      {/* 菜单栏 */}
      <MenuBar currentTime={currentTime} />
      
      {/* 窗口 */}
      <AnimatePresence>
        {windows.vscode.isOpen && (
          <VSCodeWindow
            key="vscode"
            windowState={windows.vscode}
            onClose={() => closeWindow('vscode')}
            onMinimize={() => minimizeWindow('vscode')}
            onFocus={() => focusWindow('vscode')}
            onPositionChange={(pos: { x: number; y: number }) => updateWindowPosition('vscode', pos)}
          />
        )}
        
        {windows.terminal.isOpen && (
          <TerminalWindow
            key="terminal"
            windowState={windows.terminal}
            onClose={() => closeWindow('terminal')}
            onMinimize={() => minimizeWindow('terminal')}
            onFocus={() => focusWindow('terminal')}
            onPositionChange={(pos: { x: number; y: number }) => updateWindowPosition('terminal', pos)}
          />
        )}
        
        {windows.browser.isOpen && (
          <BrowserWindow
            key="browser"
            windowState={windows.browser}
            onClose={() => closeWindow('browser')}
            onMinimize={() => minimizeWindow('browser')}
            onFocus={() => focusWindow('browser')}
            onPositionChange={(pos: { x: number; y: number }) => updateWindowPosition('browser', pos)}
          />
        )}
      </AnimatePresence>
      
      {/* Dock */}
      <Dock 
        onAppClick={openWindow}
        windows={windows}
      />
    </div>
  );
};

export default MacScreen;
