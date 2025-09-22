"use client";
import { animate } from "animejs";
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion } from "framer-motion";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export interface IpadAsset {
  id: string;
  imageId: string;
  videoId: string;
  label?: string;
}

export interface IpadRef {
  updateAnimation: (progress: number) => void;
}

interface IpadScrollProps {
  assets: IpadAsset[];
  showContent: boolean;
  isDark: boolean;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const buildImageUrl = (publicId: string) => {
  if (!cloudName) return "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
};

const IpadScroll = forwardRef<IpadRef, IpadScrollProps>(({ assets, showContent, isDark, selectedIndex, onSelect }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    updateAnimation: (progress: number) => {
      const clampedProgress = Math.max(0, Math.min(1, progress));
      
      // 动画屏幕
      animate(".ipad-animated-screen", {
        rotateX: -70 + clampedProgress * 70,
        duration: 200,
        easing: "easeOutQuad",
      });
    }
  }));

  useEffect(() => {
    // 初始化屏幕状态
    animate('.ipad-animated-screen', {
      rotateX: -70,
      duration: 0
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="ipad-container relative transform-gpu [perspective:800px] cursor-pointer w-full h-full"
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: 'center center'
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
          transform: 'translate(-50%, -160%) translateZ(-10px) scale(1.1)',
          zIndex: -1
        }}
      ></div>
      
      
      <div
        className="ipad-base absolute top-0 left-0 rounded-2xl will-change-transform [transform-style:preserve-3d]"
        style={{ 
          width: '20rem',
          height: '28rem',
          backgroundColor: 'var(--device-background)',
          color: 'var(--device-foreground)',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}
      >
        {/* Screen */}
        <motion.div
          className="ipad-animated-screen absolute inset-0 h-full w-full rounded-2xl p-[2%]"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "bottom",
            backgroundColor: isDark ? "#050505" : "#f6f8fa",
          }}
        >
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: isDark ? "rgba(8,11,17,0.85)" : "rgba(248,250,252,0.92)",
              border: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid rgba(71, 85, 105, 0.12)",
            }}
          />

          <motion.div
            className="relative h-full w-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              background: isDark ? "rgba(8,11,17,0.55)" : "rgba(248,250,252,0.65)",
              backdropFilter: "blur(6px)",
              borderRadius: "12px",
              border: isDark
                ? "1px solid rgba(148,163,184,0.12)"
                : "1px solid rgba(148,163,184,0.18)",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "18px",
              pointerEvents: showContent ? "auto" : "none",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: "14px",
                flex: "1",
              }}
            >
              {assets.map((asset, index) => {
                const isActive = index === selectedIndex;
                return (
                  <button
                    key={asset.id}
                    type="button"
                  onClick={() => showContent && onSelect(index)}
                  className={
                    "relative overflow-hidden rounded-[14px] transition-transform" +
                    (isActive ? " scale-[1.03]" : showContent ? " hover:scale-[1.02]" : "")
                  }
                  style={{
                    aspectRatio: "3 / 4",
                    width: "100%",
                    border: isActive
                      ? "1px solid rgba(37,99,235,0.65)"
                      : "1px solid rgba(148,163,184,0.12)",
                    background: isDark
                      ? "rgba(15,23,42,0.55)"
                      : "rgba(241,245,249,0.7)",
                    boxShadow: isActive
                      ? "0 0 18px rgba(37,99,235,0.36)"
                      : "0 4px 14px rgba(15,23,42,0.12)",
                  }}
                >
                  <img
                    src={buildImageUrl(asset.imageId)}
                    alt={asset.label || asset.id}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              );
              })}
            </div>

            <div className="flex justify-center">
              <HoverBorderGradient
                as="a"
                href="https://junhaoqu.com/art"
                target="_blank"
                rel="noopener noreferrer"
                containerClassName="rounded-full"
                className="dark:bg-black bg-white text-black dark:text-white px-4 py-2 text-xs font-medium"
              >
                Visited Gallary
              </HoverBorderGradient>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
});

IpadScroll.displayName = 'IpadScroll';

export default IpadScroll;
