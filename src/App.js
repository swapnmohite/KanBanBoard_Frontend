import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Dashboard/Home.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
    const isAuthenticated = localStorage.getItem("jwtToken") !== null;
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Home />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
