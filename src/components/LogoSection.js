import React, { useEffect, useRef } from "react";
import { logoSection } from "../ImagePath";

const LogosSection = () => {
  const logos = [...logoSection, ...logoSection]; // Duplicate logos for infinite scroll
  const containerRef = useRef(null);
  let scrollAmount = 0;
  let scrollSpeed = 1; // Adjust speed

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollLogos = () => {
      scrollAmount += scrollSpeed;
      container.scrollLeft = scrollAmount;

      // Reset when reaching half the duplicated content
      if (scrollAmount >= container.scrollWidth / 3) {
        scrollAmount = 0;
      }
    };

    // Use setInterval instead of requestAnimationFrame for stable scrolling
    const interval = setInterval(scrollLogos, 20); // Adjust speed (lower = faster)

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="relative py-4 overflow-hidden bg-white">
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-hidden whitespace-nowrap"
        style={{ willChange: "transform" }}
      >
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 hover:scale-110 transform transition-transform duration-300"
            style={{ width: "150px" }} // Adjust logo width here
          >
            <img src={logo} alt={`logo${index}`} className="w-full h-auto mx-auto" />
          </div>
        ))}
      </div>

      {/* Gradient effect */}
      {/* <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r white to-transparent pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white/70 to-transparent pointer-events-none"></div> */}
    </div>
  );
};

export default LogosSection;
