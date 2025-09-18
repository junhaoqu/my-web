"use client";
import React from "react";
import Image from "next/image";

const TechStack: React.FC = () => {
  const technologies = [
    { name: "React", icon: "/images/github.png" },
    { name: "Next.js", icon: "/images/github.png" },
    { name: "TypeScript", icon: "/images/github.png" },
    { name: "Node.js", icon: "/images/github.png" },
    { name: "Tailwind CSS", icon: "/images/github.png" },
    { name: "Python", icon: "/images/github.png" },
  ];

  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-lg p-6 shadow-lg h-56">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Tech Stack</h3>
      <div className="grid grid-cols-3 gap-4">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="flex flex-col items-center p-3 bg-white/10 dark:bg-gray-800/50 rounded-lg hover:scale-105 transition-transform duration-200"
          >
            <Image
              src={tech.icon}
              alt={tech.name}
              width={28}
              height={28}
              className="w-7 h-7 object-cover mb-2"
            />
            <span className="text-sm text-black dark:text-white text-center">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
