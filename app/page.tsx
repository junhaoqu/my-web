"use client";
import { useEffect, useRef, useState } from "react";
import Macbook, { MacbookRef } from "./mac";
import Ipad, { IpadRef } from "./ipad";
import Camera, { CameraRef } from "./camera";

export default function Home() {
  const macbookRef = useRef<MacbookRef>(null);
  const ipadRef = useRef<IpadRef>(null);
  const cameraRef = useRef<CameraRef>(null);
  const macContainerRef = useRef<HTMLDivElement>(null);
  const ipadContainerRef = useRef<HTMLDivElement>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);

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
    <main className="relative min-h-[700vh] bg-white">
      {/* 固定的标题 */}
      <div className="fixed top-10 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none">
        <h1 className="text-4xl font-bold text-black mb-4">
          Interactive Device Animation
        </h1>
        <p className="text-xl text-gray-600">Scroll to see the 6-stage animation sequence</p>
      </div>
      
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
            <p className="text-lg text-gray-600">Stage 1: MacBook becomes focus</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Stage 2: Return to balance</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Stage 3: iPad becomes focus</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Stage 4: Return to balance</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Stage 5: Camera becomes focus</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Stage 6: Return to balance</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Animation Complete!</p>
          </div>
        </div>
      </div>
    </main>
  );
}