"use client";

import React from "react";
import TerminalWindow from "./Applications/TerminalWindow";

interface MacScreenProps {
  animationProgress?: number;
}

const MacScreen: React.FC<MacScreenProps> = () => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#04050c]">
      <TerminalWindow />
    </div>
  );
};

export default MacScreen;
