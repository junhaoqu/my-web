"use client";
import React, { useRef, useState } from "react";
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
  const links = [
    {
      title: "LinkedIn",
      icon: (
        <Image
          src="/images/icon/linkedin.png"
          width={40}
          height={40}
          alt="LinkedIn"
          className="h-full w-full"
        />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <Image
          src="/images/icon/github-mark-white.png"
          width={40}
          height={40}
          alt="GitHub"
          className="h-full w-full"
        />
      ),
      href: "#",
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
      href: "#",
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
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm"
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
