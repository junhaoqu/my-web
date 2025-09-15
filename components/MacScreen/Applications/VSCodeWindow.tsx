"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BaseWindow from "./BaseWindow";
import { WindowState } from "../types";

interface VSCodeWindowProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

const VSCodeWindow: React.FC<VSCodeWindowProps> = (props) => {
  const [currentLine, setCurrentLine] = useState(1);
  const [typedCode, setTypedCode] = useState("");
  
  const codeContent = `import React from 'react';
import { motion } from 'framer-motion';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    // Fetch projects from API
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="portfolio-container"
    >
      <h1>My Portfolio</h1>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </motion.div>
  );
};

export default Portfolio;`;

  useEffect(() => {
    if (props.windowState.isOpen) {
      const timer = setInterval(() => {
        setTypedCode(prev => {
          if (prev.length < codeContent.length) {
            return codeContent.slice(0, prev.length + 1);
          }
          return prev;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [props.windowState.isOpen, codeContent]);

  return (
    <BaseWindow {...props} title="Visual Studio Code" className="font-mono">
      <div className="flex h-full">
        {/* 侧边栏 */}
        <div className="w-12 bg-gray-800 flex flex-col items-center py-2 space-y-3">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">📁</div>
          <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center text-white text-xs">🔍</div>
          <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center text-white text-xs">🌿</div>
          <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center text-white text-xs">🐛</div>
          <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center text-white text-xs">📦</div>
        </div>

        {/* 文件浏览器 */}
        <div className="w-48 bg-gray-100 border-r border-gray-300">
          <div className="p-2 border-b border-gray-300 text-xs font-semibold text-gray-700">
            EXPLORER
          </div>
          <div className="p-2 space-y-1 text-xs">
            <div className="flex items-center space-x-1">
              <span>📁</span>
              <span className="font-medium">my-portfolio</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex items-center space-x-1">
                <span>📁</span>
                <span>src</span>
              </div>
              <div className="ml-4 space-y-1">
                <div className="flex items-center space-x-1">
                  <span>📁</span>
                  <span>components</span>
                </div>
                <div className="flex items-center space-x-1 bg-blue-100 px-1 rounded">
                  <span>📄</span>
                  <span className="text-blue-700">Portfolio.tsx</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📄</span>
                  <span>App.tsx</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span>📄</span>
                <span>package.json</span>
              </div>
            </div>
          </div>
        </div>

        {/* 编辑器区域 */}
        <div className="flex-1 flex flex-col">
          {/* 标签栏 */}
          <div className="h-8 bg-gray-200 border-b border-gray-300 flex items-center px-2">
            <div className="bg-white border border-gray-300 rounded-t px-3 py-1 text-xs font-medium text-gray-700 flex items-center space-x-2">
              <span>📄</span>
              <span>Portfolio.tsx</span>
              <button className="text-gray-400 hover:text-gray-600">×</button>
            </div>
          </div>

          {/* 代码编辑器 */}
          <div className="flex-1 bg-white overflow-hidden">
            <div className="flex h-full">
              {/* 行号 */}
              <div className="w-12 bg-gray-50 border-r border-gray-200 py-2 text-right text-xs text-gray-500 font-mono">
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i + 1} className={`leading-5 pr-2 ${i + 1 === currentLine ? 'bg-blue-100' : ''}`}>
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* 代码内容 */}
              <div className="flex-1 p-2 text-sm font-mono overflow-auto">
                <pre className="text-gray-800 leading-5">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {typedCode}
                  </motion.span>
                  <motion.span
                    className="bg-blue-500 w-0.5 h-5 inline-block"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </pre>
              </div>
            </div>
          </div>

          {/* 状态栏 */}
          <div className="h-6 bg-blue-600 text-white text-xs flex items-center justify-between px-2">
            <div className="flex items-center space-x-4">
              <span>🌿 main</span>
              <span>⚠️ 0</span>
              <span>❌ 0</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>TypeScript React</span>
              <span>UTF-8</span>
              <span>LF</span>
              <span>Ln {currentLine}, Col 1</span>
            </div>
          </div>
        </div>
      </div>
    </BaseWindow>
  );
};

export default VSCodeWindow;
