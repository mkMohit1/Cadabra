import React, { useState, useEffect } from "react";
import "../styles/FilterProduct.scss";
import { mainLogo } from "../ImagePath";

const FilterProduct = ({ handleCloseQuiz, handleData }) => {
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

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));

    if (currentQuestion < questions.length - 1) {
      setNextQuestion(currentQuestion + 1);
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsAnimating(false);
      }, 400);
    } else {
      // handleData({...selectedAnswers, [currentQuestion]: answer});
      handleCloseQuiz();
    }
  };

  return (
    <div className="filterQizContainer">
      <div className="logo"><img src={mainLogo.mainLogo2} className="main-logo" alt="logo"/></div>

      <div className="question-container">
        {/* Current Question */}
        <div
          key={currentQuestion}
          className={`question-slide ${isAnimating ? 'slide-next' : 'active'}`}
        >
          <div className="question-text">
            <h3>{questions[currentQuestion].question}</h3>
          </div>

          <div className="alloptions">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${
                  selectedAnswers[currentQuestion] === option ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnimating}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Next Question (for smooth transition) */}
        {isAnimating && currentQuestion < questions.length - 1 && (
          <div
            key={`next-${nextQuestion}`}
            className="question-slide incoming"
          >
            <div className="question-text">
              <h3>{questions[nextQuestion].question}</h3>
            </div>

            <div className="alloptions">
              {questions[nextQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="option-btn"
                  disabled={true}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="dashbox">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`box ${index === currentQuestion ? "active" : ""} ${
              index < currentQuestion ? "completed" : ""
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FilterProduct;