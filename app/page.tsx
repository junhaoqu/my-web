// app/page.tsx
"use client";
import { useEffect } from "react";
import Macbook from "./mac";
import Ipad from "./ipad";
import { scrollManager } from "./scrollManager";

export default function Home() {
  useEffect(() => {
    // 计算总滚动高度 - 4个阶段的动画
    const totalHeight = window.innerHeight * 5; // 5x viewport height for 4 stages
    
    // 启动统一的滚动跟踪
    scrollManager.startScrollTracking(totalHeight);

    return () => {
      scrollManager.destroy();
    };
  }, []);

  return (
    <main className="relative min-h-[500vh] bg-white">
      {/* 第一个视口 - Mac居中，iPad在右边 */}
      <div className="relative h-screen flex items-center justify-center bg-white overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-20">
          <h1 className="text-4xl font-bold text-black mb-4">
            Interactive Device Animation
          </h1>
          <p className="text-xl text-gray-600">Scroll to see the animation sequence</p>
        </div>
        
        {/* Mac在中间 */}
        <div id="macbook-section" className="relative z-10">
          <Macbook />
        </div>
        
        {/* iPad在右边，初始时较小且位置在右侧 */}
        <div id="ipad-section" className="absolute right-32 top-1/2 -translate-y-1/2 z-5 scale-75 opacity-70">
          <Ipad />
        </div>
      </div>

      {/* 其余滚动区域 */}
      <div className="h-[400vh] bg-gradient-to-b from-white to-gray-50">
        <div className="h-screen flex items-center justify-center">
          <p className="text-lg text-gray-600">Stage 1: MacBook Animation</p>
        </div>
        <div className="h-screen flex items-center justify-center">
          <p className="text-lg text-gray-600">Stage 2: MacBook Returns</p>
        </div>
        <div className="h-screen flex items-center justify-center">
          <p className="text-lg text-gray-600">Stage 3: Camera Focus on iPad</p>
        </div>
        <div className="h-screen flex items-center justify-center">
          <p className="text-lg text-gray-600">Stage 4: iPad Scales Up</p>
        </div>
      </div>
    </main>
  );
}