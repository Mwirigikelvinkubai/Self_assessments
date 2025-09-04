import React from "react";
import "./Tabs.css";

export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tabs">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={activeTab === index ? "tab active" : "tab"}
          onClick={() => onTabChange(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
