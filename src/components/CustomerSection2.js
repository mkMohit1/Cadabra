import React, { useState, useEffect, useRef } from "react";
import "../styles/CustomerSection2.scss"; // Assuming SCSS for styling
import { normalImages } from "../ImagePath";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronDown, faCircleChevronUp } from "@fortawesome/free-solid-svg-icons";
import ConsultationPopup from "./ConsultationPopup";

const CustomerSection2 = () => {
  const [openFAQs, setOpenFAQs] = useState([false, false, false]);
  const [showPopup, setShowPopup] = useState(false);
  const [imageSectionVisible, setImageSectionVisible] = useState(false); // Track visibility of the image-section

  const imageSectionRef = useRef(null); // Reference to the image section container

  // Create a function to handle visibility change using IntersectionObserver
  const handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setImageSectionVisible(true); // When the image-section comes into view
        setShowPopup(true); // Show the popup when the image-section becomes visible
        observer.unobserve(entry.target); // Stop observing once the element is in view
      } else {
        setImageSectionVisible(false); // When the image-section leaves the viewport
      }
    });
  };

  // Initialize the IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null, // null means the viewport
      rootMargin: "0px",
      threshold: 1, // 50% of the element needs to be in view
    });

    if (imageSectionRef.current) {
      observer.observe(imageSectionRef.current); // Observe the image-section element
    }

    return () => {
      if (imageSectionRef.current) {
        observer.unobserve(imageSectionRef.current); // Clean up observer
      }
    };
  }, []);


  const handleonClose = () => {
    setShowPopup(false);
  }

  const toggleFAQ = (index) => {
    setOpenFAQs((prevState) =>
      prevState.map((item, i) => (i === index ? !item : item))
    );
  };

  const faqs = [
    { question: "How can I choose my right product?", answer: "Yes, we do!" },
    {
      question: "Warranty support if you buy from Cadabra",
      answer: "Absolutely, we are leading in this domain.",
    },
    {
      question: "How to ensure you’re buying the Original product?",
      answer: "Absolutely, we are leading in this domain.",
    },
  ];

  return (
    <div className="customer-section">
      <div className="content-container">
        <div
          ref={imageSectionRef} // Reference to the image-section
          className={`image-section ${imageSectionVisible ? "visible" : "hidden"}`} // Apply class based on visibility
        >
          <img
            src={normalImages.svgImage1} // Replace with actual image path
            alt="Office Environment"
          />
        </div>
        <div className="text-section">
          <h2>
            Not interested in Renting? You can also purchase from our wide selection of products and services.
          </h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div
                className={`faq-item ${openFAQs[index] ? "open" : ""}`}
                key={index}
              >
                <div
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openFAQs[index]}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span>
                  <span className="icon">
                    {openFAQs[index] ? (
                      <FontAwesomeIcon icon={faCircleChevronUp} />
                    ) : (
                      <FontAwesomeIcon icon={faCircleChevronDown} />
                    )}
                  </span>
                </div>
                {openFAQs[index] && (
                  <div
                    id={`faq-answer-${index}`}
                    className="faq-answer"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Show popup when image-section becomes visible */}
      {showPopup && <ConsultationPopup isOpen={showPopup} onClose ={handleonClose} />}
    </div>
  );
};

export default CustomerSection2;
