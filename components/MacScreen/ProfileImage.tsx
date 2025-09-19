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
      className="profile-card w-72 h-72 rounded-full relative cursor-grab"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        userSelect: 'none',
        touchAction: 'pan-y'
      }}
    >
      {/* 正面 */}
      <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-lg backface-hidden">
        <Image
          src="/images/profile/Front.jpeg"
          alt="Profile Front"
          width={384}
          height={384}
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'center left' // 可以调节：center top, center bottom, left center, right center, 或具体像素值如 '0px -20px'
          }}
        />
      </div>
      
      {/* 背面 */}
      <div 
        className="absolute inset-0 w-full h-full rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-lg backface-hidden"
        style={{
          transform: 'rotateY(180deg)'
        }}
      >
        <Image
          src="/images/profile/Back.jpeg"
          alt="Profile Back"
          width={384}
          height={384}
          className="w-full h-full object-cover"
          style={{
            objectPosition: '50% 40%' // 可以调节：center top, center bottom, left center, right center, 或具体像素值如 '0px -20px'
          }}
        />
      </div>
    </div>
  );
};

export default ProfileImage;
