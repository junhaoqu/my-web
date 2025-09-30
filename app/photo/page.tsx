'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './photo.css';

gsap.registerPlugin(ScrollTrigger);

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const buildCloudinaryImageUrl = (publicId: string) => {
  if (!cloudName) return "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
};

const PhotoPage = () => {
  const bgImages = [
    "firework1_cshymx",
    "Star_trail_small_r3zut3",
  ];

  const [currentBgIndex, setCurrentBgIndex] = React.useState(0);

  const handlePrev = () => {
    setCurrentBgIndex((prevIndex) => (prevIndex - 1 + bgImages.length) % bgImages.length);
  };

  const handleNext = () => {
    setCurrentBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
  };


  useEffect(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".photo-wrapper",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: true,
      }
    });

    timeline
      .to(".photo-image", {
        scale: 3,
        z: 400,
        transformOrigin: "center center",
        ease: "power1.inOut"
      })
      .to(
        ".section.hero",
        {
          scale: 1.1,
          transformOrigin: "center center",
          ease: "power1.inOut"
        },
        "<"
      );

    return () => {
      timeline.kill();
    };
  }, []);

  const heroStyle = {
    backgroundImage: `url(${buildCloudinaryImageUrl(bgImages[currentBgIndex])})`,
    transition: 'background-image 0.5s ease-in-out',
  };

  return (
    <div className="photo-wrapper">
      <div className="photo-content">
        <section className="section hero" style={heroStyle}></section>
      </div>
      <div className="image-container">
        <img src={buildCloudinaryImageUrl("window_k8hdtc")} alt="image" className="photo-image" />
      </div>

      <button onClick={handlePrev} className="arrow-button left-arrow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.75 19.5L8.25 12L15.75 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button onClick={handleNext} className="arrow-button right-arrow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.25 4.5L15.75 12L8.25 19.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default PhotoPage;
