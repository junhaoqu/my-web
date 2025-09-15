"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  IconWifi, 
  IconBattery3, 
  IconSearch,
  IconVolume2
} from "@tabler/icons-react";

interface MenuBarProps {
  currentTime: Date;
}

const MenuBar: React.FC<MenuBarProps> = ({ currentTime }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // 防止水合错误，只在客户端挂载后显示实际时间
  const displayTime = mounted ? formatTime(currentTime) : "12:00 PM";
  const displayDate = mounted ? formatDate(currentTime) : "Mon Oct 15";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-0 left-0 right-0 h-6 bg-black/20 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 text-white text-xs font-medium z-50"
    >
      {/* 左侧 - Apple 菜单和应用菜单 */}
      <div className="flex items-center space-x-4">
        <div className="text-lg">🍎</div>
        <span className="font-semibold">Finder</span>
        <span className="text-white/70">File</span>
        <span className="text-white/70">Edit</span>
        <span className="text-white/70">View</span>
        <span className="text-white/70">Go</span>
        <span className="text-white/70">Window</span>
        <span className="text-white/70">Help</span>
      </div>

      {/* 右侧 - 状态图标和时间 */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <IconSearch className="w-4 h-4 opacity-70" />
          <IconVolume2 className="w-4 h-4 opacity-70" />
          <IconWifi className="w-4 h-4 opacity-70" />
          <IconBattery3 className="w-4 h-4 opacity-70" />
        </div>
        <div className="text-right">
          <div className="leading-none">{displayTime}</div>
          <div className="text-[10px] text-white/70 leading-none">{displayDate}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuBar;
