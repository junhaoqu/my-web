"use client";
import React from 'react';

const AWSDetails: React.FC<{ isDark?: boolean }> = ({ isDark }) => {
  const textColor = isDark ? 'text-gray-200' : 'text-neutral-700';
  return (
    <div className={`prose max-w-none ${textColor} text-base`}>
      <h4 className="font-semibold">Amazon Web Services (AWS), EC2 Core Platform — Seattle, WA</h4>
      <p className="text-xs italic">Software Developer Intern — Jun 2025 - Sep 2025</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>
          Engineered automated preventative scale-up system expanding capacity reservation system incorporating modify and merge functionality, streamlined ODCR management, reduced API latency by <strong>50%</strong> for billions of enterprise users and reduced manual adjustments by <strong>35%</strong>.
        </li>
        <li>
          Architected Modify sub-recipe and corresponding API model integrated with Create recipe enabling programmatic idempotent modification competently.
        </li>
        <li>
          Engineered matching engine featuring multi-criteria filtering enhanced existing data access methods, integrated composite indexing and pagination reducing database query latency by <strong>20%</strong> using Java for infrastructure effectively.
        </li>
        <li>
          Forged <strong>91%</strong> branch coverage unit tests utilizing internal test tools identifying and resolving three critical bugs systematically, enhanced system reliability and were deployed via the gamma and canary pipeline.
        </li>
      </ul>
    </div>
  );
};

export default AWSDetails;
