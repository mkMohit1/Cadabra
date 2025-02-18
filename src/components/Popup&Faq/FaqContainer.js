import React,{useState} from 'react';
import { FaPlusMinus } from '../../svgComponents/Offer';

function FaqContainer({faqs, className=''}) {
      const [openFAQs, setOpenFAQs] = useState([false, false, false]);
    const toggleFAQ = (index) => {
        setOpenFAQs((prevState) =>
          prevState.map((item, i) => (i === index ? !item : false))
        );
      };
  return (
    <div className={`faq-container w-full font-mulish ${className} space-y-4`}>
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
                        <div className={`transition-transform duration-300 ${openFAQs[index] ? "rotate-180" : "rotate-0"}`}>
                            <FaPlusMinus mode={openFAQs[index] ? 'minus' : 'plus'} />
                        </div>
                      </div>
                      {openFAQs[index] && (
                        <div className="faq-answer mt-2 text-sm text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
  )
}

export default FaqContainer