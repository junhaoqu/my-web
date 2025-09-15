"use client";
import { useEffect, useRef } from "react";
import Macbook, { MacbookRef } from "./mac";
import Ipad, { IpadRef } from "./ipad";

export default function Home() {
  const macbookRef = useRef<MacbookRef>(null);
  const ipadRef = useRef<IpadRef>(null);
  const macContainerRef = useRef<HTMLDivElement>(null);
  const ipadContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const totalScrollHeight = windowHeight * 4; // 4个阶段的动画
      
      // 计算总体进度 (0 to 1)
      const overallProgress = Math.min(1, scrollTop / totalScrollHeight);
      
      // 阶段1: Mac成为焦点，iPad缩小推远 (0-25%)
      if (overallProgress <= 0.25) {
        const stage1Progress = overallProgress / 0.25;
        const easedProgress = stage1Progress < 0.5 
          ? 2 * stage1Progress * stage1Progress 
          : 1 - Math.pow(-2 * stage1Progress + 2, 2) / 2;
        
        // Mac动画 - 成为焦点
        macbookRef.current?.updateAnimation(easedProgress);
        
        // Mac放大并前进
        if (macContainerRef.current) {
          const scale = 0.8 + easedProgress * 0.6; // 0.8 to 1.4，更大的放大
          const translateY = easedProgress * 30;
          macContainerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          // Mac成为焦点时，移除模糊
          macContainerRef.current.style.filter = 'blur(0px)';
        }
        
        // iPad失去焦点 - 缩小并后退
        if (ipadContainerRef.current) {
          const scale = 0.7 * (1 - easedProgress * 0.4); // 0.7 to 0.42，缩小
          const translateX = easedProgress * 100; // 向右推远
          // 当Mac完全打开时(easedProgress接近1)，iPad变模糊
          const blurIntensity = easedProgress > 0.8 ? (easedProgress - 0.8) * 25 : 0;
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          ipadContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
      }
      // 阶段2: 回到平衡状态 (25-50%)
      else if (overallProgress <= 0.5) {
        const stage2Progress = (overallProgress - 0.25) / 0.25;
        const reverseProgress = 1 - stage2Progress;
        const easedProgress = reverseProgress < 0.5 
          ? 2 * reverseProgress * reverseProgress 
          : 1 - Math.pow(-2 * reverseProgress + 2, 2) / 2;
        
        // Mac逆向动画 - 回到初始状态
        macbookRef.current?.updateAnimation(easedProgress);
        
        // Mac回到初始大小
        if (macContainerRef.current) {
          const scale = 0.8 + easedProgress * 0.6;
          const translateY = easedProgress * 30;
          macContainerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          // 模糊效果逐渐消失
          const blurIntensity = easedProgress > 0.8 ? (easedProgress - 0.8) * 25 : 0;
          macContainerRef.current.style.filter = 'blur(0px)';
        }
        
        // iPad回到初始大小
        if (ipadContainerRef.current) {
          const scale = 0.7 * (1 - easedProgress * 0.4);
          const translateX = easedProgress * 100;
          const blurIntensity = easedProgress > 0.8 ? (easedProgress - 0.8) * 25 : 0;
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          ipadContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
      }
      // 阶段3: 焦点转移，iPad开始成为焦点 (50-75%)
      else if (overallProgress <= 0.75) {
        const stage3Progress = (overallProgress - 0.5) / 0.25;
        const easedProgress = stage3Progress < 0.5 
          ? 2 * stage3Progress * stage3Progress 
          : 1 - Math.pow(-2 * stage3Progress + 2, 2) / 2;
        
        // Mac失去焦点 - 缩小并后退
        macbookRef.current?.updateAnimation(0);
        
        if (macContainerRef.current) {
          const scale = 0.8 * (1 - easedProgress * 0.5); // 0.8 to 0.4，缩小
          const translateX = -easedProgress * 150; // 向左推远
          macContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          // Mac失去焦点，开始模糊
          macContainerRef.current.style.filter = 'blur(0px)';
        }
        
        // iPad开始获得焦点 - 放大并前进
        if (ipadContainerRef.current) {
          const scale = 0.7 + easedProgress * 0.4; // 0.7 to 1.1，放大
          const translateX = -easedProgress * 50; // 向中心移动
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          // iPad获得焦点，移除模糊
          ipadContainerRef.current.style.filter = 'blur(0px)';
        }
      }
      // 阶段4: iPad完全成为焦点 (75-100%)
      else {
        const stage4Progress = (overallProgress - 0.75) / 0.25;
        const easedProgress = stage4Progress < 0.5 
          ? 2 * stage4Progress * stage4Progress 
          : 1 - Math.pow(-2 * stage4Progress + 2, 2) / 2;
        
        // Mac完全失去焦点 - 极度缩小
        if (macContainerRef.current) {
          const scale = 0.4 * (1 - easedProgress * 0.5); // 0.4 to 0.2，非常小
          const translateX = -150 - easedProgress * 100; // 继续远离
          // Mac完全失去焦点，增加模糊
          const blurIntensity = easedProgress > 0.2 ? (easedProgress - 0.2) * 6.25 : 0; // 0.2后开始模糊，最大5px
          macContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          macContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
        
        // iPad完全成为焦点 - 最大化并打开
        ipadRef.current?.updateAnimation(easedProgress);
        if (ipadContainerRef.current) {
          const scale = 1.1 + easedProgress * 0.3; // 1.1 to 1.4，很大
          const translateX = -50 - easedProgress * 30; // 微调到最佳位置
          const translateY = easedProgress * 20; // 轻微上移
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;
          // iPad成为完全焦点，保持清晰
          ipadContainerRef.current.style.filter = 'blur(0px)';
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
    <main className="relative min-h-[500vh] bg-white">
      {/* 固定的标题 */}
      <div className="fixed top-10 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none">
        <h1 className="text-4xl font-bold text-black mb-4">
          Interactive Device Animation
        </h1>
        <p className="text-xl text-gray-600">Scroll to see the 4-stage animation sequence</p>
      </div>
      
      {/* Mac设备容器 - 使用固定定位以便精确控制 */}
      <div 
        ref={macContainerRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-200"
        style={{ 
          width: '32rem', 
          height: '44rem'
        }}
      >
        <Macbook ref={macbookRef} />
      </div>
      
      {/* iPad设备容器 - 初始位置在Mac右侧，较小尺寸 */}
      <div 
        ref={ipadContainerRef}
        className="fixed top-1/2 -translate-y-1/2 z-25 transition-all duration-200"
        style={{ 
          left: 'calc(50% + 20rem)', 
          width: '20rem', 
          height: '28rem',
          transform: 'scale(0.7)'
        }}
      >
        <Ipad ref={ipadRef} />
      </div>

      {/* 滚动区域 - 提供滚动空间 */}
      <div className="h-[500vh] relative">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center mt-32">
            <p className="text-lg text-gray-600">Stage 1: MacBook opens and scales up</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Stage 2: MacBook returns to initial state</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Stage 3: Camera pans to iPad</p>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Stage 4: iPad opens and scales up</p>
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