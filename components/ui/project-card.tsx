'use client';

import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  date: string;
  description: string;
  tags: string[];
  websiteUrl: string;
  imageUrl: string;
  isDark: boolean;
}

const ProjectCard = ({ title, date, description, tags, websiteUrl, imageUrl, isDark }: ProjectCardProps) => {
  return (
    <motion.div
      className={`rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ${!isDark ? 'bg-white' : ''}`}
      style={{ ...(isDark ? { background: '#131414ff' } : {}), transform: 'scaleY(0.7)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img src={imageUrl} alt={`[${title}项目的截图]`} className="w-full h-48 object-cover" />
  <div className="pl-3 pr-4 py-6 text-left">
        <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-xs mb-4 ${isDark ? 'text-white' : 'text-gray-500'}`}>{date}</p>
        <p className={`text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-700'}`}>
          {description}
        </p>
  <div className="flex flex-wrap gap-2 mb-6 justify-start">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] font-semibold px-2 py-1 rounded-full ${!isDark ? 'bg-gray-200 text-gray-800' : ''}`}
              style={isDark ? { background: '#414344ff', color: '#fff' } : undefined}
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-3 py-1.5 font-semibold rounded-lg transition-colors duration-300 text-sm ${isDark ? 'bg-gray-100 text-gray-900 hover:bg-gray-300' : 'bg-gray-900 text-white hover:bg-gray-700'} ml-0 mt-1`}
          style={{ marginLeft: 0 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          Website
        </a>
      </div>
    </motion.div>
  );
};

export default ProjectCard;