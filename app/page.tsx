"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Macbook, { MacbookRef } from "./mac";
import Ipad, { IpadRef } from "./ipad";
import Camera, { CameraRef } from "./camera";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  const macbookRef = useRef<MacbookRef>(null);
  const ipadRef = useRef<IpadRef>(null);
  const cameraRef = useRef<CameraRef>(null);
  const macContainerRef = useRef<HTMLDivElement>(null);
  const ipadContainerRef = useRef<HTMLDivElement>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);

  // 主题状态管理
  const [isDark, setIsDark] = useState(false);
  
  // 滚动进度状态
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  // 切换主题
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    console.log('Toggling theme to:', newIsDark ? 'dark' : 'light');
    
    // 使用 data-theme 属性而不是 class
    document.documentElement.setAttribute('data-theme', newIsDark ? 'dark' : 'light');
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  // 跳转到指定阶段
  const jumpToStage = (stageIndex: number) => {
    const windowHeight = window.innerHeight;
    const targetScrollY = windowHeight * stageIndex;
    
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  // 初始化主题
  useEffect(() => {
    console.log('Initializing theme...');
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 默认使用 light 主题，除非用户明确选择了 dark
    const shouldBeDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
    console.log('Theme initialized to:', shouldBeDark ? 'dark' : 'light');
  }, []);

  // 计算响应式尺寸
  const getResponsiveSize = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // 基于4251x2000的原始比例计算
    
    return {
      mac: {
        width: Math.min(vw * 0.35, 32 * 16), // 35vw或最大32rem
        height: Math.min(vh * 0.8, 44 * 16)  // 80vh或最大44rem
      },
      ipad: {
        width: Math.min(vw * 0.22, 20 * 16), // 22vw或最大20rem  
        height: Math.min(vh * 0.6, 28 * 16)  // 60vh或最大28rem
      },
      camera: {
        width: Math.min(vw * 0.25, 24 * 16), // 25vw或最大24rem
        height: Math.min(vh * 0.5, 24 * 16)  // 50vh或最大24rem - 正方形
      }
    };
  };

  // 响应式尺寸状态
  const [responsiveSize, setResponsiveSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return getResponsiveSize();
    }
    return {
      mac: { width: 32 * 16, height: 44 * 16 },
      ipad: { width: 20 * 16, height: 28 * 16 },
      camera: { width: 24 * 16, height: 24 * 16 }
    };
  });

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setResponsiveSize(getResponsiveSize());
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const totalScrollHeight = windowHeight * 6; // 6个阶段的动画
      
      // 计算总体进度 (0 to 1)
      const overallProgress = Math.min(1, scrollTop / totalScrollHeight);
      setScrollProgress(overallProgress);
      
      // 计算当前阶段 (0-6) - 包括最后的完成状态
      const stage = Math.min(6, Math.floor(overallProgress * 7));
      setCurrentStage(stage);
      
      // 阶段1: Mac成为焦点，其他设备缩小推远 (0-16.67%)
      if (overallProgress <= 1/6) {
        const stage1Progress = overallProgress / (1/6);
        const easedProgress = stage1Progress < 0.5 
          ? 2 * stage1Progress * stage1Progress 
          : 1 - Math.pow(-2 * stage1Progress + 2, 2) / 2;
        
        // Mac动画 - 成为焦点
        macbookRef.current?.updateAnimation(easedProgress);
        
        // Mac放大并前进
        if (macContainerRef.current) {
          const scale = 0.8 + easedProgress * 0.6; // 0.8 to 1.4
          const translateY = easedProgress * 30;
          macContainerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          macContainerRef.current.style.filter = 'blur(0px)';
        }
        
        // iPad失去焦点 - 缩小并后退
        if (ipadContainerRef.current) {
          const scale = 0.7 * (1 - easedProgress * 0.4); // 0.7 to 0.42
          const translateX = easedProgress * 100;
          const blurIntensity = easedProgress > 0.8 ? (easedProgress - 0.8) * 25 : 0;
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          ipadContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }

        // Camera失去焦点 - 缩小并后退
        if (cameraContainerRef.current) {
          const scale = 0.6 * (1 - easedProgress * 0.4); // 0.6 to 0.36
          const translateX = -easedProgress * 120; // 向左推远
          const blurIntensity = easedProgress > 0.8 ? (easedProgress - 0.8) * 25 : 0;
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          cameraContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
      }
      // 阶段2: 回到平衡状态 (16.67-33.33%)
      else if (overallProgress <= 2/6) {
        const stage2Progress = (overallProgress - 1/6) / (1/6);
        const reverseProgress = 1 - stage2Progress;
        const easedProgress = reverseProgress < 0.5 
          ? 2 * reverseProgress * reverseProgress 
          : 1 - Math.pow(-2 * reverseProgress + 2, 2) / 2;
        
        // Mac逆向动画 - 回到初始状态
        macbookRef.current?.updateAnimation(easedProgress);
        
        if (macContainerRef.current) {
          const scale = 0.8 + easedProgress * 0.6;
          const translateY = easedProgress * 30;
          macContainerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          macContainerRef.current.style.filter = 'blur(0px)';
        }
        
        if (ipadContainerRef.current) {
          const scale = 0.7 * (1 - easedProgress * 0.4);
          const translateX = easedProgress * 100;
          const blurIntensity = easedProgress > 0.8 ? (easedProgress - 0.8) * 25 : 0;
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          ipadContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }

        if (cameraContainerRef.current) {
          const scale = 0.6 * (1 - easedProgress * 0.4);
          const translateX = -easedProgress * 120;
          const blurIntensity = easedProgress > 0.8 ? (easedProgress - 0.8) * 25 : 0;
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          cameraContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
      }
      // 阶段3: iPad成为焦点 (33.33-50%)
      else if (overallProgress <= 3/6) {
        const stage3Progress = (overallProgress - 2/6) / (1/6);
        const easedProgress = stage3Progress < 0.5 
          ? 2 * stage3Progress * stage3Progress 
          : 1 - Math.pow(-2 * stage3Progress + 2, 2) / 2;
        
        // iPad获得焦点并打开
        ipadRef.current?.updateAnimation(easedProgress);
        
        // Mac失去焦点 - 变小
        if (macContainerRef.current) {
          const scale = 0.8 * (1 - easedProgress * 0.5); // 0.8 to 0.4
          const translateX = -easedProgress * 150;
          const blurIntensity = easedProgress > 0.6 ? (easedProgress - 0.6) * 12.5 : 0;
          macContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          macContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
        
        // iPad获得焦点
        if (ipadContainerRef.current) {
          const scale = 0.7 + easedProgress * 0.7; // 0.7 to 1.4
          const translateX = -easedProgress * 50;
          const translateY = easedProgress * 20;
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;
          ipadContainerRef.current.style.filter = 'blur(0px)';
        }

        // Camera也失去焦点 - 和Mac一样变小
        if (cameraContainerRef.current) {
          const scale = 0.6 * (1 - easedProgress * 0.5); // 0.6 to 0.3，和Mac一样变小
          const translateX = -120 - easedProgress * 80; // 向左推远
          const blurIntensity = easedProgress > 0.6 ? (easedProgress - 0.6) * 12.5 : 0;
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          cameraContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
      }
      // 阶段4: 回到平衡状态 (50-66.67%)
      else if (overallProgress <= 4/6) {
        const stage4Progress = (overallProgress - 3/6) / (1/6);
        const reverseProgress = 1 - stage4Progress;
        const easedProgress = reverseProgress < 0.5 
          ? 2 * reverseProgress * reverseProgress 
          : 1 - Math.pow(-2 * reverseProgress + 2, 2) / 2;
        
        // iPad逆向动画 - 回到初始状态
        ipadRef.current?.updateAnimation(easedProgress);
        
        // Mac回到初始大小
        if (macContainerRef.current) {
          const scale = 0.4 + (1 - easedProgress) * 0.4; // 从0.4逐渐回到0.8（初始大小）
          const translateX = 0; // 不移动，保持在中心位置
          const blurIntensity = 0; // 清晰显示
          macContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          macContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
        
        // iPad回到初始大小
        if (ipadContainerRef.current) {
          const scale = 1.4 - (1 - easedProgress) * 0.7; // 从1.4逐渐回到0.7（初始大小）
          const translateX = 0; // 回到初始位置，不偏移
          const translateY = 0; // 回到初始位置，不偏移
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;
          ipadContainerRef.current.style.filter = 'blur(0px)';
        }

        // Camera回到初始大小
        if (cameraContainerRef.current) {
          const scale = 0.3 + (1 - easedProgress) * 0.3; // 从0.3逐渐回到0.6（初始大小）
          const translateX = 0; // 回到初始位置，不偏移
          const blurIntensity = 0; // 清晰显示
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          cameraContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
      }
      // 阶段5: Camera成为焦点 (66.67-83.33%)
      else if (overallProgress <= 5/6) {
        const stage5Progress = (overallProgress - 4/6) / (1/6);
        const easedProgress = stage5Progress < 0.5 
          ? 2 * stage5Progress * stage5Progress 
          : 1 - Math.pow(-2 * stage5Progress + 2, 2) / 2;
        
        // Camera获得焦点并激活
        cameraRef.current?.updateAnimation(easedProgress);
        
        // Mac失去焦点 - 变小但不移动
        if (macContainerRef.current) {
          const scale = 0.8 * (1 - easedProgress * 0.75); // 0.8 to 0.2
          const translateX = 0; // 不移动，保持在中心位置
          const blurIntensity = easedProgress > 0.4 ? (easedProgress - 0.4) * 8.33 : 0;
          macContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          macContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
        
        // iPad失去焦点 - 变小
        if (ipadContainerRef.current) {
          const scale = 0.7 * (1 - easedProgress * 0.4); // 0.7 to 0.42
          const translateX = easedProgress * 150; // 向右推远
          const blurIntensity = easedProgress > 0.4 ? (easedProgress - 0.4) * 8.33 : 0;
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          ipadContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }

        // Camera获得焦点 - 从初始大小开始变大
        if (cameraContainerRef.current) {
          const scale = 0.6 + easedProgress * 0.6; // 从0.6（初始大小）开始变大到1.2
          const translateX = -120 + easedProgress * 80; // 向中心移动
          const translateY = easedProgress * 20; // 轻微向上
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;
          cameraContainerRef.current.style.filter = 'blur(0px)';
        }
      }
      // 阶段6: 回到平衡状态 (83.33-100%)
      else {
        const stage6Progress = (overallProgress - 5/6) / (1/6);
        const reverseProgress = 1 - stage6Progress;
        const easedProgress = reverseProgress < 0.5 
          ? 2 * reverseProgress * reverseProgress 
          : 1 - Math.pow(-2 * reverseProgress + 2, 2) / 2;
        
        // Camera逆向动画 - 回到初始状态
        cameraRef.current?.updateAnimation(easedProgress);
        
        // Mac回到初始状态 - 不移动
        if (macContainerRef.current) {
          const scale = 0.2 + (1 - easedProgress) * 0.6; // 从0.2回到0.8
          const translateX = 0; // 不移动，保持在中心位置
          const blurIntensity = 0; // 清晰显示
          macContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          macContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
        
        // iPad回到初始状态
        if (ipadContainerRef.current) {
          const scale = 0.42 + (1 - easedProgress) * 0.28; // 从0.42回到0.7
          const translateX = 0; // 回到初始位置
          const blurIntensity = 0; // 清晰显示
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          ipadContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }

        // Camera回到初始状态
        if (cameraContainerRef.current) {
          const scale = 1.2 - (1 - easedProgress) * 0.6; // 从1.2回到0.6
          const translateX = 0; // 回到初始位置
          const translateY = 0; // 回到初始位置
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;
          cameraContainerRef.current.style.filter = 'blur(0px)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AuroraBackground className="relative min-h-[700vh]">
      {/* 主题切换按钮 */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 50,
          padding: '0.75rem',
          borderRadius: '50%',
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(16px)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative w-6 h-6">
          {/* 太阳图标 */}
          <motion.svg
            className="absolute inset-0 w-6 h-6"
            fill="none"
            stroke="#fbbf24"
            strokeWidth={2}
            viewBox="0 0 24 24"
            initial={{ rotate: isDark ? 180 : 0, opacity: isDark ? 0 : 1 }}
            animate={{ rotate: isDark ? 180 : 0, opacity: isDark ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </motion.svg>
          
          {/* 月亮图标 */}
          <motion.svg
            className="absolute inset-0 w-6 h-6"
            fill="none"
            stroke="#93c5fd"
            strokeWidth={2}
            viewBox="0 0 24 24"
            initial={{ rotate: isDark ? 0 : -180, opacity: isDark ? 1 : 0 }}
            animate={{ rotate: isDark ? 0 : -180, opacity: isDark ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        </div>
      </motion.button>

      {/* 固定的标题 */}
      <motion.div 
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="fixed top-10 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none"
        style={{
          color: 'var(--text-primary)'
        }}
      >
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Interactive Device Animation
        </h1>
        <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
          Scroll to see the 6-stage animation sequence
        </p>
      </motion.div>
      
      {/* Camera设备容器 - 初始位置在Mac左侧，较小尺寸 */}
      <div 
        ref={cameraContainerRef}
        className="fixed top-1/2 -translate-y-1/2 z-20 transition-all duration-200"
        style={{ 
          left: `calc(50% - ${responsiveSize.mac.width / 2 + responsiveSize.camera.width + 100}px)`, // 基于Mac宽度动态偏移到左侧
          width: `${responsiveSize.camera.width}px`,
          height: `${responsiveSize.camera.height}px`,
          transform: 'scale(0.6)'
        }}
      >
        <Camera ref={cameraRef} />
      </div>
      
      {/* Mac设备容器 - 使用固定定位以便精确控制 */}
      <div 
        ref={macContainerRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-200"
        style={{ 
          width: `${responsiveSize.mac.width}px`,
          height: `${responsiveSize.mac.height}px`
        }}
      >
        <Macbook ref={macbookRef} />
      </div>
      
      {/* iPad设备容器 - 初始位置在Mac右侧，较小尺寸 */}
      <div 
        ref={ipadContainerRef}
        className="fixed top-1/2 -translate-y-1/2 z-25 transition-all duration-200"
        style={{ 
          left: `calc(50% + ${responsiveSize.mac.width / 2 + 80}px)`, // 基于Mac宽度动态偏移
          width: `${responsiveSize.ipad.width}px`,
          height: `${responsiveSize.ipad.height}px`,
          transform: 'scale(0.7)'
        }}
      >
        <Ipad ref={ipadRef} />
      </div>

      {/* 滚动区域 - 提供滚动空间 */}
      <div className="h-[700vh] relative">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center mt-32">
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Stage 1: MacBook becomes focus</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Stage 2: Return to balance</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Stage 3: iPad becomes focus</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Stage 4: Return to balance</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Stage 5: Camera becomes focus</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Stage 6: Return to balance</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Animation Complete!</p>
          </div>
        </div>
      </div>

      {/* 液体玻璃进度条 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div 
          className="relative flex items-center gap-4 px-6 py-3 rounded-full"
          style={{
            background: isDark 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: isDark 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: isDark
              ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
        >
          {/* 进度条背景 */}
          <div 
            className="relative w-80 h-2 rounded-full overflow-hidden"
            style={{
              background: isDark 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* 进度条填充 */}
            <div 
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${scrollProgress * 100}%`,
                background: isDark
                  ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8), rgba(236, 72, 153, 0.8))'
                  : 'linear-gradient(90deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.9), rgba(236, 72, 153, 0.9))',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
              }}
            >
              {/* 液体波动效果 */}
              <div 
                className="absolute top-0 left-0 w-full h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'liquidFlow 2s linear infinite',
                }}
              />
            </div>

            {/* 竖线分隔符 */}
            {[1, 2, 3, 4, 5, 6].map((divider) => (
              <div
                key={`divider-${divider}`}
                className="absolute top-0 w-0.5 h-full"
                style={{
                  left: `${(divider / 6) * 100}%`,
                  transform: 'translateX(-50%)',
                  background: isDark 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(0, 0, 0, 0.2)',
                  zIndex: 5,
                }}
              />
            ))}
          </div>

          {/* 阶段标记大球 - 在进度条外部 */}
          {[1, 3, 5].map((stage) => (
            <button
              key={stage}
              onClick={() => jumpToStage(stage)}
              className="absolute w-6 h-6 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center"
              style={{
                left: `${24 + (stage / 6) * 320}px`, // 直接计算像素位置：左边距24px + 进度条位置
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
                background: currentStage >= stage 
                  ? (isDark 
                      ? 'linear-gradient(145deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.8))'
                      : 'linear-gradient(145deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.7))')
                  : (isDark 
                      ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))'
                      : 'linear-gradient(145deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))'),
                border: `1px solid ${currentStage >= stage 
                  ? 'rgba(59, 130, 246, 0.4)' 
                  : (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)')}`,
                backdropFilter: 'blur(8px) saturate(150%)',
                boxShadow: currentStage >= stage
                  ? '0 2px 8px rgba(59, 130, 246, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  : `0 2px 6px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.15)'}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                zIndex: 20, // 高于进度条容器
              }}
            >
              {/* 内部高光点 */}
              <div 
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: currentStage >= stage 
                    ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2), transparent)'
                    : 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1), transparent)',
                  transform: 'translate(-1px, -1px)', // 偏移到左上角营造立体感
                }}
              />
            </button>
          ))}
          </div>

          {/* 阶段指示器 */}
          <div 
            className="flex items-center gap-2 text-sm font-medium"
            style={{
              color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
            }}
          >
            <span>Stage</span>
            <span 
              className="px-2 py-1 rounded-full text-xs"
              style={{
                background: isDark 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)',
                color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
              }}
            >
              {currentStage + 1}/7
            </span>
          </div>
        </div>
      </AuroraBackground>
  );
}