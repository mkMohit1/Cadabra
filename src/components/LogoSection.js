import React from 'react';
import { logoSection } from '../ImagePath';

const LogosSection = () => {
  const logos = logoSection;

  return (
    <div className="relative py-4">
      <div className="flex gap-4 overflow-x-auto sm:scrollbar-hide md:overflow-hidden max-w-5xl justify-evenly sm:px-4 md:px-0 lg:px-12 2xl:w-full 2xl:justify-evenly mx-auto">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 hover:scale-110 transform transition-transform duration-300"
          >
            <img
              src={logo}
              alt={`logo${index}`}
              className="w-20 sm:w-24 md:w-28 lg:w-32"
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
