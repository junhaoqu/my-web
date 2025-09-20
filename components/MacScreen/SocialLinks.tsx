"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

const SocialLinks: React.FC = () => {
  const [isDark, setIsDark] = useState(true); // 默认深色模式

  useEffect(() => {
    // 监听主题变化
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme === 'dark');
    };

    // 初始化主题
    updateTheme();

    // 监听属性变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const links = [
    {
      title: "LinkedIn",
      icon: (
        <Image
          src="/images/icon/LinkedIn.png"
          width={40}
          height={40}
          alt="LinkedIn"
          className="h-full w-full"
        />
      ),
      href: "https://www.linkedin.com/in/qu-junhao-468b5227b/", // 替换为你的LinkedIn链接
    },
    {
      title: "GitHub",
      icon: (
        <Image
          src={isDark ? "/images/icon/github-mark-white.png" : "/images/icon/github-mark.png"}
          width={40}
          height={40}
          alt="GitHub"
          className="h-full w-full"
        />
      ),
      href: "https://github.com/junhaoqu", // 替换为你的GitHub链接
    },
    {
      title: "Instagram",
      icon: (
        <Image
          src="/images/icon/Instagram_Glyph_Gradient.png"
          width={40}
          height={40}
          alt="Instagram"
          className="h-full w-full"
        />
      ),
      href: "https://www.instagram.com/junhao_qu?igsh=MWJlOTQ1eWFjejRsdw%3D%3D&utm_source=qr", // 替换为你的Instagram链接
    },
  ];

  let mouseX = useMotionValue(Infinity);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="mx-auto flex h-10 items-end gap-6"
      >
        {links.map((item) => (
          <IconContainer mouseX={mouseX} key={item.title} {...item} />
        ))}
      </motion.div>
    </div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [50, 100, 50]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [50, 100, 50]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [30, 60, 30]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [30, 60, 30],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-white/20 bg-white/10 backdrop-blur-md px-2 py-0.5 text-xs whitespace-pre text-black dark:text-white"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}

export default SocialLinks;
