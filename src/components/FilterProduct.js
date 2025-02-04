import React, { useState, useEffect } from "react";
import { mainLogo } from "../ImagePath";

const FilterProduct = ({ handleData, handleCloseQuiz }) => {
  const questions = [
    {
      question: "What type of product are you looking for?",
      options: ["Electronics", "Clothing", "Furniture", "Books"],
    },
    {
      question: "What price range are you looking for?",
      options: ["$0 - $50", "$50 - $100", "$100 - $200", "$200+"],
    },
    {
      question: "What brand do you prefer?",
      options: ["Brand A", "Brand B", "Brand C", "Brand D"],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [nextQuestion, setNextQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOptionSelect = (answer) => {
    if (isAnimating) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));

    if (currentQuestion < questions.length - 1) {
      setNextQuestion(currentQuestion + 1);
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsAnimating(false);
      }, 400);
    } else {
      handleData({ ...selectedAnswers, [currentQuestion]: answer });
      handleCloseQuiz();
    }
  };

  return (
    <div className=" p-4 sm:p-6 md:p-4 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto">
      <div className="mb-4 flex justify-center">
        <img src={mainLogo.mainLogo2} className="w-20 sm:w-24 md:w-28" alt="logo" />
      </div>

      <div>
        <div
          key={currentQuestion}
          className={`transition-transform duration-500 ${isAnimating ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
        >
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center mb-4">
            {questions[currentQuestion].question}
          </h3>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4 sm:gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`py-2 px-4 border transition-colors duration-200 text-sm sm:text-base md:text-lg ${
                  selectedAnswers[currentQuestion] === option
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:text-white hover:bg-gradient-to-r from-blue-400 to-purple-600 "
                }`}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnimating}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {isAnimating && currentQuestion < questions.length - 1 && (
          <div
            key={`next-${nextQuestion}`}
            className="absolute top-0 left-0 w-full transition-transform duration-500 translate-x-0 opacity-0"
          >
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center mb-4">
              {questions[nextQuestion].question}
            </h3>

            <div className="grid gap-3 sm:gap-4">
              {questions[nextQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="py-2 px-4 border rounded-lg bg-gray-100 text-sm sm:text-base md:text-lg"
                  disabled
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex  bottom-[-1px] left-0 absolute">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 transition-colors duration-200 ${
              index === currentQuestion
                ? "white":
                index < currentQuestion
                ? " bg-gradient-to-r from-blue-400 to-purple-600"
                : "white"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FilterProduct;
