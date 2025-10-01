'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './photo.css';

gsap.registerPlugin(ScrollTrigger);

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

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
  // format + quality
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

const thumbnailUrl = (publicId: string) =>
  buildCloudinaryImageUrl(publicId, { w: 320, h: 320, c: 'fill', g: 'auto', dpr: 'auto', q: 'auto' });

const buildCloudinarySrcSet = (publicId: string, widths: number[], base: CldOpts = {}) =>
  widths
    .map((w) => `${buildCloudinaryImageUrl(publicId, { ...base, w })} ${w}w`)
    .join(', ');

type SelectedItem = { section: string; index: number; id?: string } | null;

const PhotoPage = () => {
  const bgImages = [
    'seacity1_ltvdkq',
    'firework1_cshymx',
    'glass_txtew7',
    'stars_awdjkq',
  ];

  const [currentBgIndex, setCurrentBgIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<SelectedItem>(null);

  const handlePrev = () => {
    setCurrentBgIndex((prevIndex) => (prevIndex - 1 + bgImages.length) % bgImages.length);
  };

  const handleNext = () => {
    setCurrentBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
  };

  // 初屏滚动动画：放大 + 上滑一屏，露出下方内容（无空白、不卡住）
  useEffect(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.photo-wrapper',
        start: 'top top',
        end: () => `+=${window.innerHeight + 3}`,
        pin: true,
        pinSpacing: false, // 不生成占位，直接与下方内容衔接
        scrub: true,
        onUpdate: (self) => {
          const el = document.querySelector<HTMLElement>('.photo-wrapper');
          if (!el) return;
          // 开始上滑后放开指针事件，避免遮挡下方内容交互
          el.style.pointerEvents = self.progress >= 0.5 ? 'none' : 'auto';
        },
      },
    });

    timeline
      // 前半段：背景/照片放大
      .to(
        '.photo-image',
        {
          scale: 3,
          z: 400,
          transformOrigin: 'center center',
          ease: 'power1.inOut',
          duration: 0.6,
        },
        0,
      )
      .to(
        '.section.hero',
        {
          scale: 1.1,
          transformOrigin: 'center center',
          ease: 'power1.inOut',
          duration: 0.6,
        },
        0,
      )
      // 后半段：向上滑动移出视口，露出下面的白色长页内容
      .to(
        ['.image-container', '.photo-content'],
        {
          y: () => -window.innerHeight,
          ease: 'power2.inOut',
          duration: 0.4,
        },
        0.6,
      )
      .to(
        '.arrow-button',
        {
          opacity: 0,
          ease: 'power1.out',
          duration: 0.4,
        },
        0.6,
      );

    return () => {
      timeline.kill();
    };
  }, []);

  const heroStyle = {
    backgroundImage: `url(${buildCloudinaryImageUrl(bgImages[currentBgIndex])})`,
    transition: 'background-image 0.5s ease-in-out',
  } as React.CSSProperties;

  // 画廊用的占位数据
  const sections = [
    { key: 'citylife', title: 'Citylife', count: 18 },
    { key: 'landscape', title: 'Landscape / Nature', count: 18 },
    { key: 'abstract', title: 'Abstract', count: 18 },
  ] as const;

  // Citylife 专用：两个大图
  const CITYLIFE_FEATURES = [
    'IMG_1396_q46dux',
    'IMG_1401_mugp8p',
  ];

  // Citylife 小图列表（保持给定顺序，便于成组贴在一起）
  const CITYLIFE_GRID = [
    'c16_scnqwq', 'IMG_7582_egxkef', 'IMG_6770_limvti', 'c12_acuyzr', 'c34_u4yyrn',
    'IMG_5811_bdrkmw', 'IMG_4759_polarr_az5ppu', 'c05_orlfqw', 'c11_sdlhki', 'IMG_0132_assstw',
    'c21_zobebt', 'c15_lv9mxl', 'c09_wyocsx', 'DSC00730_sjr7qj', 'DSC00726_swxzqu',
    'IMG_2559_srt2ws', 'c13_hkfhle', 'IMG_4461_vlbvh7', 'c17_xwbdvv', 'IMG_6430_yxmozv',
    'c22_f1tepf', 'IMG_9873_polarr_vsjcix', 'c10_djjbtv', 'IMG_4339_xs5mtb', 'c06_atpokc',
    'DSC00470-dorzqu', '1_eazrdy',
  ];

  const CITYLIFE_ALL = [...CITYLIFE_FEATURES, ...CITYLIFE_GRID];

  // 预留每张图的说明文本（可按 id 自定义）
  const CITYLIFE_META: Record<string, { caption?: string; time?: string }> = {
    IMG_1396_q46dux: { caption: 'Took with camera XXX', time: 'Apr 29, 2025 • 19:30' },
    IMG_1401_mugp8p: { caption: 'Took with camera XXX', time: 'Apr 29, 2025 • 19:32' },
  };

  const openItem = (sectionKey: string, index: number, id?: string) => setSelected({ section: sectionKey, index, id });
  const closeItem = () => setSelected(null);

  const getCount = (sectionKey: string) => {
    const sec = sections.find((s) => s.key === sectionKey);
    if (!sec) return 0;
    if (sectionKey === 'citylife') return CITYLIFE_ALL.length;
    return sec.count;
  };

  const getIdByIndex = (sectionKey: string, index: number): string | undefined => {
    if (sectionKey === 'citylife') return CITYLIFE_ALL[index];
    return undefined;
  };

  const goPrev = () => {
    setSelected((sel) => {
      if (!sel) return sel;
      const total = getCount(sel.section);
      if (total <= 0) return sel;
      const nextIndex = (sel.index - 1 + total) % total;
      return { section: sel.section, index: nextIndex, id: getIdByIndex(sel.section, nextIndex) };
    });
  };

  const goNext = () => {
    setSelected((sel) => {
      if (!sel) return sel;
      const total = getCount(sel.section);
      if (total <= 0) return sel;
      const nextIndex = (sel.index + 1) % total;
      return { section: sel.section, index: nextIndex, id: getIdByIndex(sel.section, nextIndex) };
    });
  };

  // 弹层开启时：锁定滚动，并启用键盘左右切换/ESC关闭
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeItem();
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goPrev();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goNext();
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected]);

  // 移动端下滑关闭（轻量手势）
  const [dragY, setDragY] = React.useState(0);
  const [overlayAlpha, setOverlayAlpha] = React.useState(0.5);
  const startXYRef = React.useRef<{ x: number; y: number } | null>(null);
  const draggingRef = React.useRef(false);
  const preloadedRef = React.useRef<Set<string>>(new Set());

  const preloadFullImage = (id?: string) => {
    if (!id || preloadedRef.current.has(id)) return;
    const url = buildCloudinaryImageUrl(id, { c: 'fit', dpr: 'auto', q: 'auto' });
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    preloadedRef.current.add(id);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startXYRef.current = { x: t.clientX, y: t.clientY };
    draggingRef.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current || !startXYRef.current) return;
    const t = e.touches[0];
    const dy = t.clientY - startXYRef.current.y;
    const dx = t.clientX - startXYRef.current.x;
    // 主要是纵向下滑才触发拖拽
    if (dy > 0 && Math.abs(dy) > Math.abs(dx) * 1.1) {
      setDragY(dy);
      setOverlayAlpha(Math.max(0.15, 0.5 - dy / 800));
    }
  };

  const onTouchEnd = () => {
    draggingRef.current = false;
    if (dragY > 100) {
      closeItem();
      setTimeout(() => {
        setDragY(0);
        setOverlayAlpha(0.5);
      }, 0);
    } else {
      setDragY(0);
      setOverlayAlpha(0.5);
    }
  };

  return (
    <>
      {/* 首屏动画块 */}
      <div className="photo-wrapper">
        <div className="photo-content">
          <section className="section hero" style={heroStyle}></section>
        </div>
        <div className="image-container">
          <img src={buildCloudinaryImageUrl('window_k8hdtc')} alt="image" className="photo-image" />
        </div>

        <button onClick={handlePrev} className="arrow-button left-arrow" aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.75 19.5L8.25 12L15.75 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button onClick={handleNext} className="arrow-button right-arrow" aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.25 4.5L15.75 12L8.25 19.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 白色画廊区域 */}
      <div className="gallery-container">
        {sections.map((sec) => (
          <section key={sec.key} className="gallery-section">
            <div className="section-header">
              <h2 className="section-title">{sec.title}</h2>
            </div>

            {sec.key === 'citylife' ? (
              <>
                <div className="feature-layout">
                  {CITYLIFE_FEATURES.map((id, idx) => (
                    <div
                      key={id}
                      className="feature-item"
                      onClick={() => openItem(sec.key, idx, id)}
                      onMouseEnter={() => preloadFullImage(id)}
                      onTouchStart={() => preloadFullImage(id)}
                    >
                      <img
                        src={buildCloudinaryImageUrl(id, { dpr: 'auto' })}
                        alt={`Citylife feature ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        fetchPriority={idx === 0 ? 'high' : 'low'}
                      />
                    </div>
                  ))}
                  <aside className="feature-aside">
                    <p className="feature-quote">“We live in this moment — the city molds our stories, frame by frame.”</p>
                  </aside>
                </div>

                <div className="gallery-grid">
                  {CITYLIFE_GRID.map((id, i) => (
                    <button
                      key={`${sec.key}-grid-${id}`}
                      className="gallery-item"
                      onClick={() => openItem(sec.key, CITYLIFE_FEATURES.length + i, id)}
                      onMouseEnter={() => preloadFullImage(id)}
                      onTouchStart={() => preloadFullImage(id)}
                      aria-label={`Open ${sec.title} item ${i + 1}`}
                    >
                      <img
                        src={thumbnailUrl(id)}
                        alt={id}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 180px"
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="gallery-grid">
                {Array.from({ length: sec.count }).map((_, i) => (
                  <button
                    key={`${sec.key}-${i}`}
                    className="gallery-item"
                    onClick={() => openItem(sec.key, i)}
                    aria-label={`Open ${sec.title} item ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* 弹层 - 居中卡片 + 右侧白色信息栏（移动端文字在下） */}
      {selected && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={closeItem}
          style={{ background: `rgba(0,0,0,${overlayAlpha})` }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ transform: `translateY(${dragY}px)` }}
          >
            <div className="modal-image">
              {selected?.section === 'citylife' && selected?.id ? (
                <img
                  src={buildCloudinaryImageUrl(selected.id, { c: 'fit', w: 1200, dpr: 'auto', q: 'auto', fl: 'progressive:steep' })}
                  srcSet={buildCloudinarySrcSet(selected.id, [800, 1200], { c: 'fit', dpr: 'auto', q: 'auto', fl: 'progressive:steep' })}
                  sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 1200px"
                  alt={selected.id}
                  decoding="async"
                  fetchPriority="high"
                />
              ) : null}
            </div>
            <aside className="modal-aside">
              <div className="aside-inner">
                {selected?.section === 'citylife' && selected?.id ? (
                  <>
                    <p className="aside-meta">{CITYLIFE_META[selected.id]?.caption || 'Took with camera XXX'}</p>
                    <p className="aside-time">{CITYLIFE_META[selected.id]?.time || '——'}</p>
                  </>
                ) : (
                  <>
                    <p className="aside-meta">Took with camera XXX</p>
                    <p className="aside-time">Apr 29, 2025 • 19:30</p>
                  </>
                )}
              </div>
            </aside>
            <button className="modal-close" aria-label="Close" onClick={closeItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoPage;
