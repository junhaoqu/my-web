"use client";
import React from "react";
import Image from "next/image";

const SocialLinks: React.FC = () => {
  const socialLinks = [
    { name: "LinkedIn", href: "#", icon: "/images/github.png" },
    { name: "GitHub", href: "#", icon: "/images/github.png" },
    { name: "Instagram", href: "#", icon: "/images/github.png" },
  ];

  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-lg p-6 shadow-lg h-40">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Social Links</h3>
      <div className="flex space-x-6 justify-center">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="w-14 h-14 rounded-full overflow-hidden hover:scale-110 transition-transform duration-200 bg-white/20 dark:bg-gray-800 flex items-center justify-center"
          >
            <Image
              src={link.icon}
              alt={link.name}
              width={36}
              height={36}
              className="w-9 h-9 object-cover"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
