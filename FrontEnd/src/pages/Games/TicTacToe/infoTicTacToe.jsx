import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../CSSModule/infoCSS/tictactoeInfo.module.css";
import altStyles from "../../../CSSModule/gameCSS/tictactoeGame.module.css";
import {
  JoinGameButton,
  HostGameButton,
  LocalGameButton,
} from "../../../components/Buttons.jsx";
import GameSession from "../GameSession.jsx";

const InfoTicTacToe = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);

  const handleJoinClick = () => setMode("join");
  const handleHostClick = () => setMode("host");

  const handleSessionComplete = (pin) => {
    navigate(`/game/play/tictactoe?pin=${pin}`);
  };

  const handleLocalSession = () => {
    console.log("Local Game");
    navigate(`/game/play/tictactoe`);
  };

  return (
    <div className={styles.infoTicTacToe}>
      <h1>Tic Tac Toe</h1>
      <div className={styles.infoContent}>
        <p>
          Tic Tac Toe is a classic two-player game. Players take turns marking{" "}
          <span className={altStyles.squareX}>X</span> or{" "}
          <span className={altStyles.squareO}>O</span> in a 3x3 grid. The first
          to get three in a row (horizontally, vertically, or diagonally) wins!
        </p>
        <ul className={styles.noListStyle}>
          <li>Players: 2</li>
          <li>Grid size: 3x3</li>
          <li>
            Goal: Get three of your marks in a row (
            <span className={altStyles.squareX}>X</span> or{" "}
            <span className={altStyles.squareO}>O</span>)
          </li>
        </ul>

        <div className={styles.buttonContainer}>
          <JoinGameButton onClick={handleJoinClick} />
        </div>
        <div className={styles.buttonContainer}>
          <HostGameButton onClick={handleHostClick} />
        </div>
        <div className={styles.buttonContainer}>
          <LocalGameButton onClick={handleLocalSession} />
        </div>

        {mode && <GameSession mode={mode} onComplete={handleSessionComplete} />}
      </div>
    </div>
  );
};

export default InfoTicTacToe;
