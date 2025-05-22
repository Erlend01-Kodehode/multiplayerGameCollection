import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BackgroundContext = createContext();
export const useBackground = () => useContext(BackgroundContext);

const backgroundMapping = [
  { match: path => path === "/home", className: "homepageBG" }, // <<-- change routes to your actual paths and classes in main.css
  { match: path => path.startsWith("/game"), className: "gamepageBG" }, // <<-- change routes to your actual paths and classes in main.css
  // Add more rules as needed
];

const defaultBackground = { className: "defaultBG" };

const BackgroundProvider = ({ children }) => {
  const location = useLocation();
  const [backgroundClass, setBackgroundClass] = useState("homepageBG");

  useEffect(() => {
    const config =
      backgroundMapping.find(rule => rule.match(location.pathname)) ||
      defaultBackground;
    setBackgroundClass(config.className);
  }, [location.pathname]);

  return (
    <BackgroundContext.Provider value={{ backgroundClass }}>
      <div className={backgroundClass}>{children}</div>
    </BackgroundContext.Provider>
  );
};

export default BackgroundProvider;