import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="223840512771-jiqvr689kh8up7jpu7ttqtlali97g064.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
