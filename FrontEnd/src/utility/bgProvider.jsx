import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BackgroundContext = createContext();
export const useBackground = () => useContext(BackgroundContext);

// Mapping each pathname to a background configuration.
// Add additional routes as needed.
const backgroundMapping = {
  "/home": { className: "homepageBG" }, // <<-- change routes to your actual paths and classes in customStyle.css
  "/game": { className: "gamepageBG" }, // <<-- change routes to your actual paths and classes in customStyle.css
  // You can extend this object with more routes.
};

// Fallback configuration if the pathname is not explicitly mapped.
const defaultBackground = { className: "", color: "#000000" };

const BackgroundProvider = ({ children }) => {
  const location = useLocation();
  const [backgroundClass, setBackgroundClass] = useState("homepageBG");

  useEffect(() => {
    // Get configuration based on the current pathname.
    const config = backgroundMapping[location.pathname] || defaultBackground;
    setBackgroundClass(config.className);
    // Update the background color of the document.
    document.documentElement.style.backgroundColor = config.color;
  }, [location.pathname]);

  return (
    <BackgroundContext.Provider value={{ backgroundClass }}>
      <div className={backgroundClass}>{children}</div>
    </BackgroundContext.Provider>
  );
};

export default BackgroundProvider;
