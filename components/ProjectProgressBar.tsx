"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GlassSurface from "@/components/GlassSurface";

interface ProgressBarProps {
  scrollProgress: number;
  currentStage: number;
  totalStages?: number;
  isDark?: boolean;
  onJumpToStage?: (stage: number) => void;
  className?: string;
  style?: React.CSSProperties;
  stageLabels?: string[];
}

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "PROJ", href: "/project" },
  { label: "ART", href: "/art" },
  { label: "PHOTO", href: "/photo" }
];

const DEFAULT_STAGE_LABELS: Record<number, string> = {
  0: "Work",
  1: "Projects",
  2: "Connect",
};

const ProjectProgressBar: React.FC<ProgressBarProps> = ({
  scrollProgress,
  currentStage,
  totalStages = 3,
  isDark = true,
  onJumpToStage,
  className = "",
  style = {},
  stageLabels,
}) => {
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  const getStageLabel = (stage: number) => {
    if (stageLabels && stageLabels[stage]) {
      return stageLabels[stage];
    }
    return DEFAULT_STAGE_LABELS[stage] ?? `Stage ${stage + 1}`;
  };

  const stageLabel = getStageLabel(currentStage);

  const keyStages = Array.from({ length: totalStages }, (_, index) => index);

  const handleStageClick = (stage: number) => {
    if (onJumpToStage) {
      onJumpToStage(stage);
    }
  };

  const handleNavigate = (href: string) => {
    setIsNavOpen(false);
    router.push(href);
  };

  useEffect(() => {
    if (!isNavOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(event.target as Node)) {
        setIsNavOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isNavOpen]);

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] ${className}`} style={style}>
      <div className="relative">
        <GlassSurface
          width={-1}
          height={45}
          borderRadius={22}
          className="w-[320px] sm:w-[450px] lg:w-[550px] flex items-center justify-between px-5 transition-all duration-300 ease-in-out"
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
              className="relative w-56 sm:w-80 lg:w-[400px] h-2 rounded-full overflow-hidden transition-all duration-300 ease-in-out"
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
                  left: `${(divider / (totalStages -1)) * 100}%`,
                  transform: 'translateX(-50%)',
                  background: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.25)',
                  zIndex: 5,
                }}
              />
            ))}
            </div>

            {/* 阶段标记大球 */}
          {keyStages.map((stage) => {
            const label = getStageLabel(stage);
            return (
            <button
              key={stage}
              onClick={() => handleStageClick(stage)}
              className="absolute w-5 h-5 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center backdrop-blur-sm"
              aria-label={label}
              style={{
                left: `${(stage / (totalStages - 1)) * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
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
          );
          })}
        </div>

        {/* 阶段指示器 */}
        <div 
          className="flex items-center text-xs font-medium"
          style={{
            color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
          }}
        >
          {stageLabel && (
            <span
              className="px-1.5 py-0.5 rounded-full bg-white/10 text-white/90 dark:bg-slate-900/30 dark:text-white/85"
              style={{
                marginLeft: '15px',
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)',
                color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.75)'
              }}
            >
              {stageLabel}
            </span>
          )}
        </div>
      </GlassSurface>

        {/* 导航按钮 - 独立于进度条 */}
        <div
          ref={navRef}
          className="absolute -left-20 top-1/2 flex -translate-y-1/2 flex-col items-center"
          style={{ pointerEvents: "auto" }}
        >
          <GlassSurface
            width={58}
            height={58}
            borderRadius={29}
            brightness={isDark ? 55 : 120}
            opacity={isDark ? 0.95 : 0.8}
            blur={18}
            backgroundOpacity={isDark ? 0.06 : 0.18}
            saturation={1.6}
            className="flex items-center justify-center"
            style={{
              border: isDark
                ? '1px solid rgba(255, 255, 255, 0.2)'
                : '1px solid rgba(15, 23, 42, 0.25)',
              boxShadow: isDark
                ? '0 10px 30px rgba(30, 64, 175, 0.35)'
                : '0 10px 30px rgba(30, 64, 175, 0.25)',
            }}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={isNavOpen}
              aria-controls="progress-nav-menu"
              onClick={() => setIsNavOpen((prev) => !prev)}
              className="flex h-full w-full items-center justify-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
              style={{
                background: 'transparent',
                color: isDark ? 'rgba(241, 245, 249, 0.95)' : 'rgba(15, 23, 42, 0.85)'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isNavOpen ? 'rotate-90' : ''}`}
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </GlassSurface>

          {isNavOpen && (
            <div
              id="progress-nav-menu"
              className="absolute bottom-[72px] left-1/2 z-50 flex -translate-x-1/2 flex-col items-stretch"
              style={{ pointerEvents: 'auto' }}
            >
              <GlassSurface
                width={240}
                height={108}
                borderRadius={18}
                brightness={isDark ? 55 : 120}
                opacity={isDark ? 0.95 : 0.8}
                blur={18}
                backgroundOpacity={isDark ? 0.06 : 0.2}
                saturation={1.6}
                className="overflow-hidden"
                style={{
                  border: isDark
                    ? '1px solid rgba(255, 255, 255, 0.18)'
                    : '1px solid rgba(15, 23, 42, 0.25)',
                  boxShadow: isDark
                    ? '0 18px 45px rgba(30, 64, 175, 0.35)'
                    : '0 18px 45px rgba(30, 64, 175, 0.28)',
                  padding: '12px'
                }}
              >
                <div className="grid grid-cols-4 gap-3">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => handleNavigate(item.href)}
                      className="flex h-20 w-full items-center justify-center rounded-xl px-4 py-3 text-xs font-medium transition-transform duration-150 hover:-translate-y-0.5"
                      style={{
                        background: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(15, 23, 42, 0.08)',
                        color: isDark ? 'rgba(226, 232, 240, 0.95)' : 'rgba(15, 23, 42, 0.85)',
                        border: isDark
                          ? '1px solid rgba(255, 255, 255, 0.12)'
                          : '1px solid rgba(15, 23, 42, 0.15)',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 20px rgba(30, 64, 175, 0.2)',
                        fontFamily: 'var(--font-audiowide)',
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright',
                        letterSpacing: '-0.3em',
                        lineHeight: 1.2
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </GlassSurface>
            </div>
          )}
        </div>
        </div>
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

export default ProjectProgressBar;
