import React from "react";
import { normalImages } from "../ImagePath";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-gray-50 py-20 flex flex-col items-center text-center font-mulish">
      <div className="absolute w-[800px] h-[800px] bg-gray-200 rounded-full top-[-400px] right-[-400px] z-[-1]"></div>

      <div className="max-w-5xl mx-auto space-y-6 md:pt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-700">
          Protect your Property
        </h1>
        <p className="text-2xl md:text-3xl font-bold">
          now on{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Monthly Rental
          </span>
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/Rent">
            <button className="bg-black text-green-400 py-3 px-8 text-xl font-bold hover:bg-gray-800 transition">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Rent Today
              </span>
            </button>
          </Link>
          {/* Uncomment for additional button */}
          {/* <button className="border-2 border-green-400 text-green-400 py-3 px-8 rounded-lg text-xl font-bold hover:bg-green-400 hover:text-white transition">
            Why Rent?
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
