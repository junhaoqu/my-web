"use client";
import React from 'react';

const UCSDDetails: React.FC<{ isDark?: boolean }> = ({ isDark }) => {
  const textColor = isDark ? 'text-gray-200' : 'text-neutral-700';
  return (
  <div className={`prose max-w-none ${textColor} text-base`}>
      <h4 className="font-semibold">UCSD Mental Health team — San Diego, CA</h4>
      <p className="text-xs italic">Software Developer — Jan 2024 - Apr 2025</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>Orchestrated Agile team through all SDLC stages architecting mobile goal-tracking application ensuring <strong>95%</strong> on-time delivery.</li>
        <li>Incorporated collaborative estimation and pair programming for asynchronous collaboration across distributed development team members effectively.</li>
        <li>Led <strong>80%</strong> of frontend development and UI/UX using Next.js, React, TypeScript, and CSS.</li>
        <li>Engineered responsive user interface using Model-View-Presenter architecture with adapter patterns improved user experience through optimized rendering enhancing UI responsiveness by <strong>150ms.</strong></li>
        <li>Independently expanded application functionality by developing an AI-driven tarot card for iOS (Swift) and Android (Java / Gradle) attracting <strong>5k+</strong> additional monthly active users.</li>
      </ul>
    </div>
  );
};

export default UCSDDetails;
