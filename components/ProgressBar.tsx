"use client";
import React from "react";
import GlassSurface from "@/components/GlassSurface";

interface ProgressBarProps {
  scrollProgress: number;
  currentStage: number;
  totalStages?: number;
  isDark?: boolean;
  onJumpToStage?: (stage: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  scrollProgress,
  currentStage,
  totalStages = 8,
  isDark = true,
  onJumpToStage,
  className = "",
  style = {}
}) => {
  // 主要阶段（有圆点标记的阶段）
  const keyStages = [0, 1, 3, 5, 6];

  const handleStageClick = (stage: number) => {
    if (onJumpToStage) {
      onJumpToStage(stage);
    }
  };

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 ${className}`} style={style}>
      <GlassSurface
        width={450}
        height={45}
        borderRadius={22}
        className="flex items-center justify-between px-5"
        brightness={isDark ? 50 : 120}
        opacity={isDark ? 0.95 : 0.75}
        blur={15}
        backgroundOpacity={isDark ? 0.05 : 0.25}
        saturation={1.5}
        style={{
          border: isDark 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(0, 0, 0, 0.15)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* 进度条容器 */}
        <div className="relative flex items-center gap-4">
          {/* 进度条背景 */}
          <div 
            className="relative w-80 h-2 rounded-full overflow-hidden"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.15)'
            }}
          >
            {/* 进度条填充 */}
            <div 
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${scrollProgress * 100}%`,
                background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.8), rgba(236, 72, 153, 0.9))',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
              }}
            >
              {/* 液体波动效果 */}
              <div 
                className="absolute top-0 left-0 w-full h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'liquidFlow 2s linear infinite',
                }}
              />
            </div>

            {/* 竖线分隔符 */}
            {Array.from({ length: totalStages - 1 }, (_, i) => i + 1).map((divider) => (
              <div
                key={`divider-${divider}`}
                className="absolute top-0 w-0.5 h-full"
                style={{
                  left: `${(divider / (totalStages - 1)) * 100}%`,
                  transform: 'translateX(-50%)',
                  background: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.25)',
                  zIndex: 5,
                }}
              />
            ))}
          </div>

          {/* 阶段标记大球 */}
          {keyStages.map((stage) => (
            <button
              key={stage}
              onClick={() => handleStageClick(stage)}
              className="absolute w-5 h-5 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center backdrop-blur-sm"
              style={{
                left: `${20 + (stage / (totalStages - 1)) * 320}px`,
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
                background: currentStage >= stage 
                  ? 'linear-gradient(145deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.8))'
                  : (isDark 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(0, 0, 0, 0.1)'),
                border: currentStage >= stage 
                  ? '1px solid rgba(59, 130, 246, 0.4)' 
                  : (isDark 
                      ? '1px solid rgba(255, 255, 255, 0.2)' 
                      : '1px solid rgba(0, 0, 0, 0.2)'),
                boxShadow: currentStage >= stage
                  ? '0 2px 8px rgba(59, 130, 246, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  : (isDark
                      ? '0 2px 6px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : '0 2px 6px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4)'),
                zIndex: 20,
              }}
            >
              {/* 内部高光点 */}
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: currentStage >= stage 
                    ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2), transparent)'
                    : 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1), transparent)',
                  transform: 'translate(-1px, -1px)',
                }}
              />
            </button>
          ))}
        </div>

        {/* 阶段指示器 */}
        <div 
          className="flex items-center gap-2 text-xs font-medium"
          style={{
            color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
          }}
        >
          <span>Stage</span>
          <span 
            className="px-1.5 py-0.5 rounded-full text-[10px]"
            style={{
              background: isDark 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.15)',
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'
            }}
          >
            {currentStage + 1}/{totalStages}
          </span>
        </div>
      </GlassSurface>

      {/* 添加CSS动画样式 */}
      <style jsx>{`
        @keyframes liquidFlow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
