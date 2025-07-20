import React from "react";
import AuthForm from "./components/AuthForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <AuthForm />

      {/* Watermark without editing App.css */}
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          width: "100%",
          textAlign: "center",
          fontSize: "13px",
          color: "rgba(255, 255, 255, 0.8)",
          zIndex: 999
        }}
      >
        Made by <strong>Ajay</strong> |
        <a
          href="https://github.com/Meesaajay"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#fff", margin: "0 5px", textDecoration: "none" }}
        >
          GitHub
        </a>
        |
        <a
          href="https://www.linkedin.com/in/meessa-ajay-842246356"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#fff", margin: "0 5px", textDecoration: "none" }}
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}

export default App;
