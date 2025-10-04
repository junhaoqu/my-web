'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './project.css';

gsap.registerPlugin(ScrollTrigger);

const ROW1_IMAGES = [
  'https://picsum.photos/seed/a1/1200/800',
  'https://picsum.photos/seed/a2/1200/800',
  'https://picsum.photos/seed/a3/1200/800',
  'https://picsum.photos/seed/a4/1200/800',
];

const ROW2_IMAGES = [
  'https://picsum.photos/seed/b1/1200/800',
  'https://picsum.photos/seed/b2/1200/800',
  'https://picsum.photos/seed/b3/1200/800',
  'https://picsum.photos/seed/b4/1200/800',
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
      { id: '2025-a', title: 'Skylight Array', image: 'https://picsum.photos/seed/road-2025-a/1400/900' },
      { id: '2025-b', title: 'Framework Echo', image: 'https://picsum.photos/seed/road-2025-b/1400/900' },
      { id: '2025-c', title: 'Midnight Panel', image: 'https://picsum.photos/seed/road-2025-c/1400/900' },
    ],
  },
  {
    id: 'phase-2024',
    year: '2024',
    stage: 'Phase IV',
    heading: 'Reverse Corridor',
    summary: '反向开启的通道引导观者折返，缓慢进入影像的下一重。',
    tiles: [
      { id: '2024-a', title: 'Evergreen Drift', image: 'https://picsum.photos/seed/road-2024-a/1400/900' },
      { id: '2024-b', title: 'Resonant Steps', image: 'https://picsum.photos/seed/road-2024-b/1400/900' },
      { id: '2024-c', title: 'Bloom Passage', image: 'https://picsum.photos/seed/road-2024-c/1400/900' },
    ],
  },
  {
    id: 'phase-2023',
    year: '2023',
    stage: 'Phase V',
    heading: 'Continuous Road',
    summary: '第三段保持均速的节奏，将远处片段连缀成完整旅程。',
    tiles: [
      { id: '2023-a', title: 'Tidal Memory', image: 'https://picsum.photos/seed/road-2023-a/1400/900' },
      { id: '2023-b', title: 'Horizon Fold', image: 'https://picsum.photos/seed/road-2023-b/1400/900' },
      { id: '2023-c', title: 'Amber Dusk', image: 'https://picsum.photos/seed/road-2023-c/1400/900' },
    ],
  },
  {
    id: 'phase-2022',
    year: '2022',
    stage: 'Phase VI',
    heading: 'Descending Years',
    summary: '年份开始下沉，时间在层层叠落的斜面中重新排布。',
    tiles: [
      { id: '2022-a', title: 'Cascade Ridge', image: 'https://picsum.photos/seed/road-2022-a/1400/900' },
      { id: '2022-b', title: 'Echo Shelter', image: 'https://picsum.photos/seed/road-2022-b/1400/900' },
      { id: '2022-c', title: 'Frostline Noon', image: 'https://picsum.photos/seed/road-2022-c/1400/900' },
    ],
  },
  {
    id: 'phase-2021',
    year: '2021',
    stage: 'Phase VII',
    heading: 'Delta Resonance',
    summary: '折返节点的缝隙里，画面与声响形成新的节拍。',
    tiles: [
      { id: '2021-a', title: 'Signal Bloom', image: 'https://picsum.photos/seed/road-2021-a/1400/900' },
      { id: '2021-b', title: 'Rhythm Cloud', image: 'https://picsum.photos/seed/road-2021-b/1400/900' },
      { id: '2021-c', title: 'Violet Pulse', image: 'https://picsum.photos/seed/road-2021-c/1400/900' },
    ],
  },
  {
    id: 'phase-2020',
    year: '2020',
    stage: 'Phase VIII',
    heading: 'Temporal Echo',
    summary: '终点回望，记忆的回声再次抵达脚下，完成整个循环。',
    tiles: [
      { id: '2020-a', title: 'Origin Veil', image: 'https://picsum.photos/seed/road-2020-a/1400/900' },
      { id: '2020-b', title: 'Lantern Shore', image: 'https://picsum.photos/seed/road-2020-b/1400/900' },
      { id: '2020-c', title: 'Quiet Current', image: 'https://picsum.photos/seed/road-2020-c/1400/900' },
    ],
  },
];

const ROAD_YEARS = ROAD_PHASES.map((phase) => ({
  id: `year-${phase.year}`,
  value: phase.year,
  stage: phase.stage,
}));

const Walker = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div className={['walker', className].filter(Boolean).join(' ')} ref={ref}>
      <div className="head" />
      <div className="body" />
      <div className="arm left" />
      <div className="arm right" />
      <div className="leg left" />
      <div className="leg right" />
    </div>
  ),
);

Walker.displayName = 'Walker';

const ArtProjectPage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLElement>(null);
  const row2Ref = useRef<HTMLElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const walker1Ref = useRef<HTMLDivElement>(null);
  const walker2Ref = useRef<HTMLDivElement>(null);
  const walkerRoadRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLElement>(null);
  const yearRefs = useRef<Array<HTMLDivElement | null>>([]);
  const storyTrackRef = useRef<HTMLDivElement>(null);
  const trapColRef = useRef<HTMLDivElement>(null);
  const roadFrameRef = useRef<HTMLDivElement>(null);
  const yearsColumnRef = useRef<HTMLDivElement>(null);
  const yearsWrapperRef = useRef<HTMLDivElement>(null);

  const registerYearRef = (index: number) => (el: HTMLDivElement | null) => {
    yearRefs.current[index] = el;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const makeWalkCycle = (walker: Element | null) => {
        if (!walker) return () => {};
        const armL = walker.querySelector('.arm.left');
        const armR = walker.querySelector('.arm.right');
        const legL = walker.querySelector('.leg.left');
        const legR = walker.querySelector('.leg.right');
        const tl = gsap.timeline({ paused: true, defaults: { duration: 0.28, ease: 'sine.inOut' } });
        tl.to([armL, legR], { rotation: 26 }, 0).to([armR, legL], { rotation: -26 }, 0);
        return (progress: number) => tl.progress((progress || 0) % 1);
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
            onUpdate: (self) => walkUpdate(self.progress * 40),
            onEnter: onEnter,
            onLeaveBack: onLeaveBack,
          },
        });

        const walkerWidth = () => walker.offsetWidth || 0;
        const startX = () => (dir === 1 ? '5vw' : `calc(95vw - ${walkerWidth()}px)`);
        const defaultEnd = () => (dir === 1 ? `calc(95vw - ${walkerWidth()}px)` : '5vw');

        gsap.set(walker, { position: 'fixed', bottom: '6vh', left: startX(), zIndex: 3 });

        timeline
          .to(track, { x: () => (dir === 1 ? -(track.scrollWidth - window.innerWidth) : 0), ease: 'none' }, 0)
          .to(walker, { left: () => (endOverride ? endOverride() : defaultEnd()), ease: 'none' }, 0);
      };

      // --- Road Animation Function (Stage 3) ---
      const createRoadAnimation = ({
        section,
        walker,
        walker2,
        years,
        storyTrack,
        trap,
        frame,
        yearsColumn,
        yearsWrapper,
      }: {
        section: HTMLElement | null;
        walker: HTMLElement | null;
        walker2: HTMLElement | null;
        years: Array<HTMLElement | null>;
        storyTrack: HTMLElement | null;
        trap: HTMLElement | null;
        frame: HTMLElement | null;
        yearsColumn: HTMLElement | null;
        yearsWrapper: HTMLElement | null;
      }) => {
        if (!section || !walker || !walker2 || !frame) return;

        const yearElements = years.filter(Boolean) as HTMLElement[];
        if (yearElements.length === 0) return;

        const roadWalkUpdate = makeWalkCycle(walker);

        gsap.set(walker, { position: 'absolute', opacity: 0, zIndex: 5 });

        const storyContainer = storyTrack?.parentElement as HTMLElement | null;
        const yearsContainer = yearsWrapper;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=660%',
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              roadWalkUpdate(self.progress * 80);
            },
            onToggle: (self) => {
              gsap.set(walker, { opacity: self.isActive ? 1 : 0 });
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

        const walkerHeight = () => walker.offsetHeight || 1;
        const walkerWidth = () => walker.offsetWidth || 1;

        const viewportHeight = () => window.innerHeight || frame.offsetHeight || 1;

        const startTop = () => viewportHeight() * 0.16;
        const middleTop = () => viewportHeight() * 0.5 - walkerHeight() * 0.5;
        const bottomPadding = () => viewportHeight() * 0.08;
        const endTop = () => viewportHeight() - walkerHeight() - bottomPadding();

        const computeWalkerLeft = () => {
          if (trap) {
            const offsetWithinFrame = trap.offsetLeft + trap.offsetWidth * 0.42 - walkerWidth() * 0.5;
            return Math.max(offsetWithinFrame, 0);
          }
          return frame.offsetWidth * 0.18;
        };

        const getWalkerTopForStage = (index: number, lastIndex: number) => {
          if (index === 0) return middleTop();
          if (index === lastIndex) return endTop();
          return middleTop();
        };

        const baseScale = 1;
        const maxScale = 1.28;
        const scaleStep = (maxScale - baseScale) / segments;
        const getScaleForStage = (index: number) => baseScale + scaleStep * index;

        gsap.set(walker, {
          left: () => computeWalkerLeft(),
          top: () => startTop(),
          scale: baseScale,
          rotateY: 180,
          transformOrigin: 'bottom center',
        });

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
            opacity: index === 0 ? 1 : 0.28,
          });
        });

        yearElements.forEach((yearEl, index) => {
          const stageLabel = `stage-${index}`;
          const lastIndex = yearElements.length - 1;

          timeline.addLabel(stageLabel, index === 0 ? 0 : '>');

          timeline.fromTo(
            yearEl,
            { autoAlpha: 0, yPercent: 40, filter: 'blur(14px)' },
            { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' },
            stageLabel,
          );

          timeline.to(
            walker,
            {
              top: () => getWalkerTopForStage(index, lastIndex),
              scale: () => getScaleForStage(index),
              duration: index === 0 || index === lastIndex ? 1.15 : 0.9,
              ease: 'power2.inOut',
            },
            stageLabel,
          );

          if (yearsColumn && yearsContainer) {
            timeline.to(
              yearsColumn,
              {
                y: () => -yearStep * Math.min(index, segments),
                duration: index === 0 ? 0.85 : 1,
                ease: 'power1.inOut',
              },
              stageLabel,
            );
          }

          if (storyTrack && gallerySlides.length > 0 && storyContainer) {
            timeline.to(
              storyTrack,
              {
                y: () => -storyStep * Math.min(index, segments),
                duration: 1,
                ease: 'power1.inOut',
              },
              stageLabel,
            );
          }

          if (storyTrack && gallerySlides.length > 0) {
            const activeSlide = gallerySlides[index];
            const previousSlide = gallerySlides[index - 1];

            if (activeSlide) {
              timeline.to(
                activeSlide,
                { opacity: 1, ease: 'power2.out', duration: 0.6 },
                stageLabel,
              );
            }

            if (previousSlide) {
              timeline.to(
                previousSlide,
                { opacity: 0.3, ease: 'power1.in', duration: 0.5 },
                stageLabel,
              );
            }
          }

          if (index !== lastIndex) {
            timeline.to(
              yearEl,
              { autoAlpha: 0, yPercent: -32, filter: 'blur(16px)', duration: 0.6, ease: 'power3.in' },
              `${stageLabel}+=0.82`,
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
        walker: walkerRoadRef.current,
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

  const renderCard = (src: string, index: number) => (
    <div className="card" key={index}>
      <div className="media">
        <img src={src} alt={`Gallery image ${index + 1}`} loading="lazy" />
      </div>
    </div>
  );

  return (
    <div className="art-project" ref={rootRef}>
      <section className="corridor" ref={row1Ref}>
        <div className="wrap">
          <div className="header">Page 1 · Gallery L→R</div>
          <div className="view">
            <div className="track" ref={track1Ref}>
              {ROW1_IMAGES.map((src, index) => renderCard(src, index))}
            </div>
            <div className="ground" />
            <Walker ref={walker1Ref} />
          </div>
          <div className="footer">Scroll to walk through the first gallery.</div>
        </div>
      </section>

      <section className="corridor" ref={row2Ref}>
        <div className="wrap">
          <div className="header">Page 2 · Gallery R→L</div>
          <div className="view">
            <div className="track" ref={track2Ref}>
              {ROW2_IMAGES.map((src, index) => renderCard(src, index))}
            </div>
            <div className="ground" />
            <Walker ref={walker2Ref} />
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
                <Walker ref={walkerRoadRef} className="road-walker facing-forward" />
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
                  {ROAD_PHASES.map((phase) => (
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
                          spaceBetween={40}
                          slidesPerView="auto"
                          centeredSlides={false}
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
                          resistanceRatio={0.15}
                          watchOverflow={true}
                          preventClicks={false}
                          preventClicksPropagation={false}
                          className="swiper-container"
                        >
                          {phase.tiles.map((tile, tileIndex) => (
                            <SwiperSlide key={tile.id} className="swiper-slide">
                              <article className={`art-frame ${tileIndex === 0 ? 'primary' : 'secondary'}`}>
                                <div
                                  className="art-frame-media"
                                  style={{ backgroundImage: `url(${tile.image})` }}
                                  aria-hidden="true"
                                />
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
    </div>
  );
};

export default ArtProjectPage;
