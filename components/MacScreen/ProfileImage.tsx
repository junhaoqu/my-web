"use client";
import React from "react";
import Image from "next/image";

const ProfileImage: React.FC = () => {
  return (
    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-lg">
      <Image
        src="/images/github.png"
        alt="Profile"
        width={160}
        height={160}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ProfileImage;
