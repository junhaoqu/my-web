'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './project.css';
import { Cinzel } from 'next/font/google';

gsap.registerPlugin(ScrollTrigger);

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const cinzel = Cinzel({ weight: ['400', '600'], subsets: ['latin'] });

type CldOpts = {
  w?: number;
  h?: number;
  c?: string; // crop mode: fill, fit, crop, scale, etc.
  g?: string; // gravity: auto, face, etc.
  dpr?: 'auto' | number;
  q?: 'auto' | number;
  fl?: string; // flags, e.g. progressive:steep
};

const buildCloudinaryImageUrl = (publicId: string, opts: CldOpts = {}) => {
  if (!cloudName) return "";
  const t: string[] = [];
  t.push('f_auto');
  t.push(`q_${opts.q ?? 'auto'}`);
  if (opts.w) t.push(`w_${opts.w}`);
  if (opts.h) t.push(`h_${opts.h}`);
  if (opts.c) t.push(`c_${opts.c}`);
  if (opts.g) t.push(`g_${opts.g}`);
  if (opts.dpr) t.push(`dpr_${opts.dpr}`);
  if (opts.fl) t.push(`fl_${opts.fl}`);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${t.join(',')}/${publicId}`;
};

const ROW1_IMAGES = [
  buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1200, c: 'fit', q: 'auto' }),
  buildCloudinaryImageUrl('雪国1_vjlpu2', { w: 1200, c: 'fit', q: 'auto' }),
  buildCloudinaryImageUrl('雪国_2_f9nppy', { w: 2000, c: 'fit', q: 'auto' }),
  buildCloudinaryImageUrl('雪国_3_sjoa8x', { w: 1200, c: 'fit', q: 'auto' }),
];

const ROW2_IMAGES = [
  buildCloudinaryImageUrl('IMG_6546_akbexm', { w: 1200, c: 'fit', q: 'auto' }),
  buildCloudinaryImageUrl('4_zmvgeb', { w: 1200, c: 'fit', q: 'auto' }),
  buildCloudinaryImageUrl('3_bgeti2', { w: 1200, c: 'fit', q: 'auto' }),
  buildCloudinaryImageUrl('Violin_g1emwi', { w: 1200, c: 'fit', q: 'auto' }),
  buildCloudinaryImageUrl('Wind_dtzebp', { w: 1200, c: 'fit', q: 'auto' }),
  buildCloudinaryImageUrl('2_varvfh', { w: 1200, c: 'fit', q: 'auto' }),
  buildCloudinaryImageUrl('piano_oc2vyd', { w: 1200, c: 'fit', q: 'auto' }),

];

type RoadPhaseTile = {
  id: string;
  title: string;
  image: string;
};

type RoadPhase = {
  id: string;
  year: string;
  stage: string;
  heading: string;
  summary: string;
  tiles: RoadPhaseTile[];
};

const ROAD_PHASES: RoadPhase[] = [
  {
    id: 'phase-2025',
    year: '2025',
    stage: 'Phase III',
    heading: 'Gallery Assembly',
    summary: '入口的第一段聚焦在结构与光影的重排，形成新的时间起点。',
    tiles: [
      { id: '2025-a', title: 'Autumn Reflection', image: buildCloudinaryImageUrl('IMG_6667_zxdfar', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-b', title: 'Sky Canvas', image: buildCloudinaryImageUrl('sky_ct3nxk', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-c', title: 'Ocean Vista', image: buildCloudinaryImageUrl('sea_nxh93b', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-d', title: 'Starry Night', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-e', title: 'Ultramarine', image: buildCloudinaryImageUrl('Ultramarine_hpnprl', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-f', title: 'Snow Country I', image: buildCloudinaryImageUrl('雪国1_vjlpu2', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-g', title: 'Snow Country II', image: buildCloudinaryImageUrl('雪国_2_f9nppy', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-h', title: 'Snow Country III', image: buildCloudinaryImageUrl('雪国_3_sjoa8x', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-i', title: 'Eva', image: buildCloudinaryImageUrl('eva_scuwn0', { w: 1200, c: 'fit', q: 'auto' }) },
    ],
  },
  {
    id: 'phase-2024',
    year: '2024',
    stage: 'Phase IV',
    heading: 'Reverse Corridor',
    summary: '反向开启的通道引导观者折返，缓慢进入影像的下一重。',
    tiles: [
      { id: '2024-a', title: 'Evergreen Drift', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'fill', g: 'west' }) },
      { id: '2024-b', title: 'Resonant Steps', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'fill', g: 'east' }) },
      { id: '2024-c', title: 'Bloom Passage', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'fill', g: 'center' }) },
    ],
  },
  {
    id: 'phase-2023',
    year: '2023',
    stage: 'Phase V',
    heading: 'Continuous Road',
    summary: '第三段保持均速的节奏，将远处片段连缀成完整旅程。',
    tiles: [
      { id: '2023-a', title: 'Tidal Memory', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'crop', g: 'auto' }) },
      { id: '2023-b', title: 'Horizon Fold', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'crop', g: 'face' }) },
      { id: '2023-c', title: 'Amber Dusk', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'crop', g: 'north_east' }) },
    ],
  },
  {
    id: 'phase-2022',
    year: '2022',
    stage: 'Phase VI',
    heading: 'Descending Years',
    summary: '年份开始下沉，时间在层层叠落的斜面中重新排布。',
    tiles: [
      { id: '2022-a', title: 'Cascade Ridge', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'thumb', g: 'auto' }) },
      { id: '2022-b', title: 'Echo Shelter', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'thumb', g: 'north_west' }) },
      { id: '2022-c', title: 'Frostline Noon', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'thumb', g: 'south_east' }) },
    ],
  },
  {
    id: 'phase-2021',
    year: '2021',
    stage: 'Phase VII',
    heading: 'Delta Resonance',
    summary: '折返节点的缝隙里，画面与声响形成新的节拍。',
    tiles: [
      { id: '2021-a', title: 'Signal Bloom', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'fill', g: 'auto' }) },
      { id: '2021-b', title: 'Rhythm Cloud', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'scale' }) },
      { id: '2021-c', title: 'Violet Pulse', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'fit' }) },
    ],
  },
  {
    id: 'phase-2020',
    year: '2020',
    stage: 'Phase VIII',
    heading: 'Temporal Echo',
    summary: '终点回望，记忆的回声再次抵达脚下，完成整个循环。',
    tiles: [
      { id: '2020-a', title: 'Origin Veil', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'limit' }) },
      { id: '2020-b', title: 'Lantern Shore', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'pad' }) },
      { id: '2020-c', title: 'Quiet Current', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1400, h: 900, c: 'lpad' }) },
    ],
  },
];

const ROAD_YEARS = ROAD_PHASES.map((phase) => ({
  id: `year-${phase.year}`,
  value: phase.year,
  stage: phase.stage,
}));

const SvgWalker = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div className={['character', className].filter(Boolean).join(' ')} ref={ref}>
      <svg className="walker-svg" viewBox="0 0 3508 2481" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="body-parts">
          <circle cx="1594.5" cy="872.633" r="110.745" style={{ fill: 'white' }} />
          <g transform="matrix(1.05853,0.0452793,-0.0417497,0.976014,257.18,-106.467)">
            <path d="M1298.8,942.507L1596.36,1524.83L1001.24,1524.83L1298.8,942.507Z" style={{ fill: 'white' }} />
          </g>
          <g id="right-leg-animator" className="leg-animator">
            <g transform="matrix(-0.972762,-0.231806,0.220972,-0.927299,2178.36,3344.56)">
              <path d="M1081.76,1440.15C1081.76,1440.15 1133.28,1709.38 1133.28,1824.77C1133.28,1854.59 1110.2,1878.81 1081.76,1878.81C1053.33,1878.81 1030.24,1854.59 1030.24,1824.77C1030.24,1709.38 1081.76,1440.15 1081.76,1440.15Z" style={{ fill: 'white' }} />
            </g>
          </g>
          <g id="left-leg-animator" className="leg-animator">
            <g transform="matrix(-0.816164,0.240071,-0.280551,-0.953782,2989.69,2875.58)">
              <path d="M1081.76,1440.15C1081.76,1440.15 1133.28,1716.35 1133.28,1834.73C1133.28,1859.06 1110.2,1878.81 1081.76,1878.81C1053.33,1878.81 1030.24,1859.06 1030.24,1834.73C1030.24,1716.35 1081.76,1440.15 1081.76,1440.15Z" style={{ fill: 'white' }} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  ),
);

SvgWalker.displayName = 'SvgWalker';

const Elevator = React.forwardRef<HTMLDivElement, { className?: string; currentFloor?: string }>(
  ({ className, currentFloor }, ref) => (
    <div className={['elevator', className].filter(Boolean).join(' ')} ref={ref}>
      {/* 上方绳索与年份牌 */}
      <svg className="elevator-rope-frame elevator-rope-frame--top" viewBox="0 0 148 112" aria-hidden="true">
        <line x1="0" y1="112" x2="74" y2="0" />
        <line x1="148" y1="112" x2="74" y2="0" />
      </svg>
      <div className="elevator-top-platform">
        <div className="elevator-floor-display">{currentFloor || '2025'}</div>
      </div>

      {/* 乘客 */}
      <div className="elevator-passenger">
        <svg className="walker-svg" viewBox="0 0 3508 2481" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g id="body-parts">
            <circle cx="1594.5" cy="872.633" r="110.745" style={{ fill: 'white' }} />
            <g transform="matrix(1.05853,0.0452793,-0.0417497,0.976014,257.18,-106.467)">
              <path d="M1298.8,942.507L1596.36,1524.83L1001.24,1524.83L1298.8,942.507Z" style={{ fill: 'white' }} />
            </g>
            <g id="right-leg-animator" className="leg-animator">
              <g transform="matrix(-0.972762,-0.231806,0.220972,-0.927299,2178.36,3344.56)">
                <path d="M1081.76,1440.15C1081.76,1440.15 1133.28,1709.38 1133.28,1824.77C1133.28,1854.59 1110.2,1878.81 1081.76,1878.81C1053.33,1878.81 1030.24,1854.59 1030.24,1824.77C1030.24,1709.38 1081.76,1440.15 1081.76,1440.15Z" style={{ fill: 'white' }} />
              </g>
            </g>
            <g id="left-leg-animator" className="leg-animator">
              <g transform="matrix(-0.816164,0.240071,-0.280551,-0.953782,2989.69,2875.58)">
                <path d="M1081.76,1440.15C1081.76,1440.15 1133.28,1716.35 1133.28,1834.73C1133.28,1859.06 1110.2,1878.81 1081.76,1878.81C1053.33,1878.81 1030.24,1859.06 1030.24,1834.73C1030.24,1716.35 1081.76,1440.15 1081.76,1440.15Z" style={{ fill: 'white' }} />
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* 下方绳索与站台 */}
      <div className="elevator-bottom-platform" />
      <svg className="elevator-rope-frame elevator-rope-frame--bottom" viewBox="0 0 148 112" aria-hidden="true">
        <line x1="0" y1="0" x2="74" y2="112" />
        <line x1="148" y1="0" x2="74" y2="112" />
      </svg>
    </div>
  ),
);

Elevator.displayName = 'Elevator';

const ArtProjectPage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLElement>(null);
  const row2Ref = useRef<HTMLElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const walker1Ref = useRef<HTMLDivElement>(null);
  const walker2Ref = useRef<HTMLDivElement>(null);
  const walkerRoadRef = useRef<HTMLDivElement>(null);
  const elevatorRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLElement>(null);
  const yearRefs = useRef<Array<HTMLDivElement | null>>([]);
  const storyTrackRef = useRef<HTMLDivElement>(null);
  const trapColRef = useRef<HTMLDivElement>(null);
  const roadFrameRef = useRef<HTMLDivElement>(null);
  const yearsColumnRef = useRef<HTMLDivElement>(null);
  const yearsWrapperRef = useRef<HTMLDivElement>(null);
  const swiperRefs = useRef<SwiperClass[]>([]);
  
  const [currentFloor, setCurrentFloor] = React.useState('25');
  const [lightboxImage, setLightboxImage] = React.useState<{ src: string; title: string } | null>(null);
  const [carouselGap, setCarouselGap] = React.useState(0);

  const openLightbox = (src: string, title: string) => {
    setLightboxImage({ src, title });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const registerYearRef = (index: number) => (el: HTMLDivElement | null) => {
    yearRefs.current[index] = el;
  };

  const registerSwiperInstance = (index: number) => (instance: SwiperClass) => {
    swiperRefs.current[index] = instance;
  };

  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && lightboxImage) {
        closeLightbox();
      }
    };

    if (lightboxImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxImage]);

  useEffect(() => {
    const updateGap = () => {
      if (!rootRef.current) return;
      const styles = window.getComputedStyle(rootRef.current);
      const gapValue = parseFloat(styles.getPropertyValue('--carousel-gap')) || 0;
      setCarouselGap(gapValue);
    };

    updateGap();
    window.addEventListener('resize', updateGap);

    return () => {
      window.removeEventListener('resize', updateGap);
    };
  }, []);

  useEffect(() => {
    if (carouselGap <= 0) return;

    swiperRefs.current.forEach((instance) => {
      if (!instance || instance.destroyed) return;
      instance.params.slidesOffsetBefore = Math.max(0, 200 - carouselGap);
      instance.params.slidesOffsetAfter = Math.max(0, 200 - carouselGap);
      instance.update();
      instance.slideTo(instance.activeIndex, 0);
    });
  }, [carouselGap]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const makeWalkCycle = (walker: Element | null) => {
        if (!walker) return () => {};
        
        // 查找新的SVG小人的腿部元素 - 使用正确的ID
        const leftLeg = walker.querySelector('#left-leg-animator');
        const rightLeg = walker.querySelector('#right-leg-animator');
        
        if (!leftLeg || !rightLeg) return () => {};
        
        const rotationAngle = 45; // 增大旋转角度，让动作更明显
        
        return (progress: number) => {
          // 基于进度值计算步伐周期，让动画更流畅
          const walkCycle = (progress * 8) % 1; // 增加频率，让动作更明显
          const stepPhase = Math.sin(walkCycle * Math.PI * 2);
          
          // 计算每条腿的旋转角度
          const rightLegAngle = stepPhase * rotationAngle;
          const leftLegAngle = -stepPhase * rotationAngle; // 相反方向
          
          // 应用变换
          (rightLeg as HTMLElement).style.transform = `rotate(${rightLegAngle}deg)`;
          (leftLeg as HTMLElement).style.transform = `rotate(${leftLegAngle}deg)`;
        };
      };

      const makeElevatorIdle = (elevator: Element | null) => {
        if (!elevator) return () => {};
        const passenger = elevator.querySelector('.elevator-passenger');
        
        return (progress: number) => {
          // 电梯内的小人保持静止，只有轻微的呼吸效果
          if (passenger) {
            const breathe = Math.sin(progress * Math.PI * 0.5) * 0.5; // 轻微呼吸
            gsap.set(passenger, { scaleY: 1 + breathe * 0.02, transformOrigin: 'center bottom' });
          }
        };
      };

      // --- Corridor Animation Function (Stages 1 & 2) ---
      const createCorridorAnimation = ({
        section,
        track,
        walker,
        dir,
        endOverride,
        onEnter,
        onLeaveBack,
      }: {
        section: HTMLElement | null;
        track: HTMLElement | null;
        walker: HTMLElement | null;
        dir: 1 | -1;
        endOverride?: () => number;
        onEnter?: () => void;
        onLeaveBack?: () => void;
      }) => {
        if (!section || !track || !walker) return;
        const walkUpdate = makeWalkCycle(walker);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth + window.innerHeight * 0.5}`,
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => walkUpdate(self.progress * 60),
            onEnter: onEnter,
            onLeaveBack: onLeaveBack,
          },
        });

        const walkerWidth = () => walker.offsetWidth || 0;
        const startX = () => {
          if (dir === 1) {
            return '5vw';
          } else {
            // 第二阶段：从屏幕右外侧开始
            return `calc(100vw + 50px)`;
          }
        };
        const defaultEnd = () => (dir === 1 ? `calc(95vw - ${walkerWidth()}px)` : '5vw');

        gsap.set(walker, { position: 'fixed', bottom: '2vh', left: startX(), zIndex: 3 });

        if (dir === -1) {
          gsap.set(track, { x: () => -(track.scrollWidth - window.innerWidth) });
        }

        timeline
          .to(track, { x: () => (dir === 1 ? -(track.scrollWidth - window.innerWidth) : 0), ease: 'none' }, 0)
          .to(walker, { 
            left: () => {
              if (endOverride) {
                const overrideValue = endOverride();
                return typeof overrideValue === 'number' ? `${overrideValue}px` : overrideValue;
              }
              return defaultEnd();
            }, 
            ease: 'none' 
          }, 0);
      };

      // --- Road Animation Function (Stage 3) ---
      const createRoadAnimation = ({
        section,
        elevator,
        walker2,
        years,
        storyTrack,
        trap,
        frame,
        yearsColumn,
        yearsWrapper,
      }: {
        section: HTMLElement | null;
        elevator: HTMLElement | null;
        walker2: HTMLElement | null;
        years: Array<HTMLElement | null>;
        storyTrack: HTMLElement | null;
        trap: HTMLElement | null;
        frame: HTMLElement | null;
        yearsColumn: HTMLElement | null;
        yearsWrapper: HTMLElement | null;
      }) => {
        if (!section || !elevator || !walker2 || !frame) return;

        const yearElements = years.filter(Boolean) as HTMLElement[];
        if (yearElements.length === 0) return;

        const elevatorIdleUpdate = makeElevatorIdle(elevator);
        const ropeFrames = Array.from(
          elevator.querySelectorAll<SVGElement>('.elevator-rope-frame'),
        );

        gsap.set(elevator, { position: 'absolute', opacity: 0, zIndex: 5 });
        if (ropeFrames.length) {
          gsap.set(ropeFrames, { rotation: 0 });
        }

        const storyContainer = storyTrack?.parentElement as HTMLElement | null;
        const yearsContainer = yearsWrapper;
        const trapColumn = trap?.querySelector<HTMLElement>('.trap-road') || null;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=660%',
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // 根据滚动进度更新楼层显示
              const progress = self.progress;
              const totalFloors = ROAD_PHASES.length;
              const currentFloorIndex = Math.floor(progress * totalFloors);
              const clampedIndex = Math.min(currentFloorIndex, totalFloors - 1);
              const currentYear = ROAD_PHASES[clampedIndex]?.year || '25';
              setCurrentFloor(currentYear);
              
              // 更新电梯内小人的呼吸动画
              elevatorIdleUpdate(progress * 20);
            },
            onToggle: (self) => {
              gsap.set(elevator, { opacity: self.isActive ? 1 : 0 });
              gsap.set(walker2, { opacity: self.isActive ? 0 : 1 });
            },
          },
        });

        const gallerySlides = storyTrack
          ? Array.from(storyTrack.querySelectorAll<HTMLElement>('.year-block'))
          : [];

        const segments = Math.max(yearElements.length - 1, 1);

        const maxStoryShift = storyTrack && storyContainer
          ? Math.max(storyTrack.scrollHeight - storyContainer.clientHeight, 0)
          : 0;

        const rawStoryStep = maxStoryShift > 0
          ? maxStoryShift / segments
          : (() => {
              if (gallerySlides.length > 1) {
                return gallerySlides[1].offsetTop - gallerySlides[0].offsetTop;
              }
              return gallerySlides[0]?.offsetHeight || frame.offsetHeight * 0.22;
            })();

        const storyStep = rawStoryStep || frame.offsetHeight * 0.2;

        const maxYearShift = yearsColumn && yearsContainer
          ? Math.max(yearsColumn.scrollHeight - yearsContainer.clientHeight, 0)
          : 0;

        const rawYearStep = maxYearShift > 0
          ? maxYearShift / segments
          : (() => {
              if (yearElements.length > 1) {
                return yearElements[1].offsetTop - yearElements[0].offsetTop;
              }
              return yearElements[0]?.offsetHeight || frame.offsetHeight * 0.16;
            })();

        const yearStep = rawYearStep || frame.offsetHeight * 0.14;

        const elevatorHeight = () => elevator.offsetHeight || 1;
        const elevatorWidth = () => elevator.offsetWidth || 1;

        const viewportHeight = () => window.innerHeight || frame.offsetHeight || 1;

        const startTop = () => viewportHeight() * 0.16;
        const middleTop = () => viewportHeight() * 0.5 - elevatorHeight() * 0.5;
        const bottomPadding = () => viewportHeight() * 0.08;
        const endTop = () => viewportHeight() - elevatorHeight() - bottomPadding();

        const computeElevatorLeft = () => {
          if (trapColumn) {
            const frameRect = frame.getBoundingClientRect();
            const columnRect = trapColumn.getBoundingClientRect();
            return columnRect.left - frameRect.left;
          }
          if (trap) {
            return trap.offsetLeft;
          }
          return frame.offsetWidth * 0.18;
        };

        const computeElevatorWidth = () => {
          if (trapColumn) {
            return trapColumn.offsetWidth || frame.offsetWidth * 0.22;
          }
          if (trap) {
            return trap.offsetWidth || frame.offsetWidth * 0.22;
          }
          return frame.offsetWidth * 0.22;
        };

        const getElevatorTopForStage = (index: number, lastIndex: number) => {
          if (index === 0) return middleTop();
          if (index === lastIndex) return endTop();
          return middleTop();
        };

        const baseScale = 1;
        const maxScale = 1; // 移除缩放效果，保持电梯大小一致
        const scaleStep = 0; // 不再有缩放变化
        const getScaleForStage = () => baseScale; // 始终返回基础缩放值

        gsap.set(elevator, {
          left: () => computeElevatorLeft(),
          top: () => startTop(),
          scale: baseScale,
          rotateY: 0,
          transformOrigin: 'bottom center',
          width: () => computeElevatorWidth(),
        });

        // 设置木质支柱的动态位置，与电梯对齐
        if (trapColumn) {
          gsap.set(trapColumn, {
            left: () => computeElevatorLeft(),
            width: () => computeElevatorWidth(),
          });
        }

        gsap.set(yearElements, {
          autoAlpha: 0,
          yPercent: 40,
          filter: 'blur(14px)',
        });

        if (yearsColumn) {
          gsap.set(yearsColumn, { y: 0 });
        }

        if (storyTrack) {
          gsap.set(storyTrack, { y: 0 });
        }

        gallerySlides.forEach((slide, index) => {
          gsap.set(slide, {
            opacity: 1,
          });
        });

        yearElements.forEach((yearEl, index) => {
          const stageLabel = `stage-${index}`;
          const lastIndex = yearElements.length - 1;
          
          // 为每个阶段分配固定的时间段，避免重叠
          const segmentDuration = 100; // 每个年份段占用100%的时间
          const stageStart = index * segmentDuration;
          
          timeline.addLabel(stageLabel, `${stageStart}%`);

          // 年份出现动画
          timeline.fromTo(
            yearEl,
            { autoAlpha: 0, yPercent: 40, filter: 'blur(14px)' },
            { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 15, ease: 'power3.out' },
            stageLabel,
          );

          // 电梯动画 - 每个阶段有足够的时间
          timeline.to(
            elevator,
            {
              top: () => getElevatorTopForStage(index, lastIndex),
              // 移除缩放效果，保持电梯大小一致
              duration: 60, // 更长的持续时间让用户有时间查看
              ease: 'power2.inOut',
            },
            stageLabel,
          );

          if (ropeFrames.length) {
            const swayAngle = (index % 2 === 0 ? 1 : -1) * 3.2;
            timeline.to(
              ropeFrames,
              {
                rotation: swayAngle,
                duration: 36,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: 1,
              },
              stageLabel,
            );
          }

          // 年份轨道滚动
          if (yearsColumn && yearsContainer) {
            timeline.to(
              yearsColumn,
              {
                y: () => -yearStep * Math.min(index, segments),
                duration: 50,
                ease: 'power1.inOut',
              },
              stageLabel,
            );
          }

          // 故事轨道滚动
          if (storyTrack && gallerySlides.length > 0 && storyContainer) {
            timeline.to(
              storyTrack,
              {
                y: () => -storyStep * Math.min(index, segments),
                duration: 60,
                ease: 'power1.inOut',
              },
              stageLabel,
            );
          }

          // 画廊幻灯片过渡
          if (storyTrack && gallerySlides.length > 0) {
            const activeSlide = gallerySlides[index];
            const previousSlide = gallerySlides[index - 1];

            if (activeSlide) {
              timeline.to(
                activeSlide,
                { opacity: 1, ease: 'power2.out', duration: 20 },
                stageLabel,
              );
            }

            if (previousSlide) {
              timeline.to(
                previousSlide,
                { opacity: 1, ease: 'power1.in', duration: 15 },
                stageLabel,
              );
            }
          }

          // 年份消失动画 - 除了最后一个，在当前段的75%处开始
          if (index !== lastIndex) {
            timeline.to(
              yearEl,
              { 
                autoAlpha: 0, 
                yPercent: -32, 
                filter: 'blur(16px)', 
                duration: 25, 
                ease: 'power3.in' 
              },
              `${stageStart + 75}%`,
            );
          }
        });
      };

      // --- Initial Setup ---
      gsap.set(walker1Ref.current, { opacity: 1 });
      gsap.set([walker2Ref.current, walkerRoadRef.current], { opacity: 0 });

      // --- Create Animations ---
      createCorridorAnimation({
        section: row1Ref.current,
        track: track1Ref.current,
        walker: walker1Ref.current,
        dir: 1,
        endOverride: () => {
          // 第一阶段：让人物走出屏幕右边
          return window.innerWidth + 50;
        },
      });

      createCorridorAnimation({
        section: row2Ref.current,
        track: track2Ref.current,
        walker: walker2Ref.current,
        dir: -1,
        endOverride: () => {
          const trapRect = trapColRef.current?.getBoundingClientRect();
          const walkerWidth = walker2Ref.current?.offsetWidth || 0;
          return trapRect ? trapRect.left + trapRect.width / 2 - walkerWidth / 2 : window.innerWidth / 3;
        },
        onEnter: () => {
          gsap.set(walker1Ref.current, { opacity: 0 });
          gsap.set(walker2Ref.current, { opacity: 1 });
        },
        onLeaveBack: () => {
          gsap.set(walker1Ref.current, { opacity: 1 });
          gsap.set(walker2Ref.current, { opacity: 0 });
        },
      });

      createRoadAnimation({
        section: roadRef.current,
        elevator: elevatorRef.current,
        walker2: walker2Ref.current,
        years: yearRefs.current,
        storyTrack: storyTrackRef.current,
        trap: trapColRef.current,
        frame: roadFrameRef.current,
        yearsColumn: yearsColumnRef.current,
        yearsWrapper: yearsWrapperRef.current,
      });

    });

    return () => {
      ctx.revert();
    };
  }, []);

  const renderCard = (src: string, index: number, isRow2 = false) => {
    if (isRow2) {
      // 第二行使用特殊的列布局避免重叠
      const imageNumber = index + 1;
      
      // 根据Figma设计创建特殊的列布局
      if (imageNumber === 6 || imageNumber === 7) {
        // 第一列：图片6和7
        return null; // 这些将在专门的列容器中渲染
      } else if (imageNumber === 5 || imageNumber === 4) {
        // 第二列：图片5和4
        return null; // 这些将在专门的列容器中渲染
      } else if (imageNumber === 2 || imageNumber === 3) {
        // 第三列：图片2和3
        return null; // 这些将在专门的列容器中渲染
      } else {
        // 图片1单独渲染
        return (
          <div key={index} className={`grid-image grid-image-${imageNumber}`}>
            <img src={src} alt={`Gallery image ${imageNumber}`} loading="lazy" className="corridor-image" />
          </div>
        );
      }
    }
    
    // 第一行保持原有布局
    return (
      <div key={index} className={`image-container ${index === 0 ? 'first-image' : index === 1 ? 'second-image' : 'group-image'}`}>
        <img src={src} alt={`Gallery image ${index + 1}`} loading="lazy" className="corridor-image" />
        {index === 0 && (
          <div className="image-label">
            <span className="label-text">Moon Night</span>
          </div>
        )}
        {index === 3 && (
          <div className="image-label">
            <span className="label-text">Snow Country</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="art-project" ref={rootRef}>
      <section className="corridor" ref={row1Ref}>
        <div className="wrap">
          <div className="header">Page 1 · Gallery L→R</div>
          <div className="view">
            <div className="track" ref={track1Ref}>
              <div className={[cinzel.className, 'corridor-inscription'].join(' ')}>art</div>
              {ROW1_IMAGES.map((src, index) => renderCard(src, index))}
            </div>
            <div className="ground" />
            <SvgWalker ref={walker1Ref} />
          </div>
          <div className="footer">Scroll to walk through the first gallery.</div>
        </div>
      </section>

      <section className="corridor" ref={row2Ref}>
        <div className="wrap">
          <div className="header">Page 2 · Gallery R→L</div>
          <div className="view">
            <div className="track track-grid" ref={track2Ref}>
              {/* 第一列：图片6和7垂直排列 */}
              <div className="grid-column-1">
                <div className="grid-image grid-image-6">
                  <img src={ROW2_IMAGES[5]} alt="Gallery image 6" loading="lazy" className="corridor-image" />
                </div>
                <div className="grid-image grid-image-7">
                  <img src={ROW2_IMAGES[6]} alt="Gallery image 7" loading="lazy" className="corridor-image" />
                </div>
              </div>
              
              {/* 第二列：图片5和4同一水平线 */}
              <div className="grid-column-2">
                <div className="grid-image grid-image-5">
                  <img src={ROW2_IMAGES[4]} alt="Gallery image 5" loading="lazy" className="corridor-image" />
                </div>
                <div className="grid-image grid-image-4">
                  <img src={ROW2_IMAGES[3]} alt="Gallery image 4" loading="lazy" className="corridor-image" />
                </div>
              </div>
              
              {/* 第三列：图片2和3垂直排列 */}
              <div className="grid-column-3">
                <div className="grid-image grid-image-2">
                  <img src={ROW2_IMAGES[1]} alt="Gallery image 2" loading="lazy" className="corridor-image" />
                </div>
                <div className="grid-image grid-image-3">
                  <img src={ROW2_IMAGES[2]} alt="Gallery image 3" loading="lazy" className="corridor-image" />
                </div>
              </div>
              
              {/* 第四列：图片1大图 */}
              <div className="grid-image grid-image-1">
                <img src={ROW2_IMAGES[0]} alt="Gallery image 1" loading="lazy" className="corridor-image" />
                <div className="image-label">
                  <span className="label-text-primary">Living in Chord</span>
                  <span className="label-text-secondary">The world has kissed my soul with its pain, asking for its return in songs</span>
                </div>
              </div>
            </div>
            <div className="ground" />
            <SvgWalker ref={walker2Ref} />
          </div>
          <div className="footer">Keep scrolling — the corridor inverts.</div>
        </div>
      </section>

      <section className="road" ref={roadRef}>
        <div className="stage">
          <div className="stage-inner">
            <div className="road-column">
              <div className="road-frame" ref={roadFrameRef}>
                <div className="ground" />
                <div className="trap-col" ref={trapColRef}>
                  <div className="trap-road" />
                </div>
                <Elevator ref={elevatorRef} className="road-elevator" currentFloor={currentFloor} />
                <div className="years" ref={yearsWrapperRef}>
                  <div className="years-track" ref={yearsColumnRef}>
                    {ROAD_YEARS.map((item, index) => (
                      <div className="yr" key={item.id} ref={registerYearRef(index)}>
                        <span className="yr-value">{item.value}</span>
                        <span className="yr-stage">{item.stage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="story-column">
              <div className="story-heading">
                <span className="story-tag">年序叙事</span>
                <p>
                  滚动让人物沿道路向下走动，右侧影像廊同步滑动，记录 2025 → 2020 的推移。每一年都是一整排可横向浏览的图像组。
                </p>
              </div>
              <div className="gallery-stack">
                <div className="gallery-track" ref={storyTrackRef}>
                  {ROAD_PHASES.map((phase, phaseIndex) => (
                    <section className="year-block" key={phase.id}>
                      <header className="year-block-meta">
                        <span className="year-block-label">{phase.stage}</span>
                        <h3>{phase.year}</h3>
                        <p>{phase.heading}</p>
                        <p className="year-block-summary">{phase.summary}</p>
                      </header>
                      <div className="year-block-carousel">
                                                                        <Swiper
                          modules={[Navigation, Pagination]}
                          spaceBetween={0}
                          slidesPerView="auto"
                          centeredSlides={true}
                          slidesOffsetBefore={Math.max(0, 200 - carouselGap)}
                          slidesOffsetAfter={Math.max(0, 200 - carouselGap)}
                          onSwiper={registerSwiperInstance(phaseIndex)}
                          navigation={{
                            prevEl: `.year-${phase.year}-prev`,
                            nextEl: `.year-${phase.year}-next`,
                          }}
                          pagination={{
                            el: `.year-${phase.year}-pagination`,
                            clickable: true,
                            type: 'bullets',
                          }}
                          grabCursor={true}
                          speed={700}
                          resistanceRatio={0.85}
                          watchOverflow={true}
                          className="swiper-container"
                        >
                          {phase.tiles.map((tile, tileIndex) => (
                            <SwiperSlide key={tile.id} className="swiper-slide">
                              <article className={`art-frame ${tileIndex === 0 ? 'primary' : 'secondary'}`}>
                                <div 
                                  className="art-frame-media"
                                  onClick={() => openLightbox(tile.image, tile.title)}
                                >
                                  <img 
                                    src={tile.image} 
                                    alt={tile.title}
                                    style={{ 
                                      width: '100%', 
                                      height: '100%',
                                      objectFit: 'cover',
                                      objectPosition: 'center',
                                      display: 'block'
                                    }}
                                  />
                                </div>
                                <span className="art-frame-keel" aria-hidden="true" />
                                <span className="art-frame-shadow" aria-hidden="true" />
                                <h4>{tile.title}</h4>
                              </article>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                        <div className="swiper-navigation-container">
                          <div className="swiper-navigation-wrapper">
                            <div className={`swiper-prev year-${phase.year}-prev`}>
                              <svg aria-hidden="true" focusable="false" viewBox="0 0 40 40">
                                <path fill="currentColor" d="m27.042 4.792 1.333 1.25-13.917 13.917 13.917 13.833-1.333 1.333-15.167-15.166L27.042 4.792z"></path>
                              </svg>
                            </div>
                            <div className={`swiper-next year-${phase.year}-next`}>
                              <svg aria-hidden="true" focusable="false" viewBox="0 0 40 40">
                                <path fill="currentColor" d="m13.208 35.125-1.333-1.25 13.917-13.917L11.875 6.125l1.333-1.333 15.167 15.166Z"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="swiper-pagination-container">
                          <div className="swiper-pagination-wrapper">
                            <div className={`swiper-pagination year-${phase.year}-pagination`}></div>
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="lightbox-overlay"
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                objectPosition: 'center'
              }}
            />
            <h3 
              style={{
                color: 'white',
                marginTop: '1rem',
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}
            >
              {lightboxImage.title}
            </h3>
            <button
              onClick={closeLightbox}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                lineHeight: '1',
                padding: '0.5rem'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtProjectPage;
