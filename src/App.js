import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";
import Home from "./Dashboard/Home.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const MainRoutes = () => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("jwtToken") !== null;

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home");
        }
    }, [isAuthenticated]);

    return (
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
    );
};

const App = () => {
    return (
        <Router>
            <MainRoutes />
        </Router>
    );
};

export default App;
