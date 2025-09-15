"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
}

interface StarsBackgroundProps {
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed?: number;
  maxTwinkleSpeed?: number;
  className?: string;
}

export const StarsBackground: React.FC<StarsBackgroundProps> = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  className,
}) => {
  const [stars, setStars] = useState<Star[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateStars = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        const numStars = Math.floor(width * height * starDensity);
        const newStars: Star[] = Array.from({ length: numStars }, () => {
          const shouldTwinkle = allStarsTwinkle || Math.random() < twinkleProbability;
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 0.05 + 0.5,
            opacity: Math.random() * 0.5 + 0.5,
            twinkleSpeed: shouldTwinkle
              ? minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
              : 0,
          };
        });
        setStars(newStars);
      }
    };

    updateStars();

    const resizeObserver = new ResizeObserver(updateStars);
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        // 使用明亮的金色和彩色星星
        const colors = [
          `rgba(255, 215, 0, ${star.opacity})`,   // 金色
          `rgba(255, 20, 147, ${star.opacity})`,  // 深粉色
          `rgba(0, 191, 255, ${star.opacity})`,   // 深天蓝色
          `rgba(50, 205, 50, ${star.opacity})`,   // 酸橙绿
          `rgba(255, 69, 0, ${star.opacity})`,    // 橙红色
        ];
        const colorIndex = Math.floor((star.x + star.y) * 0.01) % colors.length;
        ctx.fillStyle = colors[colorIndex];
        ctx.fill();

        if (star.twinkleSpeed > 0) {
          star.opacity =
            0.5 + Math.abs(Math.sin(Date.now() * 0.001 * star.twinkleSpeed)) * 0.5;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stars]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "h-full w-full absolute inset-0",
        className
      )}
    />
  );
};
