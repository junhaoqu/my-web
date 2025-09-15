"use client";
import React, { useRef } from "react";
import { motion, PanInfo } from "framer-motion";
import { WindowState } from "../types";

interface BaseWindowProps {
  windowState: WindowState;
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  children: React.ReactNode;
  className?: string;
}

const BaseWindow: React.FC<BaseWindowProps> = ({
  windowState,
  title,
  onClose,
  onMinimize,
  onFocus,
  onPositionChange,
  children,
  className = ""
}) => {
  const constraintsRef = useRef(null);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const newPosition = {
      x: Math.max(0, Math.min(windowState.position.x + info.offset.x, window.innerWidth - windowState.size.width)),
      y: Math.max(24, Math.min(windowState.position.y + info.offset.y, window.innerHeight - windowState.size.height))
    };
    onPositionChange(newPosition);
  };

  if (windowState.isMinimized) {
    return null;
  }

  return (
    <motion.div
      ref={constraintsRef}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: windowState.position.x,
        y: windowState.position.y
      }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      drag
      dragConstraints={constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onClick={onFocus}
      className={`absolute bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden cursor-move ${className}`}
      style={{
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex
      }}
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* 窗口标题栏 */}
      <div className="flex items-center justify-between h-8 bg-gradient-to-r from-gray-100 to-gray-200 px-4 border-b border-gray-300 cursor-move">
        {/* 窗口控制按钮 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
          />
          <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors" />
        </div>
        
        {/* 窗口标题 */}
        <div className="flex-1 text-center">
          <span className="text-xs font-medium text-gray-700">{title}</span>
        </div>
        
        {/* 占位符保持对称 */}
        <div className="w-[54px]"></div>
      </div>
      
      {/* 窗口内容 */}
      <div className="h-[calc(100%-2rem)] overflow-hidden cursor-default" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </motion.div>
  );
};

export default BaseWindow;
