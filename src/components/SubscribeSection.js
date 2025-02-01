import React, { useEffect, useState } from "react";
// import "../styles/SubscribeSection.scss"; // Assuming SCSS for styling
import { Bold } from "lucide-react";
import { errorToast, successToast } from "../DecryptoAndOther/ToastUpdate";

const SubscribeSection = () => {
  const [isButtonMoved, setIsButtonMoved] = useState(false);
  useEffect(()=>{
    const handleResize=()=>{
      const form = document.getElementsByClassName('subscribeform')[0]; // Access the first form element
      if (form) {
        const email = form.querySelector('input');
        const submitButton = form.querySelector('button');

        const inputBottom = email.getBoundingClientRect().bottom;
        const buttonTop = submitButton.getBoundingClientRect().top;

        setIsButtonMoved(buttonTop>inputBottom+5);
      }
    }

    window.addEventListener('resize',handleResize);

    return ()=>{
      window.removeEventListener('resize',handleResize);
    }
  },[]);

    // Handle email subscription
    const handleAddEmail = async (e) => {
      e.preventDefault();
      const email = e.target[0].value.trim();
  
      if (!email) {
        errorToast("Please enter a valid email address.");
        return;
      }
  
      try {
        const response = await fetch(`${process.env.Back_Url}/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) {
          errorToast(data.message || "Failed to subscribe. Please try again later.");
          return;
        }
        successToast(data.message || "Subscribed successfully!");
      } catch (error) {
        errorToast(error.message || "Failed to subscribe. Please try again later.");
      }
    };

  return (
    <div className="bg-[#0a2540] text-center py-10 text-white max-w-5xl mx-auto font-mulish">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-light mb-6">
          <span className="text-4xl font-bold">Join Our Community </span>
        <span className="text-lg font-bold text-gray-400 ml-2 tracking-[-1px]">Subscribe Today!</span>
        </h2>
        <form className="subscribeform flex flex-col md:flex-row justify-center item-center gap-4 mb-2" onSubmit={handleAddEmail}> 
          <input
            type="email"
            placeholder="Your email address"
            required
            className="email-input w-full md:w-3/5 p-4 text-lg text-black  z-10 md:focs:border-2 focus:outline-none focus:border-l-2 focus:border-b-2 focus:border-[#65e4a3] border-gray-300"
          />
          <button type="submit" className={`text-lg py-4 ${isButtonMoved?"":'-ml-[16px]'} outline-none px-6 font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-white transition duration-300 xs:ml-[0]`}>
            Start now
          </button>
        </form>
        <span className=" text-sm opacity-50">We’ll send you Newsletters and keep you updated on the Latest Product reviews</span>
      </div>
    </div>
  );
};

export default SubscribeSection;
