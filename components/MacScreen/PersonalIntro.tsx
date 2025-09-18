"use client";
import React from "react";

const PersonalIntro: React.FC = () => {
  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-lg p-6 shadow-lg h-64">
      <h3 className="text-xl font-semibold text-black dark:text-white mb-4">About Me</h3>
      <p className="text-base text-gray-800 dark:text-gray-300 leading-relaxed">
        Hi, I'm a passionate full-stack developer with expertise in modern web technologies. 
        I love creating beautiful and functional user experiences with React, Next.js, and TypeScript. 
        Always excited to learn new technologies and solve challenging problems.
      </p>
    </div>
  );
};

export default PersonalIntro;
