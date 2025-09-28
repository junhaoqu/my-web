"use client";

import React, { useState } from 'react';
import { motion } from "motion/react";
import { Mail, Check } from 'lucide-react';

interface ContactButtonProps {
  email: string;
  isDark: boolean;
}

const ContactButton: React.FC<ContactButtonProps> = ({ email, isDark }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <motion.a
      href={`mailto:${email}`}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-3 rounded-full transition-colors"
      style={{
        background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
      }}
      aria-label="Send an email or copy email address"
    >
      {copied ? (
        <Check size={20} style={{ color: isDark ? "#FFFFFF" : "#1a1a1a" }} />
      ) : (
        <Mail size={20} style={{ color: isDark ? "#FFFFFF" : "#1a1a1a" }} />
      )}
    </motion.a>
  );
};

export default ContactButton;