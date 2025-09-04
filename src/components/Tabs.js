import React, { useState } from "react";
import Quiz from "./Quiz";

function Tabs() {
  const [activeTab, setActiveTab] = useState(null);

  const quizzes = [
    { key: "money", title: "Money Personality", file: "money.json" },
    { key: "ptsd", title: "PTSD Assessment", file: "ptsd.json" },
    { key: "depression", title: "Depression Assessment", file: "depression.json" },
    { key: "burnout", title: "Burnout Assessment", file: "burnout.json" },
  ];

  if (activeTab) {
    const quiz = quizzes.find((q) => q.key === activeTab);
    return (
      <div>
        <button onClick={() => setActiveTab(null)}>← Back</button>
        <Quiz file={quiz.file} title={quiz.title} />
      </div>
    );
  }

  return (
    <div className="tabs">
      <h2>Select an Assessment</h2>
      {quizzes.map((quiz) => (
        <button key={quiz.key} onClick={() => setActiveTab(quiz.key)}>
          {quiz.title}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
