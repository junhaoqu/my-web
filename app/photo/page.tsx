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
  useEffect(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".photo-wrapper",
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: true,
      }
    });

    timeline
      .to(".photo-image", {
        scale: 3,
        z: 360,
        transformOrigin: "center center",
        ease: "power1.inOut"
      })
      .to(
        ".section.hero",
        {
          scale: 1,
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
    backgroundImage: `url(${buildCloudinaryImageUrl("firework1_cshymx")})`,
  };

  return (
    <div className="photo-wrapper">
      <div className="photo-content">
        <section className="section hero" style={heroStyle}></section>
      </div>
      <div className="image-container">
        <img src={buildCloudinaryImageUrl("window_k8hdtc")} alt="image" className="photo-image" />
      </div>
    </div>
  );
};

export default PhotoPage;
