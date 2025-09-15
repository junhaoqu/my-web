"use client";
import React from "react";
import { motion } from "framer-motion";
import { WindowState } from "./types";

interface DockProps {
  onAppClick: (appId: string) => void;
  windows: Record<string, WindowState>;
}

const Dock: React.FC<DockProps> = ({ onAppClick, windows }) => {
  const apps = [
    { id: 'finder', name: 'Finder', icon: '📁', color: 'from-blue-400 to-blue-600' },
    { id: 'vscode', name: 'VS Code', icon: '💻', color: 'from-blue-500 to-indigo-600' },
    { id: 'terminal', name: 'Terminal', icon: '⚡', color: 'from-gray-700 to-black' },
    { id: 'browser', name: 'Safari', icon: '🌐', color: 'from-blue-400 to-cyan-500' },
    { id: 'github', name: 'GitHub', icon: '🐱', color: 'from-gray-800 to-black' },
    { id: 'figma', name: 'Figma', icon: '🎨', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2"
    >
      {apps.map((app, index) => {
        const isActive = windows[app.id]?.isOpen;
        
        return (
          <motion.button
            key={app.id}
            onClick={() => onAppClick(app.id)}
            className="relative group"
            whileHover={{ scale: 1.2, y: -10 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {/* 应用图标 */}
            <div className={`
              w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} 
              flex items-center justify-center text-2xl shadow-lg
              border border-white/20
              ${isActive ? 'ring-2 ring-white/50' : ''}
            `}>
              {app.icon}
            </div>
            
            {/* 活动指示器 */}
            {isActive && (
              <motion.div
                layoutId={`active-${app.id}`}
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
            )}
            
            {/* 悬停提示 */}
            <motion.div
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              {app.name}
            </motion.div>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default Dock;
