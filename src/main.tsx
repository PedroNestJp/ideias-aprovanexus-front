// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="REACT_APP_CLIENT_ID_GOOGLE">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
