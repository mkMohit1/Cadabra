import React, { useState, useEffect } from 'react';
import { normalImages } from '../ImagePath';
import "../styles/Testimonials.scss";

const Testimonials = () => {
  const { user1, user2, user3 } = normalImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rightMargin, setRightMargin] = useState('15%');

  // const updateRightMargin = () => {
  //   if (window.innerWidth >= 1280) {
  //     setRightMargin('12%'); // Decrease for larger screens
  //   } else if (window.innerWidth >= 1024) {
  //     setRightMargin('15%'); // Default for medium-large screens
  //   } else if (window.innerWidth >= 768) {
  //     setRightMargin('10%'); // Decrease further for smaller screens
  //   }
  // };

  // useEffect(() => {
  //   updateRightMargin(); // Initial check
  //   window.addEventListener('resize', updateRightMargin);
  //   return () => window.removeEventListener('resize', updateRightMargin); // Cleanup
  // }, []);

  const testimonials = [
    {
      quote: "Why Cadabra is such a successful enterprise is solely because of their attitude towards their customers. They do not instill service; they give proof of their hospitality.",
      name: 'Albus Dumbledore',
      title: 'Manager @ Hogwarts',
      image: user1,
    },
    {
      quote: "Cadabra’s rental service support sets them apart. Their customer engagement is truly impressive. We've needed a startup like this in India for a long time.",
      name: 'Severus Snape',
      title: 'Manager @ Slytherin',
      image: user2,
    },
    {
      quote: "Working with Cadabra has been an absolute breeze. The team is professional, efficient, and extremely knowledgeable about their products.",
      name: 'Harry Potter',
      title: 'Team Leader @ Gryffindor',
      image: user3,
    },
  ];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 3 < testimonials.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="bg-[#0b1e39] text-white py-10 px-4 font-mulish relative">
      <div className=" w-fit md:max-w-4xl lg:max-w-5xl  mx-auto mb-6 text-left">
        <h2 className="lg:text-3xl md:text-2xl xs:text-[20px] font-light leading-snug">
          Customer Expressions to guide you in making the right decision
        </h2>
      </div>
      <div className="flex gap-4 justify-center flex-wrap">
        {testimonials.slice(currentIndex, currentIndex + 3).map((testimonial, index) => (
          <div
            key={index}
            className="bg-white text-gray-800 p-6 rounded-lg shadow-md relative w-full sm:w-72 h-50 flex flex-col justify-between"
          >
            <p className="italic overflow-auto max-h-36 scrollbar-hide">{testimonial.quote}</p>
            <div className="flex items-center gap-4 mt-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 "
        style={{ right: rightMargin }}
      >
      <button
        className=" text-white w-10 h-10 font-Inter bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mx-2 transition text-[1.5rem]"
        onClick={handlePrev}
      >
        {"<-"}
      </button>
      <button
        className=" text-white w-10 h-10 font-Inter bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mx-2 transition text-[1.5rem]"
        onClick={handleNext}
      >
        {"->"}
      </button>
    </div>


    </div>
  );
};

export default Testimonials;
