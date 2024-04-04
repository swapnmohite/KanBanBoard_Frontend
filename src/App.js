import React from "react";
import "./App.css";
import Home from "./Dashboard/Home.jsx"; // Assuming Home component is in the same directory
import Dashboard from "./Dashboard/Dashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
