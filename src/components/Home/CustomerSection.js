import React from "react";
import { normalImages } from "../../ImagePath";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPenNib } from "@fortawesome/free-solid-svg-icons";
import { faEye, faSun } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "../../svgComponents/Offer";

const CustomerSection = () => {
  const Navigate = useNavigate();
 
  

  return (
    <div className="bg-gray-100 py-10 pb-20 font-mulish">
      <div className="max-w-6xl lg:mx-auto mx-auto space-y-16 ml-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mr-4">
          <div className="relative md:w-1/2 flex justify-center mb-[25px]">
            <img
              src={normalImages.onPhoneCall2}
              alt="Customer Engagement"
              className="rounded-lg w-full max-w-[450px] object-cover"
            />
            <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-lg p-4 w-40 h-40 sm:w-48 sm:h-48 xs:h-[12rem] xxxs:h-[15rem] md:w-56 md:h-56 lg:w-64 lg:h-64">
              <img src={normalImages.chart} alt="Chart" className="w-full h-3/4 xs:h-1/2 object-contain mb-2" />
              <p className="text-center text-gray-700 font-semibold text-sm sm:text-base md:text-sm">
              30% lesser Crime rate after Cadabra Installation
              </p>
            </div>
          </div>
          <div className="md:w-1/2 text-center md:text-left space-y-4 xs:mt-[1rem] xxs:mt-[4rem] xxxs:mt-[5rem]">
            <h2 className="text-xl font-medium text-gray-800 xs:text-left xs:text-lg xs:text-center lg:text-left">
              We make security affordable by offering simple and flexible rental options for you
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600 xxs:w-[104%]">
                {/* {GradientIcon(faCheckCircle,"mr-2")} */}
                <FaCheckCircle className="mr-2" />
                Select product(s) from Cadabra Marketplace.
              </li>
              <li className="flex items-center text-gray-600">
              <FaCheckCircle className="mr-2" />
                Accept Rental, Tenure & Agreement.
              </li>
              <li className="flex items-center text-gray-600">
              <FaCheckCircle className="mr-2" />
                Work Order processed at our hub.
              </li>
            </ul>
            <button className="bg-black font-extrabold py-2 px-6 mt-[35px] hover:bg-gray-800 transition
              xs:mt-[30px]
            ">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600" onClick={()=>{Navigate('/rent')}}>Rent now</span>
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mr-4 xs:m-[10px 0]">
          <div className="md:w-1/2 text-center md:text-left space-y-4 lg:ml-4">
            <h2 className="text-xl font-medium text-gray-800">
              We connect our customers with expert security advisors to help them design tailored security solutions
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center bg-gradient-to-r from-blue-400 to-purple-600 text-white p-4 rounded-md shadow-md">
                <FontAwesomeIcon icon={faPenNib} className="mr-4" />
                We connect our customers with Security Experts.
              </li>
              <li className="flex items-center bg-gray-100 p-4 rounded-md shadow-md">
                <FontAwesomeIcon icon={faEye} className="text-blue-700 mr-4" />
                Consultant-led projects for your dream space.
              </li>
              <li className="flex items-center bg-gray-100 p-4 rounded-md shadow-md">
                <FontAwesomeIcon icon={faSun} className="text-blue-700 mr-4" />
                Enterprise End-to-End Security Solutions.
              </li>
            </ul>
          </div>
          <div className="relative md:w-1/2 flex justify-center md:mb-[100px] mb-[80px]">
            <img
              src={normalImages.onPhoneCall}
              alt="Customer Collaboration"
              className="rounded-lg w-full max-w-[450px] object-cover"
            />
            <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-lg p-4 w-40 sm:w-48 md:w-56 lg:w-60">
              <img src={normalImages.chart2} alt="Chart" className="w-full mb-2" />
              <ul className="text-left space-y-2 w-fit mx-auto xxs:text-center xs:text-center xxxs:text-center">
                <li className="text-purple-500 text-[12px]">Residential Security Planning</li>
                <li className="text-pink-500 text-[12px]">Security Advisor contribution</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default CustomerSection;
