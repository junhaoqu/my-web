"use client";
import React from 'react';

const AbgentDetails: React.FC<{ isDark?: boolean }> = ({ isDark }) => {
  const textColor = isDark ? 'text-gray-200' : 'text-neutral-700';
  return (
  <div className={`prose max-w-none ${textColor} text-base`}>
      <h4 className="font-semibold">Abgent, Inc — San Diego, CA</h4>
      <p className="text-xs italic">Software Developer Intern — Jun 2023 - Aug 2023</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>Built exhaustive paper search engine integrating OCR for text extraction and vectorization into vector database accurately.</li>
        <li>Implemented Semantic Scholar API for high-quality metadata access achieving <strong>40%</strong> enhancement in search relevance.</li>
        <li>Integrated GPT-4 API with Stream mode streamlining translation process reducing processing time by <strong>50-80%</strong> effectively.</li>
        <li>Pioneered React.js pagination system featuring selectable page sizes cutting server requests by <strong>60%</strong> improving performance.</li>
      </ul>
    </div>
  );
};

export default AbgentDetails;
