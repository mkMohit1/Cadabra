import React, { useEffect, useRef } from 'react';
import { logoSection } from '../ImagePath';

const LogosSection = () => {
  const logos = [...logoSection, ...logoSection]; // Duplicate logos for infinite scroll
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let animationFrame;
    let scrollAmount = 0;

    const scroll = () => {
      if (container) {
        scrollAmount += 1; // Adjust the scroll speed here
        container.scrollLeft = scrollAmount;

        // Reset scroll position to the start when reaching the duplicated logos
        if (scrollAmount >= container.scrollWidth / 2) {
          scrollAmount = 0;
        }
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    scroll(); // Start scrolling

    // return () => cancelAnimationFrame(animationFrame); // Cleanup on unmount
  }, []);

  return (
    <div className="relative py-4 overflow-hidden">
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-hidden whitespace-nowrap"
        style={{ willChange: 'transform' }}
      >
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 hover:scale-110 transform transition-transform duration-300"
            style={{ width: '150px' }} // Adjust logo width here
          >
            <img
              src={logo}
              alt={`logo${index}`}
              className="w-full h-auto mx-auto"
            />
          </div>
        ))}
      </div>

      {/* Gradient effect */}
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white/70 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white/70 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default LogosSection;
