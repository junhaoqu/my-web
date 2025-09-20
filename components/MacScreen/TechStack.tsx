"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import GlassSurface from "@/components/GlassSurface";

interface Bubble {
  id: string;
  name: string;
  icon: string;
  size: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

const TechStack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const containerSize = 250;

  // 技术栈数据
  const technologies = [
    { name: "Java", icon: "/images/icon/Java.png", size: 70 },
    { name: "Python", icon: "/images/icon/Python.png", size: 70 },
    { name: "React", icon: "/images/icon/React.png", size: 60 },
    { name: "Next.js", icon: "/images/icon/Next.js.png", size: 60 },
    { name: "AWS", icon: "/images/icon/AWS.png", size: 55 },
    { name: "Docker", icon: "/images/icon/Docker.png", size: 55 },
    { name: "MySQL", icon: "/images/icon/MySQL.png", size: 50 },
    { name: "TensorFlow", icon: "/images/icon/TensorFlow.png", size: 50 },
    { name: "Go", icon: "/images/icon/Go.png", size: 45 },
    { name: "Kubernetes", icon: "/images/icon/Kubernetes.png", size: 45 },
    { name: "Swift", icon: "/images/icon/Swift.png", size: 40 },
    { name: "Android", icon: "/images/icon/Android.png", size: 40 },
  ];

  // 生成随机颜色
  const getRandomColor = () => {
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 检查气泡碰撞
  const checkCollision = (bubble1: Bubble, bubble2: Bubble) => {
    const dx = bubble1.x - bubble2.x;
    const dy = bubble1.y - bubble2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (bubble1.size + bubble2.size) / 2;
  };

  // 处理气泡碰撞
  const handleCollision = (bubble1: Bubble, bubble2: Bubble) => {
    const dx = bubble1.x - bubble2.x;
    const dy = bubble1.y - bubble2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (bubble1.size + bubble2.size) / 2;
    
    if (distance < minDistance && distance > 0) {
      // 计算重叠量
      const overlap = minDistance - distance;
      
      // 归一化方向向量
      const normalX = dx / distance;
      const normalY = dy / distance;
      
      // 分离气泡 - 根据质量（大小）分配移动距离
      const totalSize = bubble1.size + bubble2.size;
      const move1 = (bubble2.size / totalSize) * overlap;
      const move2 = (bubble1.size / totalSize) * overlap;
      
      bubble1.x += normalX * move1;
      bubble1.y += normalY * move1;
      bubble2.x -= normalX * move2;
      bubble2.y -= normalY * move2;
      
      // 计算相对速度
      const relativeVx = bubble1.vx - bubble2.vx;
      const relativeVy = bubble1.vy - bubble2.vy;
      
      // 计算相对速度在碰撞法线方向上的分量
      const relativeVelocity = relativeVx * normalX + relativeVy * normalY;
      
      // 如果物体正在分离，不需要处理
      if (relativeVelocity > 0) return;
      
      // 计算冲量标量
      const restitution = 0.6; // 恢复系数
      const impulse = -(1 + restitution) * relativeVelocity;
      const impulseX = impulse * normalX;
      const impulseY = impulse * normalY;
      
      // 应用冲量（考虑质量）
      const mass1 = bubble1.size;
      const mass2 = bubble2.size;
      
      bubble1.vx += impulseX / mass1;
      bubble1.vy += impulseY / mass1;
      bubble2.vx -= impulseX / mass2;
      bubble2.vy -= impulseY / mass2;
    }
  };

  // 初始化气泡
  useEffect(() => {
    const initialBubbles: Bubble[] = [];
    
    technologies.forEach((tech, index) => {
      let x: number, y: number;
      let attempts = 0;
      const radius = tech.size / 2;
      
      do {
        // 确保气泡完全在容器内
        x = radius + Math.random() * (containerSize - tech.size);
        y = radius + Math.random() * (containerSize - tech.size);
        
        // 再次确保在边界内
        x = Math.max(radius, Math.min(containerSize - radius, x));
        y = Math.max(radius, Math.min(containerSize - radius, y));
        
        attempts++;
      } while (
        attempts < 100 && 
        initialBubbles.some(bubble => {
          const distance = Math.sqrt(Math.pow(x - bubble.x, 2) + Math.pow(y - bubble.y, 2));
          return distance < (tech.size + bubble.size) / 2 + 5;
        })
      );

      const bubble: Bubble = {
        id: `${tech.name}-${index}`,
        name: tech.name,
        icon: tech.icon,
        size: tech.size,
        x,
        y,
        vx: (Math.random() - 0.5) * 1.2, // 统一速度
        vy: (Math.random() - 0.5) * 1.2,
        color: getRandomColor(),
      };
      
      initialBubbles.push(bubble);
    });

    setBubbles(initialBubbles);
  }, []);

  // 动画循环 - 持续移动气泡，增加活力
  useEffect(() => {
    const animate = () => {
      setBubbles(prevBubbles => {
        const newBubbles = prevBubbles.map(bubble => {
          let newX = bubble.x + bubble.vx;
          let newY = bubble.y + bubble.vy;
          let newVx = bubble.vx;
          let newVy = bubble.vy;

          // 添加小的随机扰动以保持活力
          newVx += (Math.random() - 0.5) * 0.05;
          newVy += (Math.random() - 0.5) * 0.05;

          // 限制最大速度
          const maxSpeed = 2;
          const speed = Math.sqrt(newVx * newVx + newVy * newVy);
          if (speed > maxSpeed) {
            newVx = (newVx / speed) * maxSpeed;
            newVy = (newVy / speed) * maxSpeed;
          }

          // 边界碰撞检测
          const radius = bubble.size / 2;
          
          if (newX - radius <= 0) {
            newVx = Math.abs(newVx) + 0.1; // 添加额外动力
            newX = radius + 1;
          } else if (newX + radius >= containerSize) {
            newVx = -Math.abs(newVx) - 0.1;
            newX = containerSize - radius - 1;
          }
          
          if (newY - radius <= 0) {
            newVy = Math.abs(newVy) + 0.1;
            newY = radius + 1;
          } else if (newY + radius >= containerSize) {
            newVy = -Math.abs(newVy) - 0.1;
            newY = containerSize - radius - 1;
          }

          // 减少阻尼，保持更多动能
          return {
            ...bubble,
            x: newX,
            y: newY,
            vx: newVx * 0.995, // 减少阻尼
            vy: newVy * 0.995,
          };
        });

        // 检查气泡间碰撞
        for (let i = 0; i < newBubbles.length; i++) {
          for (let j = i + 1; j < newBubbles.length; j++) {
            const bubble1 = newBubbles[i];
            const bubble2 = newBubbles[j];
            
            if (checkCollision(bubble1, bubble2)) {
              handleCollision(bubble1, bubble2);
              
              // 碰撞后重新检查边界
              [bubble1, bubble2].forEach(bubble => {
                const radius = bubble.size / 2;
                bubble.x = Math.max(radius, Math.min(containerSize - radius, bubble.x));
                bubble.y = Math.max(radius, Math.min(containerSize - radius, bubble.y));
              });
            }
          }
        }

        return newBubbles;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bubbles.length]);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <GlassSurface
        width={containerSize}
        height={containerSize}
        borderRadius={24}
        className="relative overflow-hidden"
        brightness={50}
        opacity={0.95}
        blur={15}
        backgroundOpacity={0.05}
        saturation={1.5}
        style={{
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div 
          ref={containerRef}
          className="w-full h-full relative"
          style={{ width: containerSize, height: containerSize }}
        >

        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute hover:scale-105 transition-transform duration-200"
            style={{
              left: bubble.x - bubble.size / 2,
              top: bubble.y - bubble.size / 2,
              width: bubble.size,
              height: bubble.size,
            }}
          >
            <div 
              className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden shadow-lg"
              style={{ 
                background: `
                  radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 25%, rgba(255,255,255,0.85) 50%, rgba(240,240,240,0.9) 100%),
                  linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(230,230,230,0.9) 100%)
                `,
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                border: '2px solid rgba(255,255,255,0.6)',
                boxShadow: `
                  inset 0 0 20px rgba(255,255,255,0.8),
                  inset -5px -5px 15px rgba(0,0,0,0.1),
                  0 4px 20px rgba(0,0,0,0.15),
                  0 0 0 1px rgba(255,255,255,0.3)
                `,
              }}
            >
              {/* 高光效果 */}
              <div 
                className="absolute top-2 left-2 w-4 h-4 rounded-full blur-sm pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 70%, transparent 100%)'
                }}
              />
              
              <Image
                src={bubble.icon}
                alt={bubble.name}
                width={bubble.size * 0.6}
                height={bubble.size * 0.6}
                className="object-contain pointer-events-none relative z-10"
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {bubble.name}
            </div>
          </div>
        ))}
        </div>
      </GlassSurface>
    </div>
  );
};

export default TechStack;
