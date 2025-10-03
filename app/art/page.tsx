'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

const ROAD_GALLERY = [
  {
    id: 'g1',
    title: 'Gallery Assembly',
    date: '2025 · Phase I',
    image: 'https://picsum.photos/seed/road-a/1200/1600',
  },
  {
    id: 'g2',
    title: 'Reverse Corridor',
    date: '2025 · Phase II',
    image: 'https://picsum.photos/seed/road-b/1200/1600',
  },
  {
    id: 'g3',
    title: 'Continuous Road',
    date: '2024 · Phase III',
    image: 'https://picsum.photos/seed/road-c/1200/1600',
  },
  {
    id: 'g4',
    title: 'Descending Years',
    date: '2024 · Phase IV',
    image: 'https://picsum.photos/seed/road-d/1200/1600',
  },
];

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
  const yr2025Ref = useRef<HTMLDivElement>(null);
  const yr2024Ref = useRef<HTMLDivElement>(null);
  const storyTrackRef = useRef<HTMLDivElement>(null);
  const trapColRef = useRef<HTMLDivElement>(null);

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
      const createRoadAnimation = ({ section, walker, walker2 }: { section: HTMLElement | null, walker: HTMLElement | null, walker2: HTMLElement | null }) => {
        if (!section || !walker || !walker2) return;

        const roadWalkUpdate = makeWalkCycle(walker);

        gsap.set(walker, { position: 'absolute', opacity: 0, zIndex: 5 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=300%',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => roadWalkUpdate(self.progress * 50),
            onToggle: (self) => {
              gsap.set(walker, { opacity: self.isActive ? 1 : 0 });
              gsap.set(walker2, { opacity: self.isActive ? 0 : 1 });
            },
          },
        });

        const walkerHeight = walker.offsetHeight;
        const roadHeight = section.offsetHeight;

        timeline.fromTo(walker, 
          {
            left: () => walker2.getBoundingClientRect().left,
            top: '5vh',
            scale: 1,
            rotateY: 180,
            transformOrigin: 'bottom center',
          },
          {
            y: roadHeight - walkerHeight - (0.06 * window.innerHeight),
            scale: 3.5,
            ease: 'none',
          }
        );
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
      });

    });
    return () => ctx.revert();
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
              <div className="road-frame">
                <div className="ground" />
                <div className="trap-col" ref={trapColRef}>
                  <div className="trap-road" />
                </div>
                <Walker ref={walkerRoadRef} className="road-walker facing-forward" />
                <div className="years">
                  <div className="yr y2025" ref={yr2025Ref}>
                    2025
                  </div>
                  <div className="yr y2024" ref={yr2024Ref}>
                    2024
                  </div>
                </div>
              </div>
            </div>
            <div className="story-column">
              <div className="story-heading">
                <span className="story-tag">年序叙事</span>
                <p>
                  滚动让人物沿道路向下走动，右侧影像廊同步滑动，记录 2025 → 2024 的变换。
                </p>
              </div>
              <div className="story-carousel">
                <div className="story-track" ref={storyTrackRef}>
                  {ROAD_GALLERY.map((item) => (
                    <article className="story-card" key={item.id}>
                      <div
                        className="story-card-media"
                        style={{ backgroundImage: `url(${item.image})` }}
                        aria-hidden="true"
                      />
                      <div className="story-card-meta">
                        <span className="story-card-date">{item.date}</span>
                        <h4>{item.title}</h4>
                      </div>
                    </article>
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