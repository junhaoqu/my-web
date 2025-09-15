"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";

const Desktop: React.FC = () => {
  // 预定义固定的粒子位置和动画参数，避免SSR/CSR不匹配
  const particles = useMemo(() => {
    const fixedParticles = [];
    // 使用固定的种子值生成一致的位置
    const positions = [
      { left: 15, top: 25 }, { left: 75, top: 60 }, { left: 35, top: 80 },
      { left: 90, top: 20 }, { left: 10, top: 70 }, { left: 60, top: 15 },
      { left: 45, top: 90 }, { left: 80, top: 45 }, { left: 25, top: 50 },
      { left: 95, top: 75 }, { left: 5, top: 35 }, { left: 70, top: 85 },
      { left: 55, top: 10 }, { left: 30, top: 65 }, { left: 85, top: 30 },
      { left: 40, top: 95 }, { left: 65, top: 40 }, { left: 20, top: 75 },
      { left: 90, top: 55 }, { left: 50, top: 25 }
    ];
    
    const durations = [3.5, 4.2, 3.8, 4.5, 3.2, 4.8, 3.6, 4.1, 3.9, 4.3, 3.7, 4.4, 3.3, 4.6, 3.4, 4.7, 3.1, 4.9, 3.0, 5.0];
    const delays = [0.2, 1.5, 0.8, 1.2, 0.5, 1.8, 0.3, 1.1, 0.9, 1.4, 0.6, 1.7, 0.4, 1.3, 0.7, 1.6, 0.1, 1.9, 0.0, 2.0];

    for (let i = 0; i < 20; i++) {
      fixedParticles.push({
        id: i,
        left: positions[i].left,
        top: positions[i].top,
        duration: durations[i],
        delay: delays[i]
      });
    }
    return fixedParticles;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 动态渐变背景 */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(120, 119, 198, 0.3), transparent),
            radial-gradient(ellipse at 80% 20%, rgba(255, 119, 198, 0.3), transparent),
            radial-gradient(ellipse at 40% 80%, rgba(120, 219, 255, 0.3), transparent),
            linear-gradient(135deg, #667eea 0%, #764ba2 100%)
          `
        }}
        animate={{
          background: [
            `radial-gradient(ellipse at 20% 50%, rgba(120, 119, 198, 0.3), transparent),
             radial-gradient(ellipse at 80% 20%, rgba(255, 119, 198, 0.3), transparent),
             radial-gradient(ellipse at 40% 80%, rgba(120, 219, 255, 0.3), transparent),
             linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
            `radial-gradient(ellipse at 60% 30%, rgba(120, 119, 198, 0.4), transparent),
             radial-gradient(ellipse at 30% 70%, rgba(255, 119, 198, 0.4), transparent),
             radial-gradient(ellipse at 80% 50%, rgba(120, 219, 255, 0.4), transparent),
             linear-gradient(135deg, #764ba2 0%, #667eea 100%)`,
            `radial-gradient(ellipse at 20% 50%, rgba(120, 119, 198, 0.3), transparent),
             radial-gradient(ellipse at 80% 20%, rgba(255, 119, 198, 0.3), transparent),
             radial-gradient(ellipse at 40% 80%, rgba(120, 219, 255, 0.3), transparent),
             linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 浮动粒子效果 */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Desktop;
