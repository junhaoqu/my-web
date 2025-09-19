"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";

const ProfileImage: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const draggableInstanceRef = useRef<any>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const loadAnimeJS = async () => {
      try {
        // 动态导入 anime.js
        const { createDraggable, utils } = await import('animejs');
        
        if (cardRef.current && !draggableInstanceRef.current) {
          const element = cardRef.current;
          
          // 小延迟确保DOM已完全渲染
          timeoutId = setTimeout(() => {
            if (element && !draggableInstanceRef.current) {
              // 设置初始状态
              utils.set(element, { z: 100 });
              
              // 创建拖拽功能
              const instance = createDraggable(element, {
                x: { 
                  mapTo: 'rotateY',
                  modifier: (value: number) => value * 0.5
                },
                y: { 
                  mapTo: 'z',
                  modifier: (value: number) => value * 0.2
                },
              });
              
              draggableInstanceRef.current = instance;
            }
          }, 100);
        }
      } catch (error) {
        console.error('Failed to load anime.js:', error);
      }
    };

    loadAnimeJS();
    
    // 清理函数
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (draggableInstanceRef.current) {
        try {
          if (typeof draggableInstanceRef.current.destroy === 'function') {
            draggableInstanceRef.current.destroy();
          }
        } catch (error) {
          console.error('Failed to destroy draggable instance:', error);
        }
        draggableInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="profile-card w-72 h-72 rounded-full relative cursor-grab transition-all duration-500 ease-out group"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        userSelect: 'none',
        touchAction: 'pan-y',
      }}
    >
      {/* 渐变发光效果层 - 从右上角到左下角蓝粉渐变 */}
      <div 
        className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out blur-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 107, 253, 0.8) 0%, rgba(147, 51, 234, 0.6) 50%, rgba(232, 111, 172, 0.8) 100%)',
          zIndex: -1,
          transform: 'scale(0.95)',
        }}
      />
      
      {/* 内层渐变发光 */}
      <div 
        className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out blur-md"
        style={{
          background: 'linear-gradient(135deg, rgba(141, 181, 245, 0.6) 0%, rgba(147, 51, 234, 0.4) 50%, rgba(242, 116, 179, 0.6) 100%)',
          zIndex: -1,
          transform: 'scale(0.98)',
        }}
      />
      
      {/* 微妙的外层光晕 */}
      <div 
        className="absolute -inset-3 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000 ease-in-out blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 107, 253, 0.3) 0%, rgba(147, 51, 234, 0.2) 50%, rgba(232, 111, 172, 0.3) 100%)',
          zIndex: -2,
          transform: 'scale(0.9)',
        }}
      />
      
      {/* 正面 */}
      <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden shadow-lg backface-hidden group-hover:shadow-2xl transition-all duration-500 ease-in-out">
        <Image
          src="/images/profile/Front.jpeg"
          alt="Profile Front"
          width={384}
          height={384}
          className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:brightness-110 group-hover:contrast-105"
          style={{
            objectPosition: 'center left' // 可以调节：center top, center bottom, left center, right center, 或具体像素值如 '0px -20px'
          }}
        />
      </div>
      
      {/* 背面 */}
      <div 
        className="absolute inset-0 w-full h-full rounded-full overflow-hidden shadow-lg backface-hidden group-hover:shadow-2xl transition-all duration-500 ease-in-out"
        style={{
          transform: 'rotateY(180deg)'
        }}
      >
        <Image
          src="/images/profile/Back.jpeg"
          alt="Profile Back"
          width={384}
          height={384}
          className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:brightness-110 group-hover:contrast-105"
          style={{
            objectPosition: '50% 40%' // 可以调节：center top, center bottom, left center, right center, 或具体像素值如 '0px -20px'
          }}
        />
      </div>
    </div>
  );
};

export default ProfileImage;
