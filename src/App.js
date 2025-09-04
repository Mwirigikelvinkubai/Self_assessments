import React, { useState } from "react";
import Tabs from "./components/Tabs";

import moneyQuiz from "./assessments/money.json";
import ptsdQuiz from "./assessments/ptsd.json";
import depressionQuiz from "./assessments/depression.json";
import burnoutQuiz from "./assessments/burnout.json";

import "./App.css";

function App() {
  const assessments = [moneyQuiz, ptsdQuiz, depressionQuiz, burnoutQuiz];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="App">
      <h1>Self-Assessment Dashboard</h1>
      <Tabs
        tabs={assessments.map((a) => a.name)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="quiz-section">
        <h2>{assessments[activeTab].name}</h2>
        <p>Questions for this assessment will load here...</p>
      </div>
    </div>
  );
}

export default App;
