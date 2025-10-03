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
  const roadRef = useRef<HTMLElement>(null);
  const walkerRoadRef = useRef<HTMLDivElement>(null);
  const yr2025Ref = useRef<HTMLDivElement>(null);
  const yr2024Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    let roadTimeline: gsap.core.Timeline | null = null;
    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const makeWalkCycle = (walker: Element | null) => {
        if (!walker) return () => {};
        const armLeft = walker.querySelector<HTMLElement>('.arm.left');
        const armRight = walker.querySelector<HTMLElement>('.arm.right');
        const legLeft = walker.querySelector<HTMLElement>('.leg.left');
        const legRight = walker.querySelector<HTMLElement>('.leg.right');
        if (!armLeft || !armRight || !legLeft || !legRight) {
          return () => {};
        }
        const tl = gsap.timeline({
          paused: true,
          defaults: { duration: 0.28, ease: 'sine.inOut' },
        });
        tl.to([armLeft, legRight], { rotation: 26 }, 0)
          .to([armRight, legLeft], { rotation: -26 }, 0)
          .to(walker, { y: '-=4', duration: 0.14, repeat: 1, yoyo: true }, 0);
        return (progress: number) => {
          tl.progress((progress || 0) % 1);
        };
      };

      const corridor = ({
        section,
        track,
        walker,
        dir,
      }: {
        section: HTMLElement | null;
        track: HTMLElement | null;
        walker: HTMLElement | null;
        dir: 1 | -1;
      }) => {
        if (!section || !track || !walker) return;
        const step = makeWalkCycle(walker);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.max(0, track.scrollWidth - window.innerWidth + window.innerHeight * 0.25)}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => step(self.progress * 40),
          },
        });

        const getOffset = () => Math.max(0, track.scrollWidth - window.innerWidth);
        timeline
          .fromTo(
            track,
            {
              x: () => (dir === 1 ? 0 : -getOffset()),
            },
            {
              x: () => (dir === 1 ? -getOffset() : 0),
              ease: 'none',
            },
            0,
          )
          .fromTo(
            walker,
            {
              x: () =>
                dir === 1
                  ? window.innerWidth * 0.05
                  : window.innerWidth - window.innerWidth * 0.05 - walker.offsetWidth,
            },
            {
              x: () =>
                dir === 1
                  ? window.innerWidth - window.innerWidth * 0.05 - walker.offsetWidth
                  : window.innerWidth * 0.05,
              ease: 'none',
            },
            0,
          );
      };

      corridor({ section: row1Ref.current, track: track1Ref.current, walker: walker1Ref.current, dir: 1 });
      corridor({ section: row2Ref.current, track: track2Ref.current, walker: walker2Ref.current, dir: -1 });

      const walkerRoadEl = walkerRoadRef.current;
      const yr2025El = yr2025Ref.current;
      const yr2024El = yr2024Ref.current;
      const roadSection = roadRef.current;
      const stepRoad = makeWalkCycle(walkerRoadEl);

      const rebuildRoad = () => {
        if (!roadSection || !walkerRoadEl || !yr2025El || !yr2024El) return;

        if (roadTimeline) {
          roadTimeline.scrollTrigger?.kill();
          roadTimeline.kill();
          roadTimeline = null;
        }

        gsap.set([walkerRoadEl, yr2025El, yr2024El], { clearProps: 'all' });

        const vh = window.innerHeight;
        const rect2025 = yr2025El.getBoundingClientRect();
        const rect2024 = yr2024El.getBoundingClientRect();

        const y2025TwoThirds = vh * (2 / 3) - rect2025.top;
        const y2025OneThird = vh * (1 / 3) - rect2025.top;
        const y2025Off = -vh * 0.25 - rect2025.top;
        const y2024Half = vh * 0.5 - rect2024.top;
        const y2024OneThird = vh * (1 / 3) - rect2024.top;
        const y2024Off = -vh * 0.25 - rect2024.top;
        const walkMid = vh * 0.6;
        const walkDeep = vh * 1.8;

        roadTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: roadSection,
            start: 'top top',
            end: '+=360vh',
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => stepRoad(self.progress * 40),
          },
        });

        roadTimeline
          .set(walkerRoadEl, { y: 0, scale: 1 }, 0)
          .set(yr2025El, { y: y2025TwoThirds }, 0)
          .set(yr2024El, { y: y2024Half }, 0)
          .to(walkerRoadEl, { y: walkMid, scale: 1.12, ease: 'none' }, 0)
          .to(yr2025El, { y: y2025OneThird, ease: 'none' }, 0)
          .to(walkerRoadEl, { y: walkDeep, scale: 1.6, ease: 'none' }, '+=0.001')
          .to(yr2025El, { y: y2025Off, ease: 'none' }, '-=0.6')
          .to(yr2024El, { y: y2024OneThird, ease: 'none' }, '-=0.6')
          .to(yr2024El, { y: y2024Off, ease: 'none' }, '+=0.35');
      };

      rebuildRoad();
      const handleResize = () => {
        rebuildRoad();
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', handleResize);
      cleanupFns.push(() => window.removeEventListener('resize', handleResize));
    }, rootRef);

    return () => {
      cleanupFns.forEach((fn) => fn());
      if (roadTimeline) {
        roadTimeline.scrollTrigger?.kill();
        roadTimeline.kill();
      }
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
          <div className="ground" />
          <div className="trap-col">
            <div className="trap-road" />
          </div>
          <Walker ref={walkerRoadRef} className="walker-road" />
          <div className="years">
            <div className="yr y2025" ref={yr2025Ref}>
              2025
            </div>
            <div className="yr y2024" ref={yr2024Ref}>
              2024
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArtProjectPage;
