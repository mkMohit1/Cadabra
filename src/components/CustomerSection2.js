import React, { useState } from "react";
import "../styles/CustomerSection2.scss"; // Assuming SCSS for styling
import { normalImages } from "../ImagePath";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronDown, faCircleChevronUp } from "@fortawesome/free-solid-svg-icons";

const CustomerSection2 = () => {
  const [openFAQs, setOpenFAQs] = useState([false, false, false]);

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
        <div className="image-section">
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
    </div>
  );
};

export default CustomerSection2;
