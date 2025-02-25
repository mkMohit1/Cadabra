import React, { useState, useEffect, useRef } from "react";
import "../../styles/CustomerSection2.scss"; // Assuming SCSS for styling
import { normalImages } from "../../ImagePath";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronDown, faCircleChevronUp } from "@fortawesome/free-solid-svg-icons";
import ConsultationPopup from "../Popup&Faq/ConsultationPopup";

const CustomerSection2 = () => {
  const [faqs, setFaqs] = useState([]);
  const [openFAQs, setOpenFAQs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [imageSectionVisible, setImageSectionVisible] = useState(false);

  const imageSectionRef = useRef(null);
  const popupTimeoutRef = useRef(null);

  const handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setImageSectionVisible(true);
        popupTimeoutRef.current = setTimeout(() => {
          setShowPopup(true);
        }, 5000);
        observer.unobserve(entry.target);
      } else {
        setImageSectionVisible(false);
        if (popupTimeoutRef.current) {
          clearTimeout(popupTimeoutRef.current);
          popupTimeoutRef.current = null;
        }
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    });

    if (imageSectionRef.current) {
      observer.observe(imageSectionRef.current);
    }

    return () => {
      if (imageSectionRef.current) observer.unobserve(imageSectionRef.current);
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    };
  }, []);

  const handleonClose = () => setShowPopup(false);

  const toggleFAQ = (index) => {
    setOpenFAQs((prevState) =>
      prevState.map((item, i) => (i === index ? !item : false))
    );
  };

  // const faqs = [
  //   { question: "How can I choose my right product?", answer: "Yes, we do!" },
  //   {
  //     question: "Warranty support if you buy from Cadabra",
  //     answer: "Absolutely, we are leading in this domain.",
  //   },
  //   {
  //     question: "How to ensure you’re buying the Original product?",
  //     answer: "Absolutely, we are leading in this domain.",
  //   },
  // ];

  useEffect(() => {
    const fetchFaqFunction = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/${'consultancy'}`);

        if (response.ok) {
          const data = await response.json();
          setFaqs([...data]);
          setOpenFAQs(new Array(data.length).fill(false));
        } else {
          console.error('Failed to fetch FAQs');
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqFunction();
  }, []);

  return (
    <div className="customer-section flex flex-col items-center justify-center font-mulish py-8 px-4 bg-gray-100">
      <div className="content-container flex flex-col md:flex-row md:gap-8 max-w-7xl">
        <div
          ref={imageSectionRef}
          className={`image-section w-full md:w-1/2 mb-8 md:mb-0  h-fit shadow-[8px_8px_1px_rgba(1,1,1,0.7)] border-black border-[2px]`}
        >
          <img
            src={normalImages.svgImage1}
            alt="Office Environment"
            className="w-full rounded-lg object-cover"
          />
        </div>

        <div className="w-full flex flex-col md:flex-row lg:flex-row justify-between items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <h2 className="text-xl md:text-2xl font-medium font-mulish text-gray-800 md:w-fit tracking-[-1px] text-center lg:text-left lg:w-[50%] m-auto">
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Not interested in Renting?</span><br/> <span className="mt-2 text-lg leading-tight">You can also purchase from our wide selection</span> <br/><div className="mt-[-3px] text-lg">of products and services.</div>
            </h2>

            <div className="faq-container w-full font-mulish lg:w-1/2 space-y-4">
              {faqs.map((faq, index) => (
                <div
                  className={`faq-item p-4 shadow-md transition-all duration-300 ${
                    openFAQs[index] ? "bg-gray-200" : "bg-white"
                  }`}
                  key={index}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="faq-question flex justify-between items-center text-sm font-semibold text-gray-700 cursor-pointer">
                    <span>{faq.question}</span>
                    <FontAwesomeIcon
                      icon={openFAQs[index] ? faCircleChevronUp : faCircleChevronDown}
                      className="text-gray-500"
                    />
                  </div>
                  {openFAQs[index] && (
                    <div className="faq-answer mt-2 text-sm text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
      </div>

      {showPopup && <ConsultationPopup isOpen={showPopup} onClose={handleonClose} />}
    </div>
  );
};

export default CustomerSection2;
