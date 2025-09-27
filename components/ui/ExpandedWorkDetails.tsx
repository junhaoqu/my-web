"use client";
import React from 'react';

interface ExpandedWorkDetailsProps {
  company?: string;
  role?: string;
  bullets: string[];
  isDark?: boolean;
}

const ExpandedWorkDetails: React.FC<ExpandedWorkDetailsProps> = ({ company, role, bullets, isDark = true }) => {
  const textColor = isDark ? 'text-gray-200' : 'text-neutral-700';
  return (
    <div className={`prose max-w-none ${textColor} text-lg`}>
      {company && role && (
        <div className="mb-2">
          <div className="font-semibold">{company}</div>
          <div className="text-base text-neutral-400">{role}</div>
        </div>
      )}
      <ul className="list-disc pl-5 space-y-2">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExpandedWorkDetails;
