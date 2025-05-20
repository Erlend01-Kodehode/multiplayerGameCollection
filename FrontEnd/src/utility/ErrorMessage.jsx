
const errorContainerStyle = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "inherit",
};

const errorContentStyle = {
  position: "absolute",
  top: "25%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
};

const errorHeadingStyle = {
  fontSize: "3rem",
  marginBottom: "1rem",
};

const errorTextStyle = {
  fontSize: "1.5rem",
};

const ErrorMessage = () => {
  return (
    <div style={errorContainerStyle}>
      <div style={errorContentStyle}>
        <h1 style={errorHeadingStyle}>Error 404</h1>
        <p style={errorTextStyle}>Page not found</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
// This component is used to display a 404 error message when a page is not found.