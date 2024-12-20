import React, { useState, useEffect } from "react";
import "../styles/FilterProduct.scss";

const FilterProduct = ({handleCloseQuiz}) => {
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
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(1); // Start with 10 seconds

  // Handle answer selection
  const handleOptionSelect = (answer) => {
    setSelectedAnswer(answer);
    setTimer(1); // Reset timer to 10 seconds
  };

  // Auto-move to the next question when the timer reaches 0
  useEffect(() => {
    let countdown;

    if (selectedAnswer !== null) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      clearInterval(countdown);
      goToNextQuestion();
    }

    return () => clearInterval(countdown);
  }, [timer, selectedAnswer]);

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimer(10); // Reset timer for next question
    } else {
      handleCloseQuiz();
      alert("Quiz completed!");
      // Perform any action when the quiz ends
    }
  };

  return (
    <div className="filterQizContainer">
      <div className="logo">B Cadabra</div>

      <div className="question-text">
        <h3>{questions[currentQuestion].question}</h3>
      </div>

      <div className="alloptions">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${
              selectedAnswer === option ? "selected" : ""
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="dashbox">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`box ${index === currentQuestion ? "active" : ""}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FilterProduct;
