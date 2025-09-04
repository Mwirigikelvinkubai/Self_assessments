// src/pages/Assessments.js
import React, { useState } from "react";
import Quiz from "../components/Quiz";

function Assessments() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleQuizChange = (quiz) => {
    setActiveQuiz(quiz);
    setResetKey((prev) => prev + 1); // force reset on tab change
  };

  const quizContent = {
    "Money Personality": <Quiz key={resetKey} file="money.json" />,
    "Burnout Check": <Quiz key={resetKey} file="burnout.json" />,
    "Depression Screening": <Quiz key={resetKey} file="depression.json" />,
    "PTSD Check": <Quiz key={resetKey} file="ptsd.json" />,
  };

  return (
    <section className="assessments">
      <h2>Assessments</h2>
      <p>Choose a self-assessment below to begin:</p>

      <div className="tabs">
        {Object.keys(quizContent).map((quiz) => (
          <button
            key={quiz}
            className={`tab ${activeQuiz === quiz ? "active" : ""}`}
            onClick={() => handleQuizChange(quiz)}
          >
            {quiz}
          </button>
        ))}
      </div>

      <div className="quiz-area">
        {activeQuiz ? quizContent[activeQuiz] : <p>Select an assessment to start.</p>}
      </div>
    </section>
  );
}

export default Assessments;
