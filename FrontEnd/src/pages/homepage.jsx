// src/pages/HomePage.jsx
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Velkommen til kortspill</h1>
      <Link to="/game">
        <button>Start Solitaire</button>
      </Link>
    </div>
  );
};

export default HomePage;
