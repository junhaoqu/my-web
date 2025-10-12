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
  objectPosition?: string;
  objectPositionCollapsed?: string;
  objectPositionExpanded?: string;
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
      { id: '2025-a', title: 'Grand Escape', image: buildCloudinaryImageUrl('IMG_6667_zxdfar', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-b', title: 'Above the cloud', image: buildCloudinaryImageUrl('sky_ct3nxk', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-c', title: 'Not Lonely',
        image: buildCloudinaryImageUrl('sea_nxh93b', { w: 1200, c: 'fit', q: 'auto' }),
        objectPositionCollapsed: '40% center',  // thumbnail focus
        objectPositionExpanded: 'center center' // optional override when expanded
      },
      { id: '2025-d', title: 'Moon Night', image: buildCloudinaryImageUrl('Starry_eoj8qu', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-e', title: 'Ultramarine', image: buildCloudinaryImageUrl('Ultramarine_hpnprl', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-f', title: 'Snow Country I', image: buildCloudinaryImageUrl('雪国1_vjlpu2', { w: 1200, c: 'fit', q: 'auto' }),
        objectPositionCollapsed: '28% center',  // thumbnail focus
        objectPositionExpanded: 'center center' },
      { id: '2025-g', title: 'Snow Country II', image: buildCloudinaryImageUrl('雪国_2_f9nppy', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2025-h', title: 'Snow Country III', image: buildCloudinaryImageUrl('雪国_3_sjoa8x', { w: 1200, c: 'fit', q: 'auto' }),
        objectPositionCollapsed: '32% center',
        objectPositionExpanded: 'center center'
      },
      { id: '2025-i', title: 'Rei Ayanami', image: buildCloudinaryImageUrl('eva_scuwn0', { w: 1200, c: 'fit', q: 'auto' }) },
    ],
  },
  {
    id: 'phase-2024',
    year: '2024',
    stage: 'Phase IV',
    heading: 'Reverse Corridor',
    summary: '反向开启的通道引导观者折返，缓慢进入影像的下一重。',
    tiles: [
       { id: '2024-a', title: 'Tears or Joy', image: buildCloudinaryImageUrl('未命名作品_9_xlytvt', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2024-b', title: 'Karina I', image: buildCloudinaryImageUrl('柳智敏_bpnvix', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2024-c', title: 'Karina II', image: buildCloudinaryImageUrl('IMG_6587_w5cfg6', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2024-d', title: 'Jenny', image: buildCloudinaryImageUrl('未命名作品_1_hj1wlu', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2024-e', title: 'Suzuki', image: buildCloudinaryImageUrl('IMG_6586_uvahtx', { w: 1200, c: 'fit', q: 'auto' }), objectPositionExpanded: 'center 28%' },
      { id: '2024-f', title: 'Music Dream', image: buildCloudinaryImageUrl('未命名作品_7_bnspyh', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2024-g', title: 'Wind', image: buildCloudinaryImageUrl('Wind_x5zno3', { w: 1200, c: 'fit', q: 'auto' }), objectPositionExpanded: 'center 20%', },
      {
        id: '2024-h',
        title: 'Where to go',
        image: buildCloudinaryImageUrl('IMG_6546_2_vb9q1v', { w: 1200, c: 'fit', q: 'auto' }),
        objectPosition: '20% center',
      },
      { id: '2024-i', title: 'Leon', image: buildCloudinaryImageUrl('这个杀手不太冷_j32foz', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2024-j', title: 'The Moon Black', image: buildCloudinaryImageUrl('未命名作品_8_k4e6mt', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2024-k', title: 'Green shot', image: buildCloudinaryImageUrl('未命名作品_6_ynfwwg', { w: 1200, c: 'fit', q: 'auto' }) },
    ],
  },
  {
    id: 'phase-2023',
    year: '2023',
    stage: 'Phase V',
    heading: 'Continuous Road',
    summary: '第三段保持均速的节奏，将远处片段连缀成完整旅程。',
    tiles: [
       { id: '2023-a', title: 'Howl\'s Moving Castle', image: buildCloudinaryImageUrl('哈尔的移动城堡_r5ye27', { w: 1200, c: 'fit', q: 'auto' }), 
        objectPositionCollapsed: '75% center',  // thumbnail focus
        objectPositionExpanded: 'center center' },
      { id: '2023-b', title: 'Every Step Blooms', image: buildCloudinaryImageUrl('IMG_8612_polarr_vvggls', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2023-c', title: 'Ballet on the Piano', image: buildCloudinaryImageUrl('钢琴上的芭蕾_n10ihb', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2023-d', title: 'Staring', image: buildCloudinaryImageUrl('凝视_ytuokw', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2023-e', title: 'D Major', image: buildCloudinaryImageUrl('D_major_2_vpfahx', { w: 1200, c: 'fit', q: 'auto', }), objectPosition: 'center 20%', },
      { id: '2023-f', title: 'Daisy', image: buildCloudinaryImageUrl('未命名作品_2_tf8exl', { w: 1200, c: 'fit', q: 'auto' }) , objectPosition: 'center 20%', },
      { id: '2023-g', title: 'Kirby', image: buildCloudinaryImageUrl('IMG_0452_polarr_nzefjc', { w: 1200, c: 'fit', q: 'auto' }), objectPosition: 'center 20%', },
      { id: '2023-h', title: 'Summer Train I', image: buildCloudinaryImageUrl('IMG_8209_polarr_uzsdnf', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2023-i', title: 'Summer Train II', image: buildCloudinaryImageUrl('1_oamhg5', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2023-j', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('未命名作品_3_govxex', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
    ],
  },
  {
    id: 'phase-2022',
    year: '2022',
    stage: 'Phase VI',
    heading: 'Descending Years',
    summary: '年份开始下沉，时间在层层叠落的斜面中重新排布。',
       tiles: [
       { id: '2022-a', title: 'Howl\'s Moving Castle', image: buildCloudinaryImageUrl('未命名作品_6_fspzoj', { w: 1200, c: 'fit', q: 'auto' }), 
        objectPositionCollapsed: '30% center',  // thumbnail focus
        objectPositionExpanded: 'center center' },
      { id: '2022-b', title: 'Every Step Blooms', image: buildCloudinaryImageUrl('未命名作品_12_o4kzsi', { w: 1200, c: 'fit', q: 'auto' }),},
      { id: '2022-c', title: 'Ballet on the Piano', image: buildCloudinaryImageUrl('IMG_6325_v4wobl', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2022-d', title: 'Staring', image: buildCloudinaryImageUrl('IMG_6328_svqy8l', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2022-e', title: 'D Major', image: buildCloudinaryImageUrl('未命名作品_1_qtfmsa', { w: 1200, c: 'fit', q: 'auto', }), objectPosition: 'center 20%', },
      { id: '2022-f', title: 'Daisy', image: buildCloudinaryImageUrl('IMG_5407_polarr_e40i2m', { w: 1200, c: 'fit', q: 'auto' }) , objectPosition: 'center 20%', },
      { id: '2022-g', title: 'Kirby', image: buildCloudinaryImageUrl('IMG_0452_polarr_nzefjc', { w: 1200, c: 'fit', q: 'auto' }), objectPosition: 'center 20%', },
      { id: '2022-h', title: 'Summer Train I', image: buildCloudinaryImageUrl('未命名作品_8_nc486e', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2022-i', title: 'Summer Train II', image: buildCloudinaryImageUrl('未命名作品_3_kvhmag', { w: 1200, c: 'fit', q: 'auto' }) },
      { id: '2022-j', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('未命名作品_10_xpufo2', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
      { id: '2022-k', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('未命名作品_9_m1rwbo', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
      { id: '2022-l', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('未命名作品_5_vavsq2', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
      { id: '2022-m', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('IMG_6196_h7nn8p', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
      { id: '2022-n', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('未命名作品_7_ahmgra', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
      { id: '2022-o', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('未命名作品_11_rbsiem', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
      { id: '2022-p', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('未命名作品_4_efzkcf', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
      { id: '2022-q', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('beauty_1648197988703_n9wo0t', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
      { id: '2022-r', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('未命名作品_2_vsxumg', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
      { id: '2022-s', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('起航_heklcp', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
      { id: '2022-t', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('IMG_9097_polarr_oia3hb', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },
      { id: '2022-u', title: 'Sky is the Ocean', image: buildCloudinaryImageUrl('未命名作品_sxhjie', { w: 1200, c: 'fit', q: 'auto' }),objectPosition: 'center 10%', },

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
    </div>
  ),
);

Elevator.displayName = 'Elevator';

const ArtPageClient = () => {
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
  
  // 计算单个图片+gap的精确宽度
  const calculateTileWidth = React.useCallback(() => {
    if (!rootRef.current) return { tileWidth: 120, gapWidth: 18 };
    
    const styles = window.getComputedStyle(rootRef.current);
    const stripWidth = parseFloat(styles.getPropertyValue('--year-strip-width')) || 120;
    const stripGap = parseFloat(styles.getPropertyValue('--year-strip-gap')) || 18;
    
    return { tileWidth: stripWidth, gapWidth: stripGap };
  }, []);
  
  const [tileWidths, setTileWidths] = React.useState(() => calculateTileWidth());
  const [expandedTiles, setExpandedTiles] = React.useState<Record<string, string>>({});
  const [activeTileIndices, setActiveTileIndices] = React.useState<Record<string, number>>({});
  const activeTileIndicesRef = React.useRef<Record<string, number>>({});

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
    
    // 延迟强制更新，确保DOM完全渲染后再更新pagination
    setTimeout(() => {
      if (!instance.destroyed) {
        // 强制更新以确保所有slides都被正确识别
        instance.update();
        
        // 临时debug: 检查slides和pagination状态
        const phase = ROAD_PHASES[index];
        const paginationEl = document.querySelector(`.year-${phase.year}-pagination`);
        console.log(`Swiper ${phase.year}:`, {
          tilesInData: phase.tiles.length,
          slidesInDOM: instance.slides.length,
          paginationBullets: paginationEl?.querySelectorAll('.swiper-pagination-bullet').length || 0,
        });
      }
    }, 200);
  };

  // 自定义导航处理函数，确保每次精确移动一个slide
  const handlePrevSlide = (phaseYear: string) => {
    const phaseIndex = ROAD_PHASES.findIndex(phase => phase.year === phaseYear);
    const swiper = swiperRefs.current[phaseIndex];
    if (swiper && !swiper.destroyed) {
      swiper.slidePrev();
    }
  };

  const handleNextSlide = (phaseYear: string) => {
    const phaseIndex = ROAD_PHASES.findIndex(phase => phase.year === phaseYear);
    const swiper = swiperRefs.current[phaseIndex];
    if (swiper && !swiper.destroyed) {
      swiper.slideNext();
    }
  };

  const handleYearBlockBackgroundClick =
    (phaseId: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (
        target.closest(
          '.art-strip, .swiper-prev, .swiper-next, .swiper-navigation-container, .swiper-pagination-container, .swiper-pagination-bullet',
        )
      ) {
        return;
      }
      setExpandedTiles((prev) => {
        if (!prev[phaseId]) return prev;
        const next = { ...prev };
        delete next[phaseId];
        return next;
      });
      
      // 同时清除激活的 bullet 索引
      setActiveTileIndices((prev) => {
        if (prev[phaseId] === undefined) return prev;
        const next = { ...prev };
        delete next[phaseId];
        activeTileIndicesRef.current = next;
        return next;
      });
      
      // 强制更新对应 phase 的 pagination
      const phaseIndex = ROAD_PHASES.findIndex(p => p.id === phaseId);
      if (phaseIndex !== -1) {
        const swiper = swiperRefs.current[phaseIndex];
        if (swiper && !swiper.destroyed && swiper.pagination) {
          swiper.pagination.render();
          swiper.pagination.update();
        }
      }
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
    const updateTileWidths = () => {
      if (!rootRef.current) return;
      
      // 更新tile宽度
      const newTileWidths = calculateTileWidth();
      setTileWidths(newTileWidths);
    };

    updateTileWidths();
    window.addEventListener('resize', updateTileWidths);

    return () => {
      window.removeEventListener('resize', updateTileWidths);
    };
  }, [calculateTileWidth]);

  useEffect(() => {
    swiperRefs.current.forEach((instance) => {
      if (!instance || instance.destroyed) return;
      instance.update();
      // 强制更新pagination
      if (instance.pagination && instance.pagination.render) {
        instance.pagination.render();
        instance.pagination.update();
      }
      instance.slideTo(instance.activeIndex, 0);
    });
  }, [tileWidths]);

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

        gsap.set(elevator, { position: 'absolute', opacity: 0, zIndex: 5 });

        const storyContainer = storyTrack?.parentElement as HTMLElement | null;
        const yearsContainer = yearsWrapper;
        const trapColumn = trap?.querySelector<HTMLElement>('.trap-road') || null;
        const frameEl = frame;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=660%',
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onRefresh: () => applyElevatorMetrics(),
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
              return gallerySlides[0]?.offsetHeight || frameEl.offsetHeight * 0.22;
            })();

        const storyStep = rawStoryStep || frameEl.offsetHeight * 0.2;

        const maxYearShift = yearsColumn && yearsContainer
          ? Math.max(yearsColumn.scrollHeight - yearsContainer.clientHeight, 0)
          : 0;

        const rawYearStep = maxYearShift > 0
          ? maxYearShift / segments
          : (() => {
              if (yearElements.length > 1) {
                return yearElements[1].offsetTop - yearElements[0].offsetTop;
              }
              return yearElements[0]?.offsetHeight || frameEl.offsetHeight * 0.16;
            })();

        const yearStep = rawYearStep || frameEl.offsetHeight * 0.14;

        const elevatorHeight = () => elevator.offsetHeight || 1;

        const viewportHeight = () => window.innerHeight || frameEl.offsetHeight || 1;

        const startTop = () => viewportHeight() * 0.16;
        const middleTop = () => viewportHeight() * 0.5 - elevatorHeight() * 0.5;
        const bottomPadding = () => viewportHeight() * 0.08;
        const endTop = () => viewportHeight() - elevatorHeight() - bottomPadding();

        function computeElevatorMetrics() {
          const frameWidth = frameEl.offsetWidth || window.innerWidth || 0;
          const baseWidth = Math.max(frameWidth * 0.22, 160);
          const left = (frameWidth - baseWidth) / 2;
          return { width: baseWidth, left };
        }

        const getElevatorTopForStage = (index: number, lastIndex: number) => {
          if (index === 0) return middleTop();
          if (index === lastIndex) return endTop();
          return middleTop();
        };

        const baseScale = 1;

        function applyElevatorMetrics() {
          const { width, left } = computeElevatorMetrics();
          gsap.set(elevator, { width, left });
          if (trapColumn) {
            gsap.set(trapColumn, { width, left });
          }
        }

        gsap.set(elevator, {
          top: () => startTop(),
          scale: baseScale,
          rotateY: 0,
          transformOrigin: 'bottom center',
        });

        applyElevatorMetrics();
        requestAnimationFrame(applyElevatorMetrics);

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
                    <section
                      className="year-block"
                      key={phase.id}
                      onClickCapture={handleYearBlockBackgroundClick(phase.id)}
                    >
                      <header className="year-block-meta">
                        <span className="year-block-label">{phase.stage}</span>
                        <h3>{phase.year}</h3>
                        <p>{phase.heading}</p>
                        <p className="year-block-summary">{phase.summary}</p>
                      </header>
                      <div className="year-block-carousel">
                        <Swiper
                          modules={[Navigation, Pagination]}
                          spaceBetween={tileWidths.gapWidth}
                          slidesPerView="auto"
                          slidesPerGroup={1}
                          centeredSlides={false}
                          watchSlidesProgress={true}
                          onSwiper={registerSwiperInstance(phaseIndex)}
                          onSlideChange={(swiper) => {
                            // Debug pagination状态
                            if (process.env.NODE_ENV === 'development') {
                              console.log(`Swiper ${phase.year} slide changed:`, {
                                activeIndex: swiper.activeIndex,
                                realIndex: swiper.realIndex,
                                totalSlides: swiper.slides.length,
                                paginationBullets: swiper.pagination?.bullets?.length || 0
                              });
                            }
                          }}
                          navigation={false}
                          pagination={{
                            el: `.year-${phase.year}-pagination`,
                            clickable: false,
                            type: 'custom',
                            renderCustom: function (swiper, current, total) {
                              // 使用实际的 slides 数量生成 bullets
                              const actualTotal = phase.tiles.length;
                              let bullets = '';
                              
                              // 只有当有图片展开时，才高亮对应的 bullet
                              // 否则所有 bullets 都不高亮
                              const activeBulletIndex = activeTileIndicesRef.current[phase.id];
                              
                              console.log(`renderCustom for ${phase.year}:`, {
                                activeBulletIndex,
                                hasActiveTile: activeBulletIndex !== undefined,
                              });
                              
                              for (let i = 0; i < actualTotal; i++) {
                                // 只有当 activeBulletIndex 存在且等于当前索引时才高亮
                                const isActive = (activeBulletIndex !== undefined && i === activeBulletIndex) 
                                  ? 'swiper-pagination-bullet-active' 
                                  : '';
                                bullets += `<span class="swiper-pagination-bullet ${isActive}"></span>`;
                              }
                              return bullets;
                            },
                          }}
                          grabCursor={true}
                          speed={700}
                          resistanceRatio={0.85}
                          watchOverflow={false}
                          className={[
                            'swiper-container',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {phase.tiles.map((tile, tileIndex) => {
                            const expandedId = expandedTiles[phase.id];
                            const isExpanded = expandedId === tile.id;

                            const collapsedObjectPosition =
                              tile.objectPositionCollapsed ??
                              tile.objectPosition ??
                              'center';
                            const expandedObjectPosition =
                              tile.objectPositionExpanded ??
                              collapsedObjectPosition;

                            const handleTileInteraction = () => {
                              // Debug: 查看点击的图片信息
                              console.log(`Clicked tile:`, {
                                phaseId: phase.id,
                                year: phase.year,
                                tileId: tile.id,
                                tileIndex: tileIndex,
                                tileTitle: tile.title,
                                isExpanded: isExpanded,
                              });

                              // 首先，无论如何都更新激活的索引（立即高亮对应的 bullet）
                              setActiveTileIndices((prev) => {
                                const newIndices = {
                                  ...prev,
                                  [phase.id]: tileIndex,
                                };
                                console.log(`Updated activeTileIndices:`, newIndices);
                                // 同时更新 ref，这样 renderCustom 才能立即访问到最新值
                                activeTileIndicesRef.current = newIndices;
                                return newIndices;
                              });
                              
                              // 强制 Swiper 更新 pagination
                              const swiper = swiperRefs.current[phaseIndex];
                              if (swiper && !swiper.destroyed && swiper.pagination) {
                                swiper.pagination.render();
                                swiper.pagination.update();
                              }

                              // 然后处理展开/lightbox 逻辑
                              if (isExpanded) {
                                // 如果已经展开，打开 lightbox
                                openLightbox(tile.image, tile.title);
                                return;
                              }

                              // 如果未展开，展开这张图片
                              setExpandedTiles((prev) => ({
                                ...prev,
                                [phase.id]: tile.id,
                              }));
                            };

                            return (
                              <SwiperSlide key={tile.id} className="swiper-slide art-strip-slide">
                                <article
                                  className={[
                                    'art-strip',
                                    isExpanded ? 'art-strip--expanded' : '',
                                  ]
                                    .filter(Boolean)
                                    .join(' ')}
                                >
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    className="art-strip-media"
                                    onClick={handleTileInteraction}
                                    onKeyDown={(event) => {
                                      if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        handleTileInteraction();
                                      }
                                    }}
                                  >
                                    <img
                                      src={tile.image}
                                      alt={tile.title}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: isExpanded
                                          ? expandedObjectPosition
                                          : collapsedObjectPosition,
                                        display: 'block',
                                      }}
                                    />
                                    <div className="art-strip-overlay" aria-hidden="true" />
                                    <div className="art-strip-caption">
                                      <h4>{tile.title}</h4>
                                    </div>
                                  </div>
                                </article>
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>
                        <div className="swiper-navigation-container">
                          <div className="swiper-navigation-wrapper">
                            <div 
                              className={`swiper-prev year-${phase.year}-prev`}
                              onClick={() => handlePrevSlide(phase.year)}
                            >
                              <svg aria-hidden="true" focusable="false" viewBox="0 0 40 40">
                                <path fill="currentColor" d="m27.042 4.792 1.333 1.25-13.917 13.917 13.917 13.833-1.333 1.333-15.167-15.166L27.042 4.792z"></path>
                              </svg>
                            </div>
                            <div 
                              className={`swiper-next year-${phase.year}-next`}
                              onClick={() => handleNextSlide(phase.year)}
                            >
                              <svg aria-hidden="true" focusable="false" viewBox="0 0 40 40">
                                <path fill="currentColor" d="m13.208 35.125-1.333-1.25 13.917-13.917L11.875 6.125l1.333-1.333 15.167 15.166Z"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="swiper-pagination-container" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                          <div className="swiper-pagination-wrapper" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                            <div className={`swiper-pagination year-${phase.year}-pagination`} style={{ userSelect: 'none', WebkitUserSelect: 'none' }}></div>
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

export default ArtPageClient;
