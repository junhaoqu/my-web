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
      
      // 阶段1: Mac打开并变大 (0-25%)
      if (overallProgress <= 0.25) {
        const stage1Progress = overallProgress / 0.25;
        const easedProgress = stage1Progress < 0.5 
          ? 2 * stage1Progress * stage1Progress 
          : 1 - Math.pow(-2 * stage1Progress + 2, 2) / 2;
        
        // Mac动画
        macbookRef.current?.updateAnimation(easedProgress);
        
        // Mac缩放和移动
        if (macContainerRef.current) {
          const scale = 0.8 + easedProgress * 0.4; // 0.8 to 1.2
          const translateY = easedProgress * 50;
          macContainerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }
        
        // iPad保持初始状态
        if (ipadContainerRef.current) {
          ipadContainerRef.current.style.transform = 'scale(0.5) translateX(0px)';
        }
      }
      // 阶段2: Mac回到初始状态 (25-50%)
      else if (overallProgress <= 0.5) {
        const stage2Progress = (overallProgress - 0.25) / 0.25;
        const reverseProgress = 1 - stage2Progress;
        const easedProgress = reverseProgress < 0.5 
          ? 2 * reverseProgress * reverseProgress 
          : 1 - Math.pow(-2 * reverseProgress + 2, 2) / 2;
        
        // Mac逆向动画
        macbookRef.current?.updateAnimation(easedProgress);
        
        // Mac缩放回初始
        if (macContainerRef.current) {
          const scale = 0.8 + easedProgress * 0.4;
          const translateY = easedProgress * 50;
          macContainerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }
        
        // iPad保持初始状态
        if (ipadContainerRef.current) {
          ipadContainerRef.current.style.transform = 'scale(0.5) translateX(0px)';
        }
      }
      // 阶段3: 摄像机向右移动到iPad (50-75%)
      else if (overallProgress <= 0.75) {
        const stage3Progress = (overallProgress - 0.5) / 0.25;
        const easedProgress = stage3Progress < 0.5 
          ? 2 * stage3Progress * stage3Progress 
          : 1 - Math.pow(-2 * stage3Progress + 2, 2) / 2;
        
        // Mac完全回到初始状态并移出视野
        macbookRef.current?.updateAnimation(0);
        if (macContainerRef.current) {
          const translateX = -easedProgress * 200; // 向左移动
          const scale = 0.8 * (1 - easedProgress * 0.3); // 逐渐缩小
          macContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
        }
        
        // iPad移动到中央
        if (ipadContainerRef.current) {
          const translateX = -easedProgress * 300; // 向左移动到中央
          const scale = 0.5 + easedProgress * 0.3; // 开始放大
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
        }
      }
      // 阶段4: iPad变大并打开屏幕 (75-100%)
      else {
        const stage4Progress = (overallProgress - 0.75) / 0.25;
        const easedProgress = stage4Progress < 0.5 
          ? 2 * stage4Progress * stage4Progress 
          : 1 - Math.pow(-2 * stage4Progress + 2, 2) / 2;
        
        // Mac完全移出视野
        if (macContainerRef.current) {
          macContainerRef.current.style.transform = 'scale(0.5) translateX(-200px)';
        }
        
        // iPad动画和最终缩放
        ipadRef.current?.updateAnimation(easedProgress);
        if (ipadContainerRef.current) {
          const scale = 0.8 + easedProgress * 0.4; // 0.8 to 1.2
          const translateY = easedProgress * 30;
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(-300px) translateY(${translateY}px)`;
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
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ 
          width: '32rem', // 匹配MacBook宽度
          height: '44rem' // 容纳基座22rem + 屏幕22rem
        }}
      >
        <Macbook ref={macbookRef} />
      </div>
      
      {/* iPad设备容器 - 初始位置在右边 */}
      <div 
        ref={ipadContainerRef}
        className="fixed top-1/2 -translate-y-1/2 z-5"
        style={{ 
          right: '5vw',
          width: '20rem', // 匹配iPad宽度
          height: '28rem' // 匹配iPad高度
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