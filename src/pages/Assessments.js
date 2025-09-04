// src/pages/Assessments.js
import React, { useState } from "react";
import Quiz from "../components/Quiz";

function Assessments() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizData, setQuizData] = useState(null);

  const quizzes = {
    "Money Personality": () => import("../assessments/money.json"),
    "Burnout Check": () => import("../assessments/burnout.json"),
    "Depression Screening": () => import("../assessments/depression.json"),
    "PTSD Assessment": () => import("../assessments/ptsd.json"),
  };

  const loadQuiz = (quiz) => {
    setActiveQuiz(quiz);
    quizzes[quiz]()
      .then((data) => setQuizData(data.default))
      .catch((err) => console.error("Error loading quiz:", err));
  };

  return (
    <section className="assessments">
      <h2>Assessments</h2>
      <p>Choose a self-assessment below to begin:</p>
      <div className="tabs">
        {Object.keys(quizzes).map((quiz) => (
          <button
            key={quiz}
            className={activeQuiz === quiz ? "tab active" : "tab"}
            onClick={() => loadQuiz(quiz)}
          >
            {quiz}
          </button>
        ))}
      </div>
      <div className="quiz-area">
        {quizData ? (
          <Quiz
            title={activeQuiz}
            data={quizData}
            onBack={() => {
              setActiveQuiz(null);
              setQuizData(null);
            }}
          />
        ) : (
          <p>Select an assessment to start.</p>
        )}
      </div>
    </section>
  );
}

export default Assessments;
