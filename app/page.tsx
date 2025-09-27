
"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Macbook, { MacbookRef } from "./mac";
import Ipad, { IpadRef, IpadAsset } from "./ipad";
import Camera, { CameraRef } from "./camera";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { LayoutTextFlipDemo } from "@/components/LayoutTextFlipDemo";
import PolaroidCard from "@/components/CameraScreen/FireworkCard";
import { DraggableCardContainer } from "@/components/ui/draggable-card";
import { cn } from "@/lib/utils";
import ProfileImage from "@/components/MacScreen/ProfileImage";
import PersonalIntro from "@/components/MacScreen/PersonalIntro";
import SocialLinks from "@/components/MacScreen/SocialLinks";
import TechStack from "@/components/MacScreen/TechStack";
import WorkExperience from "@/components/MacScreen/WorkExperience";
import ProgressBar from "@/components/ProgressBar";


const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const IPAD_ASSETS: IpadAsset[] = [
  { id: "starry", videoId: "Starry_cxlzfr", imageId: "Starry_eoj8qu", label: "Starry" },
  { id: "ultramarine", videoId: "Ultramarine_gclt3x", imageId: "Ultramarine_hpnprl", label: "群青" },
  { id: "suzuki", videoId: "suzuki_xotgn1", imageId: "suzuki_zqssxs", label: "鈴木愛理" },
  { id: "eva", videoId: "eva_ek1mpo", imageId: "eva_scuwn0", label: "綾波レイ" },
  { id: "violin", videoId: "Violin_ssdwx8", imageId: "Violin_g1emwi", label: "Vilion" },
  { id: "wind", videoId: "Wind_sp9xdv", imageId: "Wind_dtzebp", label: "Wind" },
];

const POLAROID_TOTAL_WIDTH_PX = Math.round(3.483 * 96);
const POLAROID_TOTAL_HEIGHT_PX = Math.round(4.233 * 96);
const POLAROID_SCALE = 0.7;

type CameraPolaroidItem = {
  id: string;
  title: string;
  imageId: string;
  className?: string;
  imagePosition?: string;
  imageStyle?: React.CSSProperties;
};
const CAMERA_POLAROID_ITEMS: CameraPolaroidItem[] = [
  {
    id: "firework",
    title: "Firework",
    imageId: "firework1_cshymx",
    className: "absolute top-[-140px] left-[-120px] rotate-[-12deg]",
    imagePosition: "center 42%",
  },
  {
    id: "city",
    title: "City",
    imageId: "city_dqvgc3",
    className: "absolute top-[-220px] left-[-10px] rotate-[-10deg]",
    imagePosition: "center 70%",
  },
  {
    id: "art",
    title: "Art",
    imageId: "art_small_qbcxsk",
    className: "absolute top-[-160px] left-[140px] rotate-[6deg]",
    imagePosition: "35% center",
  },
  {
    id: "starTrail",
    title: "Star Trail",
    imageId: "Star_trail_small_r3zut3",
    className: "absolute top-[-60px] left-[240px] rotate-[9deg]",
    imagePosition: "center 100%",
  },
  {
    id: "street",
    title: "Street",
    imageId: "street_small_un7xsc",
    className: "absolute top-[0px] left-[120px] rotate-[-6deg]",
    imagePosition: "center 38%",
  },
  {
    id: "sunrise",
    title: "Sunrise",
    imageId: "sun_rise_small_i6dmqi",
    className: "absolute top-[40px] left-[0px] rotate-[4deg]",
    imagePosition: "center 35%",
  },
  {
    id: "nature",
    title: "Nature",
    imageId: "Natural_small_b7e3lt",
    className: "absolute top-[100px] left-[180px] rotate-[-8deg]",
    imagePosition: "center 42%",
  },
  {
    id: "mountain",
    title: "Mountain",
    imageId: "mountain_small_vnvevc",
    className: "absolute top-[140px] left-[40px] rotate-[2deg]",
    imagePosition: "center 45%",
  },
];

const buildCloudinaryImageUrl = (publicId: string) => {
  if (!cloudName) return "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
};

const buildCloudinaryVideoUrl = (publicId: string) => {
  if (!cloudName) return "";
  return `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto/${publicId}.mp4`;
};

export default function Home() {
  const router = useRouter();
  const macbookRef = useRef<MacbookRef>(null);
  const ipadRef = useRef<IpadRef>(null);
  const cameraRef = useRef<CameraRef>(null);
  const macContainerRef = useRef<HTMLDivElement>(null);
  const ipadContainerRef = useRef<HTMLDivElement>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);

  // 主题状态管理
  const [isDark, setIsDark] = useState(true);
  
  // 滚动进度状态
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [devicesHidden, setDevicesHidden] = useState(false);
  const [ipadContentVisible, setIpadContentVisible] = useState(false);
  const [cameraContentVisible, setCameraContentVisible] = useState(false);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const prevIpadVisibleRef = useRef(false);

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

  // 重置滚动位置到顶部
  useEffect(() => {
    // 页面加载时重置滚动位置
    window.scrollTo(0, 0);
    
    // 禁用浏览器的滚动恢复功能
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // 初始化主题
  useEffect(() => {
    console.log('Initializing theme...');
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 默认使用 dark 主题，除非用户明确选择了 light
    const shouldBeDark = storedTheme === 'light' ? false : true;
    
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
    // 服务器端和客户端都使用相同的默认值
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

  const selectedAsset = IPAD_ASSETS.length
    ? IPAD_ASSETS[Math.min(selectedAssetIndex, IPAD_ASSETS.length - 1)]
    : null;

  const floatingWindowWidth = 1.2*responsiveSize.ipad.width;
  const floatingWindowHeight = 1.2*responsiveSize.ipad.height;
  const floatingWindowGap = 70;
  const extraSeparation = 150;
  const ipadOffsetX = responsiveSize.mac.width / 2 + 80;
  const imageWindowOffsetX = ipadOffsetX - (floatingWindowWidth + floatingWindowGap + extraSeparation);
  const videoWindowOffsetX = imageWindowOffsetX - (floatingWindowWidth + floatingWindowGap);
  const floatingWindowTop = `calc(50% - ${floatingWindowHeight / 2}px)`;
  const floatingIntroOffset = 80;
  const floatingIntroTop = `calc(50% - ${floatingWindowHeight / 2 + floatingIntroOffset}px)`;
  const polaroidScaledHeight = Math.round(POLAROID_TOTAL_HEIGHT_PX * POLAROID_SCALE);
  const cameraHorizontalOffset = responsiveSize.mac.width / 2 + responsiveSize.camera.width + 100;
  const polaroidGap = Math.round(180 * POLAROID_SCALE);
  const polaroidBaseLeft = `calc(50% - ${cameraHorizontalOffset}px + ${responsiveSize.camera.width + polaroidGap}px)`;
  const textBaseLeft = `calc(50% - ${cameraHorizontalOffset}px + ${responsiveSize.camera.width / 2 + 300}px)`;
  const polaroidBaseTop = '10%';
  const textBaseTop = '43%';

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const totalScrollHeight = windowHeight * 7; // 7个阶段的动画（增加第7阶段）
      
      // 计算总体进度 (0 to 1)
      const overallProgress = Math.min(1, scrollTop / totalScrollHeight);
      setScrollProgress(overallProgress);
      
      // 计算当前阶段 (0-7) - 包括最后的完成状态
      const stage = Math.min(7, Math.floor(overallProgress * 8));
      setCurrentStage(stage);
      
      // 重置设备可见性（当不在第7阶段或第7阶段进度小于0.8时）
      if (overallProgress < 6/7 || (overallProgress >= 6/7 && (overallProgress - 6/7) / (1/7) <= 0.8)) {
        if (devicesHidden) {
          setDevicesHidden(false);
        }
        // 恢复设备的z-index
        if (macContainerRef.current) {
          macContainerRef.current.style.zIndex = '30';
        }
        if (ipadContainerRef.current) {
          ipadContainerRef.current.style.zIndex = '25';
        }
        if (cameraContainerRef.current) {
          cameraContainerRef.current.style.zIndex = '20';
        }
      }
      
      let nextIpadContentVisible = false;
      let nextCameraContentVisible = false;

      // 阶段1: Mac成为焦点，其他设备缩小推远 (0-14.29%)
      if (overallProgress <= 1/7) {
        const stage1Progress = overallProgress / (1/7);
        const easedProgress = stage1Progress < 0.5 
          ? 2 * stage1Progress * stage1Progress 
          : 1 - Math.pow(-2 * stage1Progress + 2, 2) / 2;
        
        // Mac动画 - 成为焦点
        macbookRef.current?.updateAnimation(easedProgress);
        
        // Mac获得焦点时，恢复默认图层顺序
        if (macContainerRef.current) {
          macContainerRef.current.style.zIndex = '30'; // Mac在中间
        }
        if (ipadContainerRef.current) {
          ipadContainerRef.current.style.zIndex = '25'; // iPad恢复默认
        }
        if (cameraContainerRef.current) {
          cameraContainerRef.current.style.zIndex = '20'; // Camera恢复默认
        }
        
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
          const blurIntensity = easedProgress > 0.4 ? 5 : 0; // 达到一定进度后保持5px模糊
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          ipadContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }

        // Camera失去焦点 - 缩小并后退
        if (cameraContainerRef.current) {
          const scale = 0.6 * (1 - easedProgress * 0.4); // 0.6 to 0.36
          const translateX = -easedProgress * 120; // 向左推远
          const blurIntensity = easedProgress > 0.4 ? 5 : 0; // 达到一定进度后保持5px模糊
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          cameraContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
      }
      // 阶段2: 回到平衡状态 (14.29-28.57%)
      else if (overallProgress <= 2/7) {
        const stage2Progress = (overallProgress - 1/7) / (1/7);
        const reverseProgress = 1 - stage2Progress;
        const easedProgress = reverseProgress < 0.5 
          ? 2 * reverseProgress * reverseProgress 
          : 1 - Math.pow(-2 * reverseProgress + 2, 2) / 2;
        
        // Mac逆向动画 - 回到初始状态
        macbookRef.current?.updateAnimation(easedProgress);
        
        // Mac从第1阶段的状态平滑回到平衡位置
        if (macContainerRef.current) {
          // 第1阶段结束时Mac状态：scale=1.4, translateY=30, blur=0px
          const startScale = 1.4;
          const startTranslateY = 30;
          const targetScale = 0.8; // 回到初始大小
          const targetTranslateY = 0; // 回到初始位置
          
          const scale = startScale + (1 - easedProgress) * (targetScale - startScale);
          const translateY = startTranslateY + (1 - easedProgress) * (targetTranslateY - startTranslateY);
          macContainerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          macContainerRef.current.style.filter = 'blur(0px)';
        }
        
        // iPad和Camera在Mac逆向阶段应该保持模糊，从第1阶段的状态平滑回到平衡位置
        if (ipadContainerRef.current) {
          // 第1阶段结束时iPad状态：scale=0.42, translateX=100, blur=5px
          const startScale = 0.42;
          const startTranslateX = 100;
          const targetScale = 0.7; // 回到初始大小
          const targetTranslateX = 0; // 回到初始位置
          
          const scale = startScale + (1 - easedProgress) * (targetScale - startScale);
          const translateX = startTranslateX + (1 - easedProgress) * (targetTranslateX - startTranslateX);
          const blurIntensity = 5; // 保持一定的模糊效果
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          ipadContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }

        if (cameraContainerRef.current) {
          // 第1阶段结束时Camera状态：scale=0.36, translateX=-120, blur=5px
          const startScale = 0.36;
          const startTranslateX = -120;
          const targetScale = 0.6; // 回到初始大小
          const targetTranslateX = 0; // 回到初始位置
          
          const scale = startScale + (1 - easedProgress) * (targetScale - startScale);
          const translateX = startTranslateX + (1 - easedProgress) * (targetTranslateX - startTranslateX);
          const blurIntensity = 5; // 保持一定的模糊效果
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          cameraContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }

        
      }
      // 阶段3: iPad成为焦点 (28.57-42.86%)
      else if (overallProgress <= 3/7) {
        const stage3Progress = (overallProgress - 2/7) / (1/7);
        const easedProgress = stage3Progress < 0.5 
          ? 2 * stage3Progress * stage3Progress 
          : 1 - Math.pow(-2 * stage3Progress + 2, 2) / 2;
        
        // iPad获得焦点并打开
        ipadRef.current?.updateAnimation(easedProgress);

        nextIpadContentVisible = stage3Progress >= 0.7;
        
        // iPad获得焦点时，调整图层顺序
        if (ipadContainerRef.current) {
          ipadContainerRef.current.style.zIndex = '45'; // iPad在最上层
        }
        if (macContainerRef.current) {
          macContainerRef.current.style.zIndex = '30'; // Mac在中间
        }
        if (cameraContainerRef.current) {
          cameraContainerRef.current.style.zIndex = '20'; // Camera在底层
        }
        
        // Mac失去焦点 - 从第2阶段结束位置平滑过渡
        if (macContainerRef.current) {
          // 第2阶段结束时Mac状态：scale=0.8, translateX=0, blur=0px
          const startScale = 0.8;
          const startTranslateX = 0;
          const targetScale = 0.4;
          const targetTranslateX = -150;
          
          const scale = startScale + easedProgress * (targetScale - startScale); // 从0.8平滑到0.4
          const translateX = startTranslateX + easedProgress * (targetTranslateX - startTranslateX); // 从0平滑到-150
          const blurIntensity = 5; // 保持模糊效果，和第5阶段一样
          macContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          macContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
        
        // iPad获得焦点 - 从第2阶段结束位置平滑过渡
        if (ipadContainerRef.current) {
          // 第2阶段结束时iPad的状态：scale=0.7, translateX=0, blur=5px
          const startScale = 0.7;
          const startTranslateX = 0;
          const targetScale = 1.4;
          const targetTranslateX = -50;
          const targetTranslateY = 20;
          
          const scale = startScale + easedProgress * (targetScale - startScale); // 从0.7平滑到1.4
          const translateX = startTranslateX + easedProgress * (targetTranslateX - startTranslateX); // 从0平滑到-50
          const translateY = easedProgress * targetTranslateY; // 从0到20
          const blurIntensity = Math.max(0, 5 * (1 - easedProgress * 2)); // 从5px平滑到0px
          
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;
          ipadContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }

        // Camera也失去焦点 - 从第2阶段结束位置平滑过渡
        if (cameraContainerRef.current) {
          // 第2阶段结束时Camera的状态：scale=0.6, translateX=0, blur=5px
          const startScale = 0.6;
          const startTranslateX = 0;
          const targetScale = 0.3;
          const targetTranslateX = -200; // 向左推远
          
          const scale = startScale + easedProgress * (targetScale - startScale); // 从0.6平滑到0.3
          const translateX = startTranslateX + easedProgress * (targetTranslateX - startTranslateX); // 从0平滑到-200
          const blurIntensity = 5; // 保持5px模糊
          
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          cameraContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
      }
      // 阶段4: 回到平衡状态 (42.86-57.14%)
      else if (overallProgress <= 4/7) {
        const stage4Progress = (overallProgress - 3/7) / (1/7);
        const reverseProgress = 1 - stage4Progress;
        const easedProgress = reverseProgress < 0.5 
          ? 2 * reverseProgress * reverseProgress 
          : 1 - Math.pow(-2 * reverseProgress + 2, 2) / 2;
        
        // iPad逆向动画 - 回到初始状态
        ipadRef.current?.updateAnimation(easedProgress);
        
        // 阶段4回到平衡状态时，恢复默认图层顺序
        if (macContainerRef.current) {
          macContainerRef.current.style.zIndex = '30';
        }
        if (ipadContainerRef.current) {
          ipadContainerRef.current.style.zIndex = '25';
        }
        if (cameraContainerRef.current) {
          cameraContainerRef.current.style.zIndex = '20';
        }
        
        // Mac在iPad逆向阶段应该保持模糊，从第3阶段的状态平滑回到平衡位置
        if (macContainerRef.current) {
          // 第3阶段结束时Mac状态：scale=0.4, translateX=-150, blur=5px
          const startScale = 0.4;
          const startTranslateX = -150;
          const targetScale = 0.8; // 回到初始大小
          const targetTranslateX = 0; // 回到中心位置
          
          const scale = startScale + (1 - easedProgress) * (targetScale - startScale);
          const translateX = startTranslateX + (1 - easedProgress) * (targetTranslateX - startTranslateX);
          const blurIntensity = 5; // 保持模糊效果
          macContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          macContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
        
        // iPad回到初始大小 - 从第3阶段的状态平滑回到平衡位置
        if (ipadContainerRef.current) {
          // 第3阶段结束时iPad状态：scale=1.4, translateX=-50, translateY=20, blur=0px
          const startScale = 1.4;
          const startTranslateX = -50;
          const startTranslateY = 20;
          const targetScale = 0.7; // 回到初始大小
          const targetTranslateX = 0; // 回到初始位置
          const targetTranslateY = 0; // 回到初始位置
          
          const scale = startScale + (1 - easedProgress) * (targetScale - startScale);
          const translateX = startTranslateX + (1 - easedProgress) * (targetTranslateX - startTranslateX);
          const translateY = startTranslateY + (1 - easedProgress) * (targetTranslateY - startTranslateY);
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;
          ipadContainerRef.current.style.filter = 'blur(0px)';
        }

        // Camera在iPad逆向阶段应该保持模糊，从第3阶段的状态平滑回到平衡位置
        if (cameraContainerRef.current) {
          // 第3阶段结束时Camera状态：scale=0.3, translateX=-200, blur=5px
          const startScale = 0.3;
          const startTranslateX = -200;
          const targetScale = 0.4; // 从0.6改为0.4，为焦点时的放大做准备
          const targetTranslateX = 0; // 回到初始位置
          
          const scale = startScale + (1 - easedProgress) * (targetScale - startScale);
          const translateX = startTranslateX + (1 - easedProgress) * (targetTranslateX - startTranslateX);
          const blurIntensity = 5; // 保持模糊效果
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          cameraContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
      }
      // 阶段5: Camera成为焦点 (57.14-71.43%)
      else if (overallProgress <= 5/7) {
        const stage5Progress = (overallProgress - 4/7) / (1/7);
        const easedProgress = stage5Progress < 0.5 
          ? 2 * stage5Progress * stage5Progress 
          : 1 - Math.pow(-2 * stage5Progress + 2, 2) / 2;
        
        // Camera获得焦点并激活
        cameraRef.current?.updateAnimation(easedProgress);
        nextCameraContentVisible = stage5Progress >= 0.45;
        
        // Camera获得焦点时，调整图层顺序
        if (cameraContainerRef.current) {
          cameraContainerRef.current.style.zIndex = '45'; // Camera在最上层
        }
        if (macContainerRef.current) {
          macContainerRef.current.style.zIndex = '30'; // Mac在中间
        }
        if (ipadContainerRef.current) {
          ipadContainerRef.current.style.zIndex = '25'; // iPad在底层
        }
        
        // Mac失去焦点 - 从第4阶段结束位置平滑过渡
        if (macContainerRef.current) {
          // 第4阶段结束时Mac的状态：scale=0.8, translateX=0, blur=5px
          const startScale = 0.8;
          const targetScale = 0.2;
          
          const scale = startScale + easedProgress * (targetScale - startScale); // 从0.8平滑到0.2
          const translateX = 0; // 不移动，保持在中心位置
          const blurIntensity = Math.max(5, 5 + easedProgress * 0); // 保持5px模糊
          macContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          macContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
        
        // iPad失去焦点 - 从第4阶段结束位置平滑过渡
        if (ipadContainerRef.current) {
          // 第4阶段结束时iPad的状态：scale=0.7, translateX=0, blur=5px
          const startScale = 0.7;
          const targetScale = 0.42;
          const targetTranslateX = 150; // 向右推远
          
          const scale = startScale + easedProgress * (targetScale - startScale); // 从0.7平滑到0.42
          const translateX = easedProgress * targetTranslateX; // 从0平滑到150
          const blurIntensity = Math.max(5, 5 + easedProgress * 0); // 保持5px模糊
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          ipadContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }

        // Camera获得焦点 - 从第4阶段结束位置平滑过渡
        if (cameraContainerRef.current) {
          // 第4阶段结束时Camera的状态：scale=0.4, translateX=0, blur=5px
          const startScale = 0.4; // 从0.6改为0.4
          const targetScale = 0.6; // 焦点时放大到0.6
          const targetTranslateX = -40; // 轻微向中心移动
          const targetTranslateY = 20; // 轻微向上
          
          const scale = startScale + easedProgress * (targetScale - startScale); // 从0.4平滑到0.6
          const translateX = easedProgress * targetTranslateX; // 从0平滑到-40
          const translateY = easedProgress * targetTranslateY; // 从0平滑到20
          const blurIntensity = Math.max(0, 5 * (1 - easedProgress * 2)); // 从5px平滑到0px
          
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;
          cameraContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
      }
      // 阶段6: 回到平衡状态 (71.43-85.71%)
      else if (overallProgress <= 6/7) {
        const stage6Progress = (overallProgress - 5/7) / (1/7);
        const reverseProgress = 1 - stage6Progress;
        const easedProgress = reverseProgress < 0.5 
          ? 2 * reverseProgress * reverseProgress 
          : 1 - Math.pow(-2 * reverseProgress + 2, 2) / 2;
        
        // Camera逆向动画 - 回到初始状态
        cameraRef.current?.updateAnimation(easedProgress);
        
        // 阶段6回到平衡状态时，恢复默认图层顺序
        if (macContainerRef.current) {
          macContainerRef.current.style.zIndex = '30';
        }
        if (ipadContainerRef.current) {
          ipadContainerRef.current.style.zIndex = '25';
        }
        if (cameraContainerRef.current) {
          cameraContainerRef.current.style.zIndex = '20';
        }
        
        // Mac在Camera逆向阶段应该保持模糊，从第5阶段的状态平滑回到平衡位置
        if (macContainerRef.current) {
          // 第5阶段结束时Mac状态：scale=0.2, translateX=0, blur=5px
          const startScale = 0.2;
          const targetScale = 0.8; // 回到初始大小
          
          const scale = startScale + (1 - easedProgress) * (targetScale - startScale);
          const translateX = 0; // 不移动，保持在中心位置
          const blurIntensity = 5; // 保持模糊效果
          macContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          macContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }
        
        // iPad在Camera逆向阶段应该保持模糊，从第5阶段的状态平滑回到平衡位置
        if (ipadContainerRef.current) {
          // 第5阶段结束时iPad状态：scale=0.42, translateX=150, blur=5px
          const startScale = 0.42;
          const startTranslateX = 150;
          const targetScale = 0.7; // 回到初始大小
          const targetTranslateX = 0; // 回到初始位置
          
          const scale = startScale + (1 - easedProgress) * (targetScale - startScale);
          const translateX = startTranslateX + (1 - easedProgress) * (targetTranslateX - startTranslateX);
          const blurIntensity = 5; // 保持模糊效果
          ipadContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px)`;
          ipadContainerRef.current.style.filter = `blur(${blurIntensity}px)`;
        }

        // Camera回到初始状态，从第5阶段的状态平滑回到平衡位置
        if (cameraContainerRef.current) {
          // 第5阶段结束时Camera状态：scale=0.6, translateX=-40, translateY=20, blur=0px
          const startScale = 0.6; // 从0.8改为0.6，与阶段5的调整保持一致
          const startTranslateX = -40;
          const startTranslateY = 20;
          const targetScale = 0.4; // 从0.6改为0.4，回到第4阶段结束时的大小
          const targetTranslateX = 0; // 回到初始位置
          const targetTranslateY = 0; // 回到初始位置
          
          const scale = startScale + (1 - easedProgress) * (targetScale - startScale);
          const translateX = startTranslateX + (1 - easedProgress) * (targetTranslateX - startTranslateX);
          const translateY = startTranslateY + (1 - easedProgress) * (targetTranslateY - startTranslateY);
          cameraContainerRef.current.style.transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;
          cameraContainerRef.current.style.filter = 'blur(0px)';
        }

        nextCameraContentVisible = false;
      }
      // 阶段7: 所有设备模糊并向上移动离开画面 (85.71-100%)
      else {
        const stage7Progress = (overallProgress - 6/7) / (1/7);
        const easedProgress = stage7Progress < 0.5 
          ? 2 * stage7Progress * stage7Progress 
          : 1 - Math.pow(-2 * stage7Progress + 2, 2) / 2;
        
        // 所有设备逐渐模糊并开始向上移动
        const baseBlur = 5;
        const additionalBlur = easedProgress * 15; // 额外增加15px模糊，增强消失效果
        const totalBlur = baseBlur + additionalBlur;
        
        // 垂直偏移 - 向上移动直到完全离开画面
        const moveUpDistance = easedProgress * 2200; // 向上移动2200px，确保完全移出视口
        const scrollOffset = -moveUpDistance; // 负值表示向上移动
        
        // Mac模糊并向上移动离开画面
        if (macContainerRef.current) {
          const scale = 0.8 * (1 - easedProgress * 0.5); // 更明显的缩小效果
          const opacity = 1 - easedProgress * 0.3; // 轻微透明度变化
          macContainerRef.current.style.transform = `scale(${scale}) translateY(${scrollOffset}px)`;
          macContainerRef.current.style.filter = `blur(${totalBlur}px)`;
          macContainerRef.current.style.opacity = `${opacity}`;
          macContainerRef.current.style.position = 'fixed';
          
          // 当设备完全移出画面后隐藏
          if (easedProgress > 0.8) {
            macContainerRef.current.style.zIndex = '-1';
          }
        }
        
        // iPad模糊并向上移动离开画面
        if (ipadContainerRef.current) {
          const scale = 0.7 * (1 - easedProgress * 0.5); // 更明显的缩小效果
          const opacity = 1 - easedProgress * 0.3; // 轻微透明度变化
          ipadContainerRef.current.style.transform = `scale(${scale}) translateY(${scrollOffset}px)`;
          ipadContainerRef.current.style.filter = `blur(${totalBlur}px)`;
          ipadContainerRef.current.style.opacity = `${opacity}`;
          ipadContainerRef.current.style.position = 'fixed';
          
          // 当设备完全移出画面后隐藏
          if (easedProgress > 0.8) {
            ipadContainerRef.current.style.zIndex = '-1';
          }
        }

        // Camera模糊并向上移动离开画面
        if (cameraContainerRef.current) {
          const scale = 0.4 * (1 - easedProgress * 0.5); // 从0.6改为0.4，与stage 6结束时的大小保持一致
          const opacity = 1 - easedProgress * 0.3; // 轻微透明度变化
          cameraContainerRef.current.style.transform = `scale(${scale}) translateY(${scrollOffset}px)`;
          cameraContainerRef.current.style.filter = `blur(${totalBlur}px)`;
          cameraContainerRef.current.style.opacity = `${opacity}`;
          cameraContainerRef.current.style.position = 'fixed';
          
          // 当设备完全移出画面后隐藏
          if (easedProgress > 0.8) {
            cameraContainerRef.current.style.zIndex = '-1';
            if (!devicesHidden) {
              setDevicesHidden(true);
            }
          }
        }

        nextCameraContentVisible = false;
      }

      setIpadContentVisible((prev) =>
        prev === nextIpadContentVisible ? prev : nextIpadContentVisible
      );
      setCameraContentVisible((prev) =>
        prev === nextCameraContentVisible ? prev : nextCameraContentVisible
      );
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // 移除 devicesHidden 依赖，避免无限循环

  useEffect(() => {
    if (ipadContentVisible && !prevIpadVisibleRef.current) {
      setSelectedAssetIndex(0);
    }
    prevIpadVisibleRef.current = ipadContentVisible;
  }, [ipadContentVisible]);

  return (
    <AuroraBackground className="relative min-h-[800vh]">
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

      {/* 固定的标题 - 滚动时消失 */}
      {scrollProgress <= 0.05 && (
        <motion.div 
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="fixed top-35 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none"
          style={{
            color: 'var(--text-primary)'
          }}
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Capture, Code, Create!
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Scroll to see how！
          </p>
        </motion.div>
      )}
      
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
      
      {/* 个人信息组件 - 当Mac完全打开时显示 */}
      <AnimatePresence>
        {currentStage === 1 && (
          <>
            {/* 左侧组件 */}
            <motion.div
              key="left-components"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4, delay: 0 }}
              className="fixed top-4/9 -translate-y-1/2 z-40 w-80 space-y-6"
              style={{
                left: `calc(50% - ${responsiveSize.mac.width / 2 + 320 + 120}px)` // 参考Camera的定位方式，320是组件宽度，150是间距
              }}
            >
              {/* Profile Image */}
              <div className="flex justify-center">
                <ProfileImage />
              </div>
              
              {/* Personal Intro */}
              <PersonalIntro 
                onContactClick={() => {
                  router.push('/project');
                }}
              />
            </motion.div>

            {/* 右侧组件 */}
            <motion.div
              key="right-components"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.4, delay: 0 }}
              className="fixed top-4/9 -translate-y-1/2 z-40 w-80 space-y-6"
              style={{
                left: `calc(50% + ${responsiveSize.mac.width / 2 + 120}px)` // 参考iPad的定位方式，150是间距
              }}
            >
              {/* Social Links - 单独向下偏移 */}
              <div style={{ transform: 'translateY(20px)' }}>
                <SocialLinks />
              </div>
              
              {/* Tech Stack */}
              <TechStack />
              
              {/* Work Experience */}
              <WorkExperience />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cameraContentVisible && (
          <>
            <motion.div
              key="camera-polaroids"
              initial={{ opacity: 0, scale: 0.92, x: 60 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.92, x: 60 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed z-[78] pointer-events-none"
              style={{
                left: polaroidBaseLeft,
                top: polaroidBaseTop,
                transform: "translateY(-50%)",
              }}
            >
              <DraggableCardContainer className="relative flex h-[460px] w-[520px] items-center justify-center overflow-visible">
                {CAMERA_POLAROID_ITEMS.map((item, index) => (
                  <PolaroidCard
                    key={`polaroid-${item.id}`}
                    imageUrl={buildCloudinaryImageUrl(item.imageId)}
                    title={item.title}
                    imagePosition={item.imagePosition}
                    imageStyle={item.imageStyle}
                    scale={POLAROID_SCALE}
                    className={cn("pointer-events-auto", item.className)}
                    style={{ zIndex: 2 + index }}
                  />
                ))}
              </DraggableCardContainer>
            </motion.div>

            <motion.div
              key="camera-polaroid-text"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed z-[30] flex flex-col items-center text-center"
              style={{
                left: textBaseLeft,
                top: textBaseTop,
                transform: "translate(-50%, -50%)",
              }}
            >
              <p
                className="whitespace-pre-line text-5xl font-semibold leading-tight md:text-6xl"
                style={{ color: isDark ? "#ffffff" : "#252d38ff" }}
              >
                Capturing Moments,{"\n"}Creating Worlds.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/photo")}
                className={cn(
                  "mt-3 rounded-full px-7 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_12px_24px_rgba(15,23,42,0.35)] transition-colors",
                  isDark
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-[#252d38ff] text-white hover:bg-neutral-800"
                )}
              >
                Explore
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ipadContentVisible && selectedAsset && (
          <>
            <motion.div
              key="ipad-intro-text"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed z-[78] text-left"
              style={{
                left: `calc(50% + ${videoWindowOffsetX}px)`,
                top: floatingIntroTop,
                width: 'max-content',
                pointerEvents: 'none',
              }}
            >
              <LayoutTextFlipDemo isDark={isDark} />
            </motion.div>

            <motion.div
              key="ipad-video-window"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed overflow-hidden rounded-2xl shadow-2xl"
              style={{
                left: `calc(50% + ${videoWindowOffsetX}px)`,
                top: floatingWindowTop,
                width: `${floatingWindowWidth}px`,
                height: `${floatingWindowHeight}px`,
                background: isDark ? "rgba(8,11,17,0.85)" : "rgba(248,250,252,0.92)",
                border: isDark
                  ? "1px solid rgba(148,163,184,0.18)"
                  : "1px solid rgba(100,116,139,0.18)",
                backdropFilter: "blur(12px)",
                zIndex: 80,
              }}
            >
              <video
                key={selectedAsset.videoId}
                src={buildCloudinaryVideoUrl(selectedAsset.videoId)}
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted={false}
                controls
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>

            <motion.div
              key="ipad-image-window"
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed overflow-hidden"
              style={{
                left: `calc(50% + ${imageWindowOffsetX}px)`,
                top: floatingWindowTop,
                width: `${floatingWindowWidth}px`,
                height: `${floatingWindowHeight}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                zIndex: 80,
              }}
            >
              <img
                key={selectedAsset.imageId}
                src={buildCloudinaryImageUrl(selectedAsset.imageId)}
                alt={selectedAsset.label || selectedAsset.id}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
        <Ipad
          ref={ipadRef}
          assets={IPAD_ASSETS}
          showContent={ipadContentVisible}
          isDark={isDark}
          selectedIndex={selectedAssetIndex}
          onSelect={setSelectedAssetIndex}
        />
      </div>

      {/* 滚动区域 - 提供滚动空间 */}
      <div className="h-[800vh] relative">
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
        {/* TextHoverEffect组件 - 在设备移出后显示 */}
        <div 
          className="h-[40rem] flex items-center justify-center relative z-40"
          style={{
            marginTop: '0rem',
            opacity: devicesHidden ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: devicesHidden ? 'auto' : 'none',
          }}
        >
          <TextHoverEffect text="CCC" />
        </div>
        {/* ScrollReveal组件显示'When does a man die?'，在ACET之后出现 */}
        <div
          className="relative z-40 flex w-full justify-center"
          style={{
            marginTop: '-12rem',
            paddingLeft: '12vw',
            paddingRight: '12vw',
            boxSizing: 'border-box',
          }}
        >
          {scrollProgress > 0.05 && (
            <span
              className="font-semibold text-center"
              style={{
                fontSize: 'clamp(1.2rem, 2vw, 2.2rem)',
                color: isDark ? '#fff' : '#222',
                background: isDark ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.01)',
                borderRadius: '1.2rem',
                padding: '1.2rem 0',
              }}
            >
              Capture, Code, Create<br />
              From a fleeting moment captured through a lens, to lines of code meticulously crafted, 
              every project is a journey to create something new and inspiring.
            </span>
          )}
        </div>
      </div>

        

        {/* Credits in Northwell font在滚动最后显示 */}
        <div
          className="fixed left-1/2 z-50 flex w-full justify-center pointer-events-none"
          style={{
            top: '80%',
            transform: 'translateX(-50%)',
            opacity: scrollProgress > 0.98 ? 1 : 0,
            transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <span
            className={`text-3xl md:text-4xl text-center`}
            style={{
              color: isDark ? '#fff' : '#252d38ff',
              fontFamily: 'Northwell, cursive',
              letterSpacing: '0.08em',
            }}
          >
            ©7un Studio
            <br />
            By Junhao Qu
          </span>
        </div>
        <div className="h-screen" />

      {/* 液体玻璃进度条 */}
      <ProgressBar
        scrollProgress={scrollProgress}
        currentStage={currentStage}
        totalStages={8}
        isDark={isDark}
        onJumpToStage={jumpToStage}
      />
      </AuroraBackground>
  );
}
