import React from "react";
import "../App.css";
import KanbanBoard from "../components/KanbanBoard";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <KanbanBoard />
    </div>
  );
};

export default Home;
