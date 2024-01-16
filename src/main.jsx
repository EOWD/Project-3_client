import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserContextWrapper } from "./context/UserContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContextWrapper>
       
          <App />
        
      </UserContextWrapper>
    </BrowserRouter>
  </React.StrictMode>
);