'use client';
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface CameraScrollProps {}

export interface CameraRef {
  updateAnimation: (progress: number) => void;
}

const CameraScroll = forwardRef<CameraRef, CameraScrollProps>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    updateAnimation: (progress: number) => {
      if (lensRef.current) {
        // 镜头中心黑色点闪烁效果
        const opacity = Math.sin(progress * Math.PI * 4) * 0.3 + 0.7;
        const glassElement = lensRef.current.querySelector('.lens-glass') as HTMLElement;
        if (glassElement) {
          glassElement.style.opacity = opacity.toString();
        }
      }
    }
  }));

  return (
    <div 
      ref={containerRef} 
      className="camera-container relative transform-gpu [perspective:1200px] cursor-pointer"
      style={{ 
        width: '35rem',
        height: '30rem',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 发光底层 */}
       <div 
        className="absolute rounded-2xl opacity-45 blur-xl animate-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.7), rgba(59, 130, 246, 0.5), rgba(168, 85, 247, 0.3), transparent)',
          width: '34rem',
          height: '35rem',
          top: '80%',
          left: '50%',
          transform: 'translate(-50%, -80%) translateZ(-50px) scale(1.2)',
          zIndex: -1
        }}
      ></div>
      
      <div 
        ref={bodyRef}
        className="camera-body absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform [transform-style:preserve-3d]"
        style={{ 
          width: '35rem',
          height: '30rem',
          transform: 'rotateX(0deg) rotateY(0deg)'
        }}
      >
        {/* Polaroid相机 - 基于fossheim.io设计 */}
        <div className="relative w-full h-full [transform-style:preserve-3d]">
          
          {/* 相机顶部主体 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[540px] h-[320px] rounded-t-[35px]"
               style={{
                 backgroundColor: 'var(--device-background)',
                 boxShadow: '-1px 1px 2px 3px rgba(127, 122, 125, 0.85) inset',
                 transform: 'translateZ(20px)',
                 backgroundImage: 'radial-gradient(circle, rgba(8,8,10,0.1) 0.3px, transparent 0.3px)',
                 backgroundSize: '4px 4px',
                 transition: 'background-color 0.3s ease'
               }}>

            {/* 镜头周围网格区域 */}
            <div className="absolute top-[240px] left-[50px] w-[100px] h-[60px] rounded-[8px]"
                 style={{
                   backgroundImage: 'radial-gradient(circle, #505055ff 0.4px, transparent 0.4px)',
                   backgroundSize: '2.5px 2.5px',
                   transform: 'translateZ(5px)'
                 }}></div>

            <div className="absolute top-[240px] right-[50px] w-[100px] h-[60px] rounded-[8px]"
                 style={{
                   backgroundImage: 'radial-gradient(circle, #08080A 0.4px, transparent 0.4px)',
                   backgroundSize: '2.5px 2.5px',
                   transform: 'translateZ(5px)'
                 }}></div>

            {/* 中心镜头 */}
            <div 
              ref={lensRef}
              className="absolute top-[15px] left-1/2 -translate-x-1/2 w-[210px] h-[210px] rounded-full"
              style={{
                background: `
                  radial-gradient(transparent, #000000),
                  radial-gradient(rgba(51,53,54,0.4), transparent),
                  radial-gradient(
                    #2A282B 0% 27%,
                    #070508 27.5% 28%,
                    #4E4C4F 28.5% 28.6%,
                    #2A282B 28.7% 29.3%,
                    #070508 29.5% 29.8%,
                    #4E4C4F 30% 30.5%,
                    #2A282B 30.5% 32.5%,
                    #070508 33% 33.5%,
                    #4E4C4F 34% 34.5%,
                    #2A282B 34.5% 36.5%,
                    #070508 37% 37.5%,
                    #3D3B40 38% 38.5%,
                    #908E91 39% 39.5%,
                    #3D3B40 40% 40.5%,
                    #908E91 41% 41.5%,
                    #3D3B40 42% 42.5%,
                    #908E91 43% 43.5%,
                    #3D3B40 44% 44.5%,
                    #908E91 45% 45.5%,
                    #3D3B40 46% 46.5%,
                    #908E91 47% 47.5%,
                    #3D3B40 48% 48.5%,
                    #908E91 49% 49.5%,
                    #3D3B40 50% 50.5%,
                    #908E91 51% 51.5%,
                    #3D3B40 52% 52.5%,
                    #908E91 53% 54%,
                    #241E1E 54.5% 57%,
                    #131114 57% 59%,
                    #3C3A3D 59% 60%,
                    #241E1E 60%
                  )
                `,
                backgroundSize: '350px 350px, 350px 350px, 100%',
                backgroundPosition: 'bottom -100px left, top -120px right 10px, center center',
                backgroundRepeat: 'no-repeat',
                boxShadow: '15px 55px 60px 5px #767072',
                transform: 'translateZ(30px)'
              }}>
              
              {/* 镜头玻璃 */}
              <div className="lens-glass absolute top-[70px] left-1/2 -translate-x-1/2 w-[70px] h-[70px] rounded-full"
                   style={{
                     background: `
                       radial-gradient(rgba(119, 109, 80, 0.85), transparent 40%),
                       radial-gradient(rgba(51,180,105,0.25) 13%, rgba(119,159,59,0.2) 53% 70%, rgba(119,159,59,0) 68%),
                       radial-gradient(rgba(51,180,105,0.25) 23%, rgba(51,180,105,0.2) 53% 70%, rgba(51,180,105,0) 68%),
                       radial-gradient(#2C1F28, #241921 55%, #080609 70%)
                     `,
                     backgroundSize: '100%, 190% 100%, 190% 100%, 100%',
                     backgroundRepeat: 'no-repeat',
                     backgroundPosition: 'center -10px, -30px -48px, -30px 55px, center',
                     transform: 'translateZ(10px)'
                   }}></div>
            </div>

            {/* 闪光灯 */}
            <div className="absolute left-[25px] top-[25px] w-[90px] h-[160px] rounded-[15px]"
                 style={{
                   backgroundColor: 'var(--device-background)',
                   boxShadow: '-1px -1px 1px rgba(189,184,181,0.8), -1.5px -2.1px 0.5px rgba(36,32,29,0.3), -4px 4px 3px 3px rgba(244,240,239,0.9), -5px 8px 8px rgba(171,166,170,0.6), 0.25px 1px 1px 5px rgba(62,58,56,0.4) inset, 0 -6px 1px 1px rgba(246,246,248,0.8) inset',
                   transform: 'translateZ(25px)',
                   backgroundImage: 'radial-gradient(circle, #08080A 0.5px, transparent 0.5px)',
                   backgroundSize: '3px 3px',
                   transition: 'background-color 0.3s ease'
                 }}></div>

            {/* 取景器 */}
            <div className="absolute right-[20px] top-[20px] w-[110px] h-[110px] rounded-[20px] dark:shadow-none dark:bg-[#050505]"
                 style={{
                   backgroundColor: '#1B1A18',
                   boxShadow: '0.5px 0.5px 1px 1.5px #F1EDEE, 1.5px 1px 1px 1px #3B3535 inset, 2px 2px 1px 1px #9F9E9C inset, -0.5px -2px 1.5px #9B9A98 inset, 1px 1.5px 0.5px 1px #FBF7F8',
                   transform: 'translateZ(25px)'
                 }}>
              
              {/* 取景器玻璃 */}
              <div className="absolute left-[18px] top-[18px] w-[75px] h-[75px] rounded-[20px]"
                   style={{
                     backgroundColor: 'white',
                     background: `
                       radial-gradient(rgba(236, 234, 237, 0.3) 50%, transparent 60%),
                       radial-gradient(rgba(193, 189, 186, 0.3) 50%, transparent 60%),
                       radial-gradient(#5B5758 45%, #302C2D, #131112)
                     `,
                     backgroundSize: '106% 32%, 106% 25%, 100%',
                     backgroundRepeat: 'no-repeat',
                     backgroundPosition: '-3px -7px, bottom -8px left -3px, center',
                     boxShadow: '0px 0px 1px 0px #010000 inset, 0 0 1px 1px #393836 inset, 0 0 2px 2px #010000 inset, 0 0 2px 4px #393836 inset, 0 0 1.5px 4.5px #010000 inset, -0.5px -1px 1px #5F5E5C, 0.25px 2px 2px #464543',
                     transform: 'translateZ(5px)'
                   }}>
                
                {/* 取景器内部屏幕 */}
                <div className="absolute left-[18px] top-[19px] w-[40px] h-[40px] rounded-[10px]"
                     style={{
                       background: 'linear-gradient(#ECEAED, #E2E0E1)',
                       boxShadow: '0.5px 2px 2px 0 #5E5B56, 0px 1px 3px 0px #CAC4C5, -4px 0px 5px 0px rgba(9,7,5,0.75), 1px 1px 1px 1px #F1ECF0 inset, 1.5px 1.5px 1px 1px #D1D0CE inset',
                       border: '0.5px solid rgba(9,7,5,0.75)',
                       transform: 'translateZ(3px)'
                     }}></div>
              </div>
            </div>

            {/* 红色快门按钮 */}
            <div className="absolute bottom-[30px] left-[25px] w-[57px] h-[57px] rounded-full border border-[#520000]"
                 style={{
                   background: 'radial-gradient(#DA1107 51%, #ED4B1D 53.5%)',
                   backgroundSize: '200% 200%',
                   backgroundRepeat: 'no-repeat',
                   backgroundPosition: 'bottom -10px center',
                   boxShadow: '1px 1px 1px rgba(255,255,255,0.2) inset, 0 0 2px 6px #DFDAD7, 1px 6px 10px #66514D, -1px -7.5px 1px white',
                   transform: 'translateZ(35px)'
                 }}></div>

            {/* 计时器按钮 */}
            <div className="absolute left-[135px] top-[35px] w-[23px] h-[23px] rounded-full"
                 style={{
                   background: 'radial-gradient(#E8E4E5, #DEDAD9)',
                   boxShadow: '0px 0.5px 1px 0.5px #605C5B, 1px 1px 1px #FFFBFC inset',
                   transform: 'translateZ(25px)'
                 }}></div>

            {/* 传感器 */}
            <div className="absolute left-[135px] top-[70px] w-[23px] h-[23px] rounded-full"
                 style={{
                   background: `
                     radial-gradient(#080607, transparent 50%),
                     radial-gradient(#0B090A, #211F20, #131112, #383637, #100E0F, #383637, #100E0F)
                   `,
                   backgroundSize: '60%, 100%',
                   backgroundPosition: '-6px -3px, center',
                   backgroundRepeat: 'no-repeat',
                   boxShadow: '0px 0.5px 1px 0.75px #FFFBFC, 0 -1px 1px #635F5E',
                   transform: 'translateZ(25px)'
                 }}></div>

            {/* 电源按钮 */}
            <div className="absolute right-[150px] top-[195px] w-[28px] h-[28px] rounded-full"
                 style={{
                   background: 'radial-gradient(#000000 30%, #252525, #171717, #020001, #242223, #383637)',
                   boxShadow: '0px 0.5px 1px 0.75px #C6C1C0, 0px -0.5px 0.5px 0.25px #1A1819, -5px -8px 8px 1px rgba(86,82,82,0.4)',
                   transform: 'translateZ(25px)'
                 }}></div>

            {/* 切换开关容器 */}
            <div className="absolute right-[50px] top-[145px] w-[50px] h-[22px] rounded-full"
                 style={{
                   background: 'linear-gradient(#CC7B00 10%, #B26701)',
                   boxShadow: '0.2px 0.2px 0.5px 0.5px #935723 inset, 0.5px 1px 0.75px 0.25px #FCE9D8',
                   transform: 'translateZ(25px)'
                 }}>
              
              {/* 切换按钮 */}
              <div className="absolute w-[20px] h-[20px] rounded-full left-1/2 -translate-x-1/2 top-[1px]"
                   style={{
                     background: 'radial-gradient(#FBC00A, #FFDB09)',
                     boxShadow: '0.5px 1px 0.75px 0.25px #FFED71 inset, 0px -0.5px 0.5px 0.5px #E6A11F inset, -1px 0.5px 4px 1px #964900, 0 0 8px rgba(251, 192, 10, 0.6), 0 0 16px rgba(255, 219, 9, 0.4), 0 0 24px rgba(255, 237, 113, 0.2)',
                     transform: 'translateZ(5px)',
                     animation: 'buttonGlow 2s ease-in-out infinite alternate'
                   }}></div>
            </div>
          </div>

          {/* 相机底部 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[570px] h-[165px] rounded-b-[30px] rounded-t-[11px]"
               style={{
                 backgroundColor: 'var(--device-background)',
                 boxShadow: '-1px 3px 2px 0px rgba(249,247,248, 0.65) inset',
                 transform: 'translateZ(0px)',
                 transition: 'background-color 0.3s ease'
               }}>

            {/* 左侧扬声器网格 */}
            <div className="absolute left-[20px] top-[10px] w-[80px] h-[45px] rounded-[8px]"
                 style={{
                   backgroundImage: 'radial-gradient(circle, #08080A 0.4px, transparent 0.4px)',
                   backgroundSize: '2.5px 2.5px',
                   transform: 'translateZ(5px)'
                 }}></div>

            {/* 右侧扬声器网格 */}
            <div className="absolute right-[20px] top-[10px] w-[80px] h-[45px] rounded-[8px]"
                 style={{
                   backgroundImage: 'radial-gradient(circle, #08080A 0.4px, transparent 0.4px)',
                   backgroundSize: '2.5px 2.5px',
                   transform: 'translateZ(5px)'
                 }}></div>

            {/* 照片打印机槽 */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[60px] w-[470px] h-[40px] rounded-[3px]
                           bg-[#050505]"
                 style={{
                   transform: 'translateZ(15px)'
                 }}></div>

            {/* 彩虹标签 */}
            <div className="absolute top-[100px] left-[80px] w-[40px] h-[46px]"
                 style={{
                   background: `linear-gradient(
                     #1D160F 5%,
                     #0E9EE0 5% 14%,
                     #1F211A 14% 19%,
                     #0EAE4F 19% 32%,
                     #2B2106 32% 37%,
                     #FFB404 37% 50%,
                     #2A1303 50% 55%,
                     #FE8204 55% 68%,
                     #292313 68% 80%,
                     #E02D28 80%
                   )`,
                   transform: 'translateZ(20px)'
                 }}></div>

            {/* Polaroid标志 */}
            <div className="absolute bottom-[25px] left-1/2 -translate-x-1/2 text-center"
                 style={{
                   color: 'var(--text-primary)',
                   fontFamily: '"Helvetica Neue", "Helvetica", sans-serif',
                   fontSize: '24px',
                   fontWeight: '600',
                   transform: 'translateZ(15px)',
                   transition: 'color 0.3s ease'
                 }}>
              polaroid
            </div>

            {/* 底部切换开关容器 */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[135px] h-[35px] rounded-b-[10px]"
                 style={{
                   background: `
                     radial-gradient(#353334, #4C4849 40%, transparent 70%),
                     radial-gradient(#29272A, #464445 40%, transparent 70%),
                     linear-gradient(#8B8786 10%, #5E5A5B 20% 65%, #969291)
                   `,
                   backgroundSize: '70px 70px, 70px 70px, 100% 100%',
                   backgroundRepeat: 'no-repeat',
                   backgroundPosition: 'top -25px left -40px, top -15px right -35px, top right',
                   transform: 'translateZ(25px)'
                 }}>
              
              {/* 切换开关 */}
              <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[100px] h-[20px] rounded-[10px] border-[0.5px] border-[#141011]"
                   style={{
                     background: 'linear-gradient(#747371 2%, #525055 2%, #565152, #535250)',
                     transform: 'translateZ(5px)'
                   }}>
                
                {/* 开关手柄 */}
                <div className="absolute right-0 top-[-2px] w-[20px] h-[20px] rounded-[10px] border-[0.5px] border-[rgba(133,129,128,0.15)]"
                     style={{
                       background: 'radial-gradient(#525051, #4B4746)',
                       boxShadow: '-1px 5px 5px #181619',
                       transform: 'translateZ(3px)'
                     }}></div>
              </div>
            </div>
          </div>

          {/* LCD屏幕动画效果 - 隐藏但保留引用 */}
          <motion.div
            className="camera-lcd-screen absolute opacity-0 pointer-events-none"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "bottom",
            }}
          >
          </motion.div>
        </div>
      </div>
    </div>
  );
});

CameraScroll.displayName = 'CameraScroll';

export default CameraScroll;
