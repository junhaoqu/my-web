"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BaseWindow from "./BaseWindow";
import { WindowState } from "../types";

interface TerminalWindowProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

const TerminalWindow: React.FC<TerminalWindowProps> = (props) => {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  const commands = [
    { 
      command: "npm install", 
      output: `added 1254 packages, and audited 1255 packages in 45s

195 packages are looking for funding
  run \`npm fund\` for details

found 0 vulnerabilities` 
    },
    { 
      command: "npm run dev", 
      output: `> my-portfolio@0.1.0 dev
> next dev

   ▲ Next.js 14.0.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.100:3000

 ✓ Ready in 2.1s` 
    },
    { 
      command: "git status", 
      output: `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   src/components/Portfolio.tsx
        modified:   src/styles/globals.css

no changes added to commit (use "git add ." or "git commit -a")` 
    },
    { 
      command: "git add . && git commit -m 'Update portfolio components'", 
      output: `[main 2f8a9b1] Update portfolio components
 2 files changed, 47 insertions(+), 12 deletions(-)` 
    }
  ];

  useEffect(() => {
    if (props.windowState.isOpen) {
      const timer = setInterval(() => {
        if (currentCommand < commands.length) {
          const current = commands[currentCommand];
          const fullText = `$ ${current.command}\n${current.output}\n\n`;
          
          if (displayedText.length < fullText.length) {
            setDisplayedText(fullText.slice(0, displayedText.length + 1));
          } else {
            setTimeout(() => {
              setCurrentCommand(prev => (prev + 1) % commands.length);
              if (currentCommand === commands.length - 1) {
                setDisplayedText("");
              }
            }, 2000);
          }
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [props.windowState.isOpen, currentCommand, displayedText, commands]);

  return (
    <BaseWindow {...props} title="Terminal" className="font-mono">
      <div className="h-full bg-black text-green-400 p-4 overflow-auto">
        {/* Terminal 头部 */}
        <div className="mb-4 text-gray-500">
          <div>Last login: {new Date().toLocaleString()}</div>
          <div>junhaoqu@MacBook-Pro my-portfolio % </div>
        </div>

        {/* 命令输出 */}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {displayedText}
          <motion.span
            className="bg-green-400 w-2 h-5 inline-block"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </div>

        {/* 底部提示 */}
        <div className="mt-4 text-gray-600 text-xs">
          <div>Common commands:</div>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <div>• npm install - Install dependencies</div>
            <div>• npm run dev - Start development server</div>
            <div>• git status - Check repository status</div>
            <div>• git commit - Commit changes</div>
          </div>
        </div>
      </div>
    </BaseWindow>
  );
};

export default TerminalWindow;
