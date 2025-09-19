"use client";
import React, { useEffect, useRef, useCallback, useMemo } from "react";

interface PersonalIntroProps {
  className?: string;
  enableTilt?: boolean;
  contactText?: string;
  onContactClick?: () => void;
}

const DEFAULT_BEHIND_GRADIENT =
  'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
} as const;

const clamp = (value: number, min = 0, max = 100): number => Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3): number => parseFloat(value.toFixed(precision));
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const PersonalIntro: React.FC<PersonalIntroProps> = ({
  className = '',
  enableTilt = true,
  contactText = 'Contact Me',
  onContactClick
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;

    const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };

    const createSmoothAnimation = (
      duration: number,
      startX: number,
      startY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(event.clientX - rect.left, event.clientY - rect.top, card, wrap);
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add('active');
    card.classList.add('active');
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        event.offsetX,
        event.offsetY,
        card,
        wrap
      );
      wrap.classList.remove('active');
      card.classList.remove('active');
    },
    [animationHandlers]
  );

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;

    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap) return;

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;

    card.addEventListener('pointerenter', pointerEnterHandler);
    card.addEventListener('pointermove', pointerMoveHandler);
    card.addEventListener('pointerleave', pointerLeaveHandler);

    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;

    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(ANIMATION_CONFIG.INITIAL_DURATION, initialX, initialY, card, wrap);

    return () => {
      card.removeEventListener('pointerenter', pointerEnterHandler);
      card.removeEventListener('pointermove', pointerMoveHandler);
      card.removeEventListener('pointerleave', pointerLeaveHandler);
      animationHandlers.cancelAnimation();
    };
  }, [
    enableTilt,
    animationHandlers,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
  ]);

  const cardStyle = useMemo(
    () =>
      ({
        '--behind-gradient': DEFAULT_BEHIND_GRADIENT,
        '--inner-gradient': DEFAULT_INNER_GRADIENT
      }) as React.CSSProperties,
    []
  );

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  return (
    <div 
      ref={wrapRef} 
      className={`pc-card-wrapper ${className}`.trim()} 
      style={{
        ...cardStyle,
        perspective: '500px',
        transform: 'translate3d(0, 0, 0.1px)',
        position: 'relative',
        touchAction: 'none',
        '--pointer-x': '50%',
        '--pointer-y': '50%',
        '--pointer-from-center': '0',
        '--pointer-from-top': '0.5',
        '--pointer-from-left': '0.5',
        '--card-opacity': '0',
        '--rotate-x': '0deg',
        '--rotate-y': '0deg',
        '--background-x': '50%',
        '--background-y': '50%',
        '--card-radius': '1.5rem',
      } as React.CSSProperties}
    >
      {/* 背景光晕 */}
      <div 
        className="absolute -inset-2 rounded-[1.5rem] transition-all duration-500 ease-out"
        style={{
          background: 'rgba(99, 102, 241, 0.15)',
          borderRadius: 'inherit',
          filter: 'blur(24px)',
          transform: 'scale(0.85) translate3d(0, 0, 0.1px)',
          opacity: 0.6,
        }}
      />
      
      <section 
        ref={cardRef}
        className="pc-card relative rounded-[1.5rem] overflow-hidden transition-transform duration-300 ease-out"
        style={{
          height: '320px',
          width: '320px',
          display: 'grid',
          aspectRatio: '0.718',
          borderRadius: 'var(--card-radius)',
          position: 'relative',
          boxShadow: `rgba(0, 0, 0, 0.3) calc((var(--pointer-from-left) * 10px) - 3px) calc((var(--pointer-from-top) * 20px) - 6px) 20px -5px`,
          transition: 'transform 1s ease',
          transform: 'translate3d(0, 0, 0.1px) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        >
        {/* 内层容器 */}
        <div 
          className="pc-inside absolute inset-0 rounded-[1.5rem]"
          style={{
            position: 'absolute',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(30px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            transform: 'translate3d(0, 0, 0.01px)',
          }}
        >
          {/* 轻微的光晕效果 */}
          <div 
            className="absolute inset-0 rounded-[1.5rem] overflow-hidden opacity-20"
            style={{
              background: `radial-gradient(
                farthest-corner circle at var(--pointer-x) var(--pointer-y),
                rgba(99, 102, 241, 0.4) 0%,
                rgba(168, 85, 247, 0.3) 40%,
                rgba(59, 130, 246, 0.2) 70%,
                transparent 100%
              )`,
              mixBlendMode: 'soft-light',
            }}
          />          {/* 内容 */}
          <div 
            className="pc-content relative z-10 h-full text-center"
            style={{
              maxHeight: '100%',
              overflow: 'hidden',
              textAlign: 'center',
              position: 'relative',
              transform: `translate3d(
                calc(var(--pointer-from-left) * -3px + 1.5px),
                calc(var(--pointer-from-top) * -3px + 1.5px),
                0.1px
              )`,
              zIndex: 5,
            }}
          >
            <div 
              className="pc-details absolute top-12 w-full flex flex-col"
              style={{
                width: '100%',
                position: 'absolute',
                top: '3em',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h3 
                className="text-2xl font-semibold mb-4 m-0"
                style={{
                  fontWeight: 600,
                  margin: 0,
                  fontSize: 'min(5svh, 3em)',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                About Me
              </h3>
              <p 
                className="text-base leading-relaxed m-0 px-6"
                style={{
                  fontWeight: 400,
                  position: 'relative',
                  top: '-12px',
                  fontSize: '14px',
                  margin: '0 auto',
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  lineHeight: '1.5',
                }}
              >
                Hi, I'm a passionate full-stack developer with expertise in modern web technologies. 
                I love creating beautiful and functional user experiences with React, Next.js, and TypeScript.
              </p>
            </div>

            {/* 联系信息 */}
            <div 
              className="pc-user-info absolute bottom-5 left-5 right-5 z-10 flex items-center justify-center"
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '15px',
                padding: '12px 14px',
                pointerEvents: 'auto',
              }}
            >
              <button
                className="pc-contact-btn transition-all duration-200 ease-out hover:bg-white/20 hover:-translate-y-0.5"
                onClick={handleContactClick}
                style={{ 
                  pointerEvents: 'auto',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.95)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
                type="button"
                aria-label="Contact me"
              >
                {contactText}
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .pc-card-wrapper:hover,
        .pc-card-wrapper.active {
          --card-opacity: 1;
        }

        .pc-card-wrapper:hover > div:first-child,
        .pc-card-wrapper.active > div:first-child {
          filter: contrast(1) saturate(1.2) blur(20px) opacity(0.8);
          transform: scale(0.95) translate3d(0, 0, 0.1px);
        }

        .pc-card:hover,
        .pc-card.active {
          transition: none;
        }

        .pc-card * {
          border-radius: var(--card-radius);
          transform: translate3d(0, 0, 0.1px);
          pointer-events: none;
        }

        .pc-contact-btn {
          pointer-events: auto !important;
        }

        @media (max-width: 768px) {
          .pc-card {
            height: 280px;
            max-height: 280px;
          }
          
          .pc-details {
            top: 2em;
          }
          
          .pc-details h3 {
            font-size: min(4svh, 2.5em);
          }
          
          .pc-details p {
            font-size: 12px;
          }
          
          .pc-contact-btn {
            padding: 6px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default PersonalIntro;
