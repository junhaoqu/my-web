"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import LogoLoop, { LogoItem } from '@/components/ui/LogoLoop';
import { AuroraBackground } from '@/components/ui/aurora-background';
import AWSDetails from '@/components/ui/AWSDetails';
import UCSDDetails from '@/components/ui/UCSDDetails';
import AbgentDetails from '@/components/ui/AbgentDetails';
import ProjectProgressBar from "@/components/ProjectProgressBar";
import { ExpandableCard, ExpandedCardModal } from "@/components/ui/expandable-card";
import ProjectCard from "@/components/ui/project-card";
import { Timeline } from "@/components/ui/time-line";
import TargetCursor from '@/components/TargetCursor';


// Define the type for card data
interface CardData {
  description: string;
  title: string;
  src: string;
  expandedSrc?: string;
  ctaText?: string;
  ctaLink?: string;
  content?: () => React.ReactNode;
}


// work experiences are defined inside the component so they can access runtime state like `isDark` when needed.

const projects = [
    {
        title: "Chat Collect",
        date: "Jan 2024 - Feb 2024",
        description: "With the release of the OpenAI GPT Store, I decided to build a SaaS which allows users to collect email addresses from their GPT users. This is a great way to build an audience and monetize your GPT API usage.",
        tags: ["Next.js", "Typescript", "PostgreSQL", "Prisma", "TailwindCSS", "Stripe", "Shadcn UI", "Magic UI"],
        websiteUrl: "#", // Replace with actual URL
        imageUrl: "https://placehold.co/600x400/f87171/ffffff?text=Chat+Collect"
    },
    {
        title: "AI Portfolio",
        date: "Mar 2024 - Present",
        description: "An AI-powered portfolio website that showcases my projects and skills. It uses Gemini to provide an interactive experience.",
        tags: ["Next.js", "Typescript", "TailwindCSS", "Framer Motion", "Gemini API"],
        websiteUrl: "#", // Replace with actual URL
        imageUrl: "https://placehold.co/600x400/71f8f1/ffffff?text=AI+Portfolio"
    },
    {
        title: "Project 2023",
        date: "Jun 2023 - Aug 2023",
        description: "A project from 2023 to demonstrate the timeline.",
        tags: ["React", "Gatsby"],
        websiteUrl: "#",
        imageUrl: "https://placehold.co/600x400/c084fc/ffffff?text=Project+2023"
    }
].sort((a, b) => new Date(b.date.split(' - ')[0]).getTime() - new Date(a.date.split(' - ')[0]).getTime());

export default function ProjectPage() {
  // ...existing code...
  const [isDark, setIsDark] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);

  const workExperiences: CardData[] = [
    {
      src: "/images/icon/ucsd.png",
  title: "Amazon Web Services",
  description: "Software Developer Intern",
  content: () => <AWSDetails isDark={isDark} />,
    },
    {
      src: "/images/icon/jacobs.jpeg",
  title: "UCSD Mental Health",
  description: "Software Developer",
  expandedSrc: "/images/profile/Front.jpeg",
  content: () => <UCSDDetails isDark={isDark} />,
    },
    {
      src: "/images/icon/Abgent-Logo.jpg",
  title: "Abgent, Inc",
  description: "Software Developer Intern",
  expandedSrc: "/images/icon/abcepta.png",
  content: () => <AbgentDetails isDark={isDark} />,
    },
  ];

  const workRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);
  const projectCardsContainerRef = useRef<HTMLDivElement>(null);
  const yearRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [timelineData, setTimelineData] = useState<{ title: string; top: number }[]>([]);

  const sectionRefs = [workRef, projectsRef, connectRef];

  const projectsByYear = useMemo(() => {
    return projects.reduce((acc, project) => {
      const year = new Date(project.date.split(' - ')[0]).getFullYear().toString();
      (acc[year] ||= []).push(project);
      return acc;
    }, {} as Record<string, typeof projects>);
  }, []);

  const sortedYears = useMemo(
    () => Object.keys(projectsByYear).sort((a, b) => parseInt(b) - parseInt(a)),
    [projectsByYear]
  );

  const calculatePositions = useCallback(() => {
    if (!projectCardsContainerRef.current) return;
    const next: { title: string; top: number }[] = [];
    for (const year of sortedYears) {
      const el = yearRefs.current[year];
      if (!el) continue;
      const top = el.offsetTop - projectCardsContainerRef.current.offsetTop;
      next.push({ title: year, top });
    }
    // prevent state churn if equal
    setTimelineData(prev => {
      if (prev.length === next.length && prev.every((p, i) => p.title === next[i].title && p.top === next[i].top)) {
        return prev;
      }
      return next;
    });
  }, [sortedYears]);

  useEffect(() => {
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calculatePositions);
    });

    if (projectCardsContainerRef.current) {
      ro.observe(projectCardsContainerRef.current);
    }
    // run once after mount & when sortedYears change meaningfully
    calculatePositions();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [calculatePositions]);

  useEffect(() => {
    console.log('Initializing theme...');
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // 默认使用 dark 主题，除非用户明确选择了 light
    const shouldBeDark = storedTheme === 'light' ? false : true;
    setIsDark(shouldBeDark);
    document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
    console.log('Theme initialized to:', shouldBeDark ? 'dark' : 'light');

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // workIconLogos 必须在 isDark 初始化后定义
  const workIconLogos: LogoItem[] = [
  { src: "/images/icon/Android.png", alt: "Android" },
  { src: "/images/icon/AWS.png", alt: "AWS", className: "logo-circle-bg", style: { background: '#fff', borderRadius: '50%', padding: '4px', boxSizing: 'content-box' as React.CSSProperties['boxSizing'] } },
  { src: "/images/icon/Docker.png", alt: "Docker" },
  { src: isDark ? "/images/icon/github-mark-white.png" : "/images/icon/github-mark.png", alt: "GitHub" },
  { src: "/images/icon/Go.png", alt: "Go" },
  { src: "/images/icon/Java.png", alt: "Java" },
  { src: "/images/icon/Kubernetes.png", alt: "Kubernetes" },
  { src: "/images/icon/Linux.png", alt: "Linux" },
  { src: "/images/icon/MySQL.png", alt: "MySQL" },
  { src: "/images/icon/Next.js.png", alt: "Next.js", className: "logo-circle-bg", style: { background: '#fff', borderRadius: '50%', padding: '4px', boxSizing: 'content-box' as React.CSSProperties['boxSizing'] } },
  { src: "/images/icon/React.png", alt: "React" },
  ];


const projectIconLogos: LogoItem[] = [
  { src: "/images/icon/Pandas.png", alt: "Pandas" },
  { src: "/images/icon/Python.png", alt: "Python" },
  { src: "/images/icon/TensorFlow.png", alt: "TensorFlow" },
  { src: "/images/icon/AWS.png", alt: "AWS", className: "logo-circle-bg", style: { background: '#fff', borderRadius: '50%', padding: '4px', boxSizing: 'content-box' as React.CSSProperties['boxSizing'] } },
  { src: "/images/icon/React.png", alt: "React" },
  { src: "/images/icon/Swift.png", alt: "Swift" },
  { src: "/images/icon/Kubernetes.png", alt: "Kubernetes" },
  { src: "/images/icon/CSS3.png", alt: "CSS3" },
  { src: "/images/icon/Next.js.png", alt: "Next.js", className: "logo-circle-bg", style: { background: '#fff', borderRadius: '50%', padding: '6px', boxSizing: 'content-box' as React.CSSProperties['boxSizing'] } },
];

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.setAttribute('data-theme', newIsDark ? 'dark' : 'light');
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const jumpToStage = (stageIndex: number) => {
    const ref = sectionRefs[stageIndex];
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const total = docHeight - windowHeight;
      const nextProgress = total > 0 ? Math.min(1, scrollY / total) : 0;

      setScrollProgress(prev => (prev === nextProgress ? prev : nextProgress));

      // stage calc
      let nextStage = 0;
      for (let i = sectionRefs.length - 1; i >= 0; i--) {
        const ref = sectionRefs[i];
        if (ref.current && scrollY >= ref.current.offsetTop - windowHeight / 2) {
          nextStage = i;
          break;
        }
      }
      setCurrentStage(prev => (prev === nextStage ? prev : nextStage));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const fontColor = isDark ? '#fff' : '#222';

  return (
    <AuroraBackground className="relative min-h-[350vh]">
      <main className="relative z-10 flex flex-col items-center gap-16 text-center px-4" style={{ color: fontColor }}>
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

        <section id="work" ref={workRef} className="w-full min-h-screen flex flex-col items-center pt-4">
          <h1 className="text-5xl font-semibold tracking-tight w-full pb-8 " style={{ top: '20px',fontFamily: 'Audiowide, cursive' }}>Work Experience</h1>

          <div style={{ margin: '32px 0', width: '100%' }}>
            <div className="w-full flex justify-center">
              <div className="max-w-md w-full mx-auto">
                <LogoLoop logos={workIconLogos} speed={120} direction="right" logoHeight={48} gap={40} pauseOnHover scaleOnHover ariaLabel="Work Tech Logo Loop" className="bg-transparent shadow-none border-none" />
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-3xl space-y-4">
            {/* 调整最大宽度为 540px，更窄更紧凑 */}
            <div className="w-full max-w-md mx-auto space-y-4">
              {workExperiences.map((work, i) => (
                <ExpandableCard key={i} card={work} active={activeCard} setActive={setActiveCard} isDark={isDark} />
              ))}
            </div>
          </div>
          <div className="mt-16">
            <TargetCursor 
              spinDuration={2}
              hideDefaultCursor={true}
              isDark={isDark}
            />
            

            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3" style={{ fontFamily: 'Audiowide, cursive', fontSize: '36px', lineHeight: 1 }}>
                <span className="uppercase">ship</span>
                <span className="uppercase cursor-target">Fast</span>
              </div>
              <div className="flex items-center gap-3" style={{ fontFamily: 'Audiowide, cursive', fontSize: '36px', lineHeight: 1 }}>
                <span className="uppercase">ship</span>
                <span className="uppercase cursor-target">Clean</span>
              </div>
              <div className="flex items-center gap-3" style={{ fontFamily: 'Audiowide, cursive', fontSize: '36px', lineHeight: 1 }}>
                <span className="uppercase">ship</span>
                <span className="uppercase cursor-target">Scalable</span>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" ref={projectsRef} className="w-full min-h-screen flex flex-col justify-center items-center pt-24">
          <h2 className="text-5xl font-semibold tracking-tight w-full pb-8" style={{ fontFamily: 'Audiowide, cursive' }}>Projects</h2>
           <div style={{ margin: '32px 0', width: '100%' }}>
            <div className="w-full flex justify-center">
              <div className="max-w-md w-full mx-auto">
                <LogoLoop logos={projectIconLogos} speed={100} direction="right" logoHeight={48} gap={40} pauseOnHover scaleOnHover ariaLabel="Project Tech Logo Loop" className="bg-transparent shadow-none border-none" />
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-6 w-full max-w-6xl mx-auto">
              <div className="col-start-1 col-span-1 pr-6 relative">
                <Timeline containerRef={projectCardsContainerRef} data={timelineData} />
              </div>
              <div className="col-start-2 col-span-4" ref={projectCardsContainerRef}>
                {sortedYears.map(year => (
                  <div key={year} ref={el => { yearRefs.current[year] = el; }} className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {projectsByYear[year].map(project => (
                        <ProjectCard key={project.title} {...project} isDark={isDark} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="connect" ref={connectRef} className="w-full min-h-screen flex flex-col justify-center items-center pt-24">
          <h2 className="text-4xl font-semibold tracking-tight w-full pb-2">Connect</h2>
          <p>What content should be here?</p>
        </section>
      </main>

      <ExpandedCardModal active={activeCard} setActive={setActiveCard} isDark={isDark} />

      <ProjectProgressBar
        scrollProgress={scrollProgress}
        currentStage={currentStage}
        totalStages={3}
        isDark={isDark}
        onJumpToStage={jumpToStage}
      />
    </AuroraBackground>
  );
}
