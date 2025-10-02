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

const THUMBNAIL_TWEAKS: Record<string, CldOpts> = {
  seacity1_ltvdkq: { g: 'center'},
  IMG_4339_xs5mtb: { g: 'center'},
  DSC01118_eajl0k: { g: 'center'},
};

const thumbnailUrl = (publicId: string) => {
  const tweaks = THUMBNAIL_TWEAKS[publicId] ?? {};
  return buildCloudinaryImageUrl(publicId, {
    w: 320,
    h: 320,
    c: 'fill',
    g: 'auto',
    dpr: 'auto',
    q: 'auto',
    ...tweaks,
  });
};

const buildCloudinarySrcSet = (publicId: string, widths: number[], base: CldOpts = {}) =>
  widths
    .map((w) => `${buildCloudinaryImageUrl(publicId, { ...base, w })} ${w}w`)
    .join(', ');

type SectionKey = 'citylife' | 'landscape' | 'humanmade';

type SectionConfig = {
  key: SectionKey;
  title: string;
  features?: string[];
  gallery: (string | null)[];
  quote?: string;
};

type SelectedItem = { section: SectionKey; index: number; id?: string } | null;

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

  // Citylife
  const CITYLIFE_FEATURES = ['IMG_1396_q46dux', 'IMG_1401_mugp8p'];
  const CITYLIFE_GRID = [
    'c05_orlfqw','c09_wyocsx','c10_djjbtv','c11_sdlhki','c12_acuyzr','c13_hkfhle','c21_zobebt','c22_f1tepf',
    'IMG_4339_xs5mtb','c15_lv9mxl','c16_scnqwq', 'IMG_4461_vlbvh7','IMG_4759_polarr_az5ppu', 'DSC00730_sjr7qj','c17_xwbdvv','DSC00726_swxzqu',
    'DSC00470-dorzqu', 'c34_u4yyrn','IMG_5811_bdrkmw',  'IMG_6770_limvti','IMG_0132_assstw', 'IMG_6430_yxmozv','street_small_un7xsc','c06_atpokc',
    'IMG_9873_polarr_vsjcix', 'IMG_2559_srt2ws', 'IMG_7582_egxkef','1_eazrdy','seacity1_ltvdkq',
  ];

  // Landscape
  const LANDSCAPE_FEATURES = ['IMG_1400_tqcyos', 'IMG_1328_evniye'];
  const LANDSCAPE_GRID: (string | null)[] = [
    'IMG_7407_nkvw6d','IMG_7439_mjrj5q','DSC01037_yarpf1','DSC01070_q7frdk','DSC01118_eajl0k','IMG_2685_polarr_eedpj6' ,'IMG_9953_usoozs','IMG_9517_polarr_zkpbyw','DSC00780_jeow7u',
  ];

  // Human Made
  const HUMAN_MADE_FEATURES = ['IMG_3984_tnhi0d', 'IMG_5860_qzo0qu'];
  const HUMAN_MADE_GRID: (string | null)[] = ['DSC00076_eittng', 'IMG_1210_mvyd9r'];

  // 预留每张图的说明文本（可按 id 自定义）
  const IMAGE_META: Record<string, { caption?: string; time?: string }> = {
    IMG_1396_q46dux: { caption: 'Took with camera XXX', time: 'Apr 29, 2025 • 19:30' },
    IMG_1401_mugp8p: { caption: 'Took with camera XXX', time: 'Apr 29, 2025 • 19:32' },
  };

  const sections: SectionConfig[] = [
    {
      key: 'citylife',
      title: 'Citylife',
      features: CITYLIFE_FEATURES,
      gallery: CITYLIFE_GRID,
      quote: '“We live in this moment — the city molds our stories, frame by frame.”',
    },
    {
      key: 'landscape',
      title: 'Landscape / Nature',
      features: LANDSCAPE_FEATURES,
      gallery: LANDSCAPE_GRID,
      quote: '“We see the ocean, endless and untamed; we see the land, steady beneath our feet; we see the sky, vast and unbroken; and we reach toward the stars, eternal in their silence. Yet it is not enough only to see — we must feel the immensity of nature, the quiet force that humbles and strengthens us, reminding us of our smallness and our belonging.”',
    },
    {
      key: 'humanmade',
      title: 'Human Made',
      features: HUMAN_MADE_FEATURES,
      gallery: HUMAN_MADE_GRID,
      quote:
        '“We create, not merely to build, but to transcend. From stone to steel, from canvas to code, we shape visions that outlast our breath. In art we carve eternity from fleeting hours, and through creation we defy silence, giving voice to what is most human within us.”',
    },
  ];

  const findSection = (sectionKey: SectionKey) => sections.find((sec) => sec.key === sectionKey);

  const getSectionCombined = (sectionKey: SectionKey) => {
    const section = findSection(sectionKey);
    if (!section) return [] as (string | null)[];
    return [...(section.features ?? []), ...section.gallery];
  };

  const openItem = (sectionKey: SectionKey, index: number, id?: string | null) => {
    if (!id) return; // 没有真实图片时不打开弹窗
    setSelected({ section: sectionKey, index, id });
  };
  const closeItem = () => setSelected(null);

  const getCount = (sectionKey: SectionKey) => {
    const combined = getSectionCombined(sectionKey);
    return combined.length;
  };

  const getIdByIndex = (sectionKey: SectionKey, index: number): string | undefined => {
    const combined = getSectionCombined(sectionKey);
    const id = combined[index];
    return id ?? undefined;
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
          <section key={sec.key} className={`gallery-section gallery-section-${sec.key}`}>
            <div className="section-header">
              <h2 className="section-title">{sec.title}</h2>
            </div>

            {(sec.features?.length ?? 0) > 0 ? (
              <>
                <div className="feature-layout">
                  {(sec.features ?? []).map((id, idx) => {
                    const isPrimaryFeature = idx === 0;
                    const featureItemClass = [
                      'feature-item',
                      isPrimaryFeature ? 'feature-item--primary' : '',
                      isPrimaryFeature && sec.key === 'landscape' ? 'feature-item--landscape-primary' : '',
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return (
                      <div
                        key={id}
                        className={featureItemClass}
                        onClick={() => openItem(sec.key, idx, id)}
                        onMouseEnter={() => preloadFullImage(id)}
                        onTouchStart={() => preloadFullImage(id)}
                      >
                        <img
                          src={buildCloudinaryImageUrl(id, { dpr: 'auto' })}
                          alt={`${sec.title} feature ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          fetchPriority={idx === 0 ? 'high' : 'low'}
                        />
                      </div>
                    );
                  })}
                  {sec.quote ? (
                    <aside className="feature-aside">
                      <p className="feature-quote">{sec.quote}</p>
                    </aside>
                  ) : null}
                </div>

                <div className="gallery-grid">
                  {sec.gallery.map((id, i) => {
                    const combinedIndex = (sec.features?.length ?? 0) + i;
                    const hasImage = Boolean(id);
                    const thumbUrl = id ? thumbnailUrl(id) : undefined;
                    return (
                      <button
                        key={`${sec.key}-grid-${id ?? i}`}
                        type="button"
                        className="gallery-item"
                        onClick={() => hasImage && openItem(sec.key, combinedIndex, id)}
                        onMouseEnter={() => hasImage && preloadFullImage(id)}
                        onTouchStart={() => hasImage && preloadFullImage(id)}
                        aria-label={`Open ${sec.title} item ${i + 1}`}
                        disabled={!hasImage}
                      >
                        {hasImage ? (
                          <img
                            src={thumbUrl}
                            alt={id ?? ''}
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 180px"
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="gallery-grid">
                {sec.gallery.map((id, i) => (
                  <button
                    key={`${sec.key}-${id ?? i}`}
                    type="button"
                    className="gallery-item"
                    onClick={() => id && openItem(sec.key, i, id)}
                    onMouseEnter={() => id && preloadFullImage(id)}
                    onTouchStart={() => id && preloadFullImage(id)}
                    aria-label={`Open ${sec.title} item ${i + 1}`}
                    disabled={!id}
                  >
                    {id ? (
                      <img
                        src={thumbnailUrl(id)}
                        alt={id}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 180px"
                      />
                    ) : null}
                  </button>
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
              {selected?.id ? (
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
                {selected?.id ? (
                  <>
                    <p className="aside-meta">{IMAGE_META[selected.id]?.caption || 'Took with camera XXX'}</p>
                    <p className="aside-time">{IMAGE_META[selected.id]?.time || '——'}</p>
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
