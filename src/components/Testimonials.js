import React, { useState } from 'react';
import '../styles/Testimonials.scss';
import { normalImages } from '../ImagePath';

const Testimonials = () => {
  const { user1, user2, user3 } = normalImages;
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote:
        "Why Cadabra is such a successful enterprise is solely because their attitude towards their customers. They do not instil Service, they give proof of their Hospitality– From top of the pyramid till the absolute bottom (the CEO)",
      name: 'Albus Dumbledore',
      title: 'Manager @ Hogwarts',
      image: user1, // Replace with the actual image path
    },
    {
      quote:
        "Cadabra’s Rental Service support sets them apart. What’s even more impressive is the engagement they foster with their customers. We really needed such a startup in India for a long time.",
      name: 'Severus Snape',
      title: 'Manager @ Slytherin',
      image: user2, // Replace with the actual image path
    },
    {
      quote:
        "Working with Cadabra has been an absolute breeze. The team is professional, efficient, and extremely knowledgeable about their products. We feel much safer with Cadabra solutions in place.",
      name: 'Harry Potter',
      title: 'Team Leader @ Gryffindor',
      image: user3, // Replace with the actual image path
    },
    {
      quote:
        "Terrific Team, Good Customer Support. What’s mind-blowing is the fact that they’re charging merely 300 rupees a month. A Month???",
      title: 'Team Leader @ Gryffindor',
      image: user3, // Replace with the actual image path
    },
    {
      quote:
        "Terrific Team, Good Customer Support. What’s mind-blowing is the fact that they’re charging merely 300 rupees a month. A Month???",
      title: 'Team Leader @ Gryffindor',
      image: user3, // Replace with the actual image path
    },
  ];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // Move back by +1
    }
  };

  const handleNext = () => {
    if (currentIndex + 3 < testimonials.length) {
      setCurrentIndex(currentIndex + 1); // Move forward by +1
    }
  };

  // Slice the testimonials array to show 3 testimonials based on currentIndex
  const currentTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  return (
    <div className="testimonials">
      <div className="testimonials-header">
        <h2>Customer Expressions to guide you in making the right decision</h2>
      </div>
      <div className="testimonials-container">
        {currentTestimonials.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <p className="quote">"{testimonial.quote}"</p>
            <div className="profile">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="profile-image"
              />
              <div className="profile-info">
                <h4 className="name">{testimonial.name}</h4>
                <p className="title">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="navigation">
        <button className="nav-button" onClick={handlePrev}>&larr;</button>
        <button className="nav-button" onClick={handleNext}>&rarr;</button>
      </div>
    </div>
  );
};

export default Testimonials;
