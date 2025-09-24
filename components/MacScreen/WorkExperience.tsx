"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";

interface ExperienceCard {
  title: string;
  description: string;
  src: string;
  ctaText: string;
  ctaLink: string;
  content: () => React.ReactNode
  imageStyle?: {
    scale?: number;        // 图片缩放比例 (0.5 - 1.5)
    objectFit?: 'contain' | 'cover' | 'fill';  // 图片适应方式
    padding?: number;      // 内边距 (0-4)
    objectPosition?: string;  // 图片位置 ('center', 'top', 'bottom', 'left', 'right', etc.)
    translateX?: number;   // X轴偏移 (-50 到 50)
    translateY?: number;   // Y轴偏移 (-50 到 50)
  };
  buttonStyle?: {
    background: string;
    hoverBackground: string;
    textColor: string;
    hoverTextColor?: string;
  };
}

const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black dark:text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};

const experienceCards: ExperienceCard[] = [
   {
    title: "UCSD - Jacobs School of Engineering",
    description: "Master of Computer Science (Exp. Dec 2025)",
    src: "/images/icon/jacobs.jpeg",
    ctaText: "Explore",
    ctaLink: "https://cse.ucsd.edu/graduate/degree-programs/ms-program",
    imageStyle: {
      scale: 1.3,
      objectFit: 'cover',
      padding: 0,
      objectPosition: '50% 40%',
    },
    buttonStyle: {
      background: "rgba(40, 67, 125, 1)",
      hoverBackground: "rgb(29, 78, 216)",
      textColor: "rgb(255, 255, 255)",
    },
    content: () => (
      <p className="text-neutral-600 dark:text-neutral-400">
        Currently pursuing a Master's degree with a <strong>3.8/4.0 GPA</strong>. 
        My coursework includes advanced topics like Computer Systems, Computer Networks, and Machine Learning & Deep Learning.
        <br /><br />
        I am actively applying these concepts to address real-world challenges through advanced computational techniques.
      </p>
    ),
  },
  {
    title: "UC San Diego",
    description: "B.S. in Math & Computer Science",
    src: "/images/icon/ucsd.png",
    ctaText: "Explore",
    ctaLink: "https://math.ucsd.edu/students/undergraduate/ma30-math-computer-science-b-s",
    imageStyle: {
      scale: 0.8,
      objectFit: 'contain',
      padding: 2
    },
    buttonStyle: {
      background: "rgba(31, 55, 107, 1)",
      hoverBackground: "rgb(29, 78, 216)",
      textColor: "rgb(255, 255, 255)",
    },
    content: () => (
      <p className="text-neutral-600 dark:text-neutral-400">
        Graduated in June 2024 with a <strong>3.9/4.0 GPA</strong> and <strong>Cum Laude Honors</strong>. 
        This program provided a strong foundational understanding of both theoretical and practical aspects of computer science and mathematics.
        <br /><br />
        My coursework included Data Structures, Algorithms, Probability, and Statistics.
      </p>
    ),
  },
  {
    title: "AWS Cloud Solutions",
    description: "Software Developer Intern, EC2 Core Platform",
    src: "/images/icon/ec2.jpg",
    ctaText: "Explore",
    ctaLink: "https://aws.amazon.com",
    imageStyle: {
      scale: 2,
      objectFit: 'contain',
      padding: 1
    },
    buttonStyle: {
      background: "rgba(49, 97, 67, 1)",
      hoverBackground: "rgba(44, 96, 63, 1)",
      textColor: "rgb(255, 255, 255)",
    },
    content: () => (
      <p className="text-neutral-600 dark:text-neutral-400">
        Worked backwards from customer pain points and conducted deep dives into reservation patterns to design and implement an automated scale-up system. 
        This customer-obsessed approach not only improved reliability and responsiveness, 
        but also delivered tangible benefits—cutting <strong>API latency by 50%</strong> and reducing manual overhead by <strong>35%</strong> for billions of enterprise users.
      </p>
    ),
  },
  {
    title: "Abgent Biotech",
    description: "Software Development Intern",
    src: "/images/icon/Abgent-Logo.jpg",
    ctaText: "Explore",
    ctaLink: "https://www.abcepta.com",
    imageStyle: {
      scale: 0.7,
      objectFit: 'contain',
      padding: 3
    },
    buttonStyle: {
      background: "rgba(19, 103, 50, 1)",
      hoverBackground: "rgb(22, 163, 74)",
      textColor: "rgb(255, 255, 255)",
    },
    content: () => (
      <p className="text-neutral-600 dark:text-neutral-400">
        Passionately explored the frontier of AI by working backwards from customer needs and diving deep into complex systems, 
        from building scalable search and translation platforms to applying AI agents in the biochemical domain, 
        delivering reliable knowledge bases and intuitive AI assistance that empowered experts and elevated research efficiency.
      </p>
    ),
  },
];

const WorkExperience: React.FC = () => {
  const [active, setActive] = useState<ExperienceCard | boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[250px]"> {/* 与TechStack玻璃容器宽度完全一致 */}
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[70]">
            <motion.button
              key={`button-${active.title}-${id}`}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white dark:bg-gray-800 rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <div
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
                <div>
                  <div className="flex justify-between items-start p-4">
                    <div className="">
                      {/* 标题和描述只在弹出时显示 */}
                      <h3 className="font-bold text-neutral-700 dark:text-neutral-200">
                        {active.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {active.description}
                      </p>
                    </div>

                    <motion.a
                      href={active.ctaLink}
                      target="_blank"
                      className="px-4 py-3 text-sm rounded-full font-bold transition-colors"
                      style={{
                        backgroundColor: active.buttonStyle?.background || "rgb(59, 130, 246)",
                        color: active.buttonStyle?.textColor || "rgb(255, 255, 255)",
                      }}
                      whileHover={{
                        backgroundColor: active.buttonStyle?.hoverBackground || "rgb(37, 99, 235)",
                        color:
                          active.buttonStyle?.hoverTextColor ||
                          active.buttonStyle?.textColor ||
                          "rgb(255, 255, 255)",
                      }}
                    >
                      {active.ctaText}
                    </motion.a>
                  </div>
                  <div className="pt-4 relative px-4">
                    <div className="text-neutral-600 text-xs md:text-sm lg:text-base pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400">
                      {typeof active.content === "function" ? active.content() : active.content}
                    </div>
                  </div>
                </div>
            </div>
          </div>
        ) : null}
        
        <div className="space-y-2">
          {experienceCards.map((card, index) => (
            <motion.div
              key={`card-${card.title}-${id}`}
              onClick={() => setActive(card)}
              className="relative group cursor-pointer"
            >
              {/* 长条形按钮 */}
              <motion.div 
                className="relative w-full h-12 rounded-lg overflow-hidden bg-white flex items-center px-2"
              >
                {/* 图片容器 */}
                <div className="flex-1 h-full flex items-center justify-center">
                  <Image
                    width={150}
                    height={48}
                    src={card.src}
                    alt={card.title}
                    className={`h-full w-auto transition-transform group-hover:scale-105 ${
                      card.imageStyle?.padding === 0 ? '' :
                      card.imageStyle?.padding === 1 ? 'p-0.5' :
                      card.imageStyle?.padding === 2 ? 'p-1' :
                      card.imageStyle?.padding === 3 ? 'p-1.5' :
                      card.imageStyle?.padding === 4 ? 'p-2' : 'p-1'
                    }`}
                    style={{
                      transform: `scale(${card.imageStyle?.scale || 1}) translate(${card.imageStyle?.translateX || 0}px, ${card.imageStyle?.translateY || 0}px)`,
                      objectFit: card.imageStyle?.objectFit || 'contain',
                      objectPosition: card.imageStyle?.objectPosition || 'center',
                    }}
                  />
                </div>
                
                {/* 小按钮在右侧 */}
                <motion.button
                  className="w-6 h-6 rounded-full text-xs font-bold transition-colors shadow-md flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: card.buttonStyle?.background || "rgb(255, 255, 255)",
                    color: card.buttonStyle?.textColor || "rgb(55, 65, 81)",
                  }}
                  whileHover={{
                    backgroundColor: card.buttonStyle?.hoverBackground || "rgb(59, 130, 246)",
                    color:
                      card.buttonStyle?.hoverTextColor ||
                      card.buttonStyle?.textColor ||
                      "rgb(255, 255, 255)",
                  }}
                >
                  →
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;
