"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BaseWindow from "./BaseWindow";
import { WindowState } from "../types";

interface BrowserWindowProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

const BrowserWindow: React.FC<BrowserWindowProps> = (props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const pages = [
    {
      url: "http://localhost:3000",
      title: "My Portfolio - Home",
      content: "portfolio"
    },
    {
      url: "https://github.com/junhaoqu",
      title: "GitHub - junhaoqu",
      content: "github"
    },
    {
      url: "https://vercel.com/dashboard",
      title: "Vercel Dashboard",
      content: "vercel"
    }
  ];

  useEffect(() => {
    if (props.windowState.isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [props.windowState.isOpen, currentPage]);

  const renderPortfolioContent = () => (
    <div className="p-8 space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl">
          JQ
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Junhao Qu</h1>
        <p className="text-gray-600 text-lg">Full Stack Developer & UI/UX Designer</p>
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Projects
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Contact Me
          </button>
        </div>
      </motion.div>

      {/* Projects Preview */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-3"></div>
            <h3 className="font-semibold text-gray-800">Project {i}</h3>
            <p className="text-sm text-gray-600">Description of project {i}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderGitHubContent = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4 border-b border-gray-200 pb-4">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl">
          JQ
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">junhaoqu</h2>
          <p className="text-gray-600">Full Stack Developer</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {['my-portfolio', 'react-components', 'next-app', 'ui-library'].map((repo) => (
          <div key={repo} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-600">{repo}</h3>
            <p className="text-sm text-gray-600 mt-1">A description of {repo}</p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                TypeScript
              </span>
              <span>⭐ 12</span>
              <span>🍴 4</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVercelContent = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button className="px-4 py-2 bg-black text-white rounded-lg text-sm">
          Import Project
        </button>
      </div>
      
      <div className="space-y-4">
        {['my-portfolio', 'portfolio-v2', 'landing-page'].map((project) => (
          <div key={project} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
              <div>
                <h3 className="font-semibold text-gray-900">{project}</h3>
                <p className="text-sm text-gray-600">junhaoqu.vercel.app</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                Ready
              </span>
              <button className="text-gray-400 hover:text-gray-600">⋯</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      );
    }

    switch (pages[currentPage].content) {
      case "portfolio":
        return renderPortfolioContent();
      case "github":
        return renderGitHubContent();
      case "vercel":
        return renderVercelContent();
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <BaseWindow {...props} title="Safari">
      <div className="h-full flex flex-col">
        {/* 浏览器工具栏 */}
        <div className="h-12 bg-gray-100 border-b border-gray-300 flex items-center px-4 space-x-3">
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              className="w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-xs"
              disabled={currentPage === 0}
            >
              ←
            </button>
            <button 
              onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
              className="w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-xs"
              disabled={currentPage === pages.length - 1}
            >
              →
            </button>
          </div>
          
          <div className="flex-1 bg-white rounded-lg px-3 py-1 text-sm text-gray-700 border border-gray-300">
            {pages[currentPage].url}
          </div>
          
          <button className="w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-xs">
            ⟳
          </button>
        </div>

        {/* 网页内容 */}
        <div className="flex-1 bg-white overflow-auto">
          {renderContent()}
        </div>
      </div>
    </BaseWindow>
  );
};

export default BrowserWindow;
