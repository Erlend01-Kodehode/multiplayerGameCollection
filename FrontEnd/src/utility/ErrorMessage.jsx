import React from "react";
import { NavigationButton } from "../components/Buttons";
import { useNavigate } from "react-router-dom";

const errorContainerStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "var(--bg2)",
};

const errorContentStyle = {
  position: "absolute",
  top: "35%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
};

const errorHeadingStyle = {
  fontSize: "3rem",
  marginBottom: "1rem",
  color: "var(--error-text-color)",
};

const errorTextStyle = {
  fontSize: "1.5rem",
  color: "var(--error-text-color)",
};

const ErrorMessage = () => {
  const navigate = useNavigate();
  const handleNavigation = () => navigate("/home");

  return (
    <div style={errorContainerStyle}>
      <div style={errorContentStyle}>
        <h1 style={errorHeadingStyle}>Error 404</h1>
        <p style={errorTextStyle}>Page not found</p>
        <div style={{ marginTop: "2rem" }}>
          <NavigationButton onClick={handleNavigation}>
            Back to Home Page
          </NavigationButton>
      </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
// This component is used to display a 404 error message when a page is not found.