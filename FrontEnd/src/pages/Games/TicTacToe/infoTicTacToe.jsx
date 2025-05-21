import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../CSSModule/infoCSS/tictactoeInfo.module.css";

const InfoTicTacToe = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate("/game/play/tictactoe");
  };

  return (
    <div className={styles.infoTicTacToe}>
      <h1>Tic Tac Toe</h1>
      <div className={styles.infoContent}>
        <p>
          Tic Tac Toe is a classic two-player game. Players take turns marking X or O in a 3x3 grid. 
          The first to get three in a row (horizontally, vertically, or diagonally) wins the game!
        </p>
        <ul className={styles.noListStyle}>
          <li>Players: 2</li>
          <li>Grid size: 3x3</li>
          <li>Goal: Get three of your marks in a row</li>
        </ul>
        <div className={styles.buttonContainer}>
          <button className={styles.playButton} onClick={handlePlayClick}>
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoTicTacToe;