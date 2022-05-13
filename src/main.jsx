import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./main.css";
import { App } from "./app";
import { CustomApp } from "./custom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/custom" element={<CustomApp />} />
        <Route path="/react-window" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
