import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IoTPredictionPage from "./components/IoTPredictionPage/IoTPredictionPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IoTPredictionPage />} />
          <Route path="/IoTPredictionPage" element={<IoTPredictionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
