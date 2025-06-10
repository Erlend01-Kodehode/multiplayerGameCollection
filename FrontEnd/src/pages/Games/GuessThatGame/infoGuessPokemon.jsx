import { useNavigate } from "react-router-dom";
import styles from "../../../CSSModule/infoCSS/guesspokemonInfo.module.css";
import { LocalGameButton } from "../../../components/Buttons.jsx";

const InfoGuessPokemon = () => {
  const navigate = useNavigate();

  const handleLocalGame = () => {
    navigate("/game/play/guesspokemon");
  };

  return (
    <div className={styles.infoGuessPokemon}>
      <h1>Guess Pokémon</h1>
      <div className={styles.infoContent}>
        <p>
          Test your Pokémon knowledge! Guess which Pokémon it is based only on its silhouette. Try to get the highest score possible.
        </p>
        <ul className={styles.listStyle}>
          <li>Single player game.</li>
          <li>Guess the Pokémon based on its silhouette.</li>
          <li>Three lives per session.</li>
          <li>Score increases for each correct answer.</li>
        </ul>
        <div className={styles.buttonContainer}>
          <LocalGameButton onClick={handleLocalGame}>Start</LocalGameButton>
        </div>
      </div>
    </div>
  );
};

export default InfoGuessPokemon;