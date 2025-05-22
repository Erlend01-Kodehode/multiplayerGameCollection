import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../CSSModule/infoCSS/checkersInfo.module.css";
import { PlayButton } from "../../../components/Buttons.jsx";

const InfoCheckers = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate("/game/play/checkers");
  };

  return (
    <div className={styles.infoCheckers}>
      <h1>Checkers</h1>
      <div className={styles.infoContent}>
        <p>
          Checkers is a classic two-player strategy board game played on an 8x8 grid. Each player starts with 12 pieces placed on the dark squares of the three rows closest to them.
        </p>
        <ul className={styles.noListStyle}>
          <li>Players: 2</li>
          <li>Board size: 8x8 squares</li>
          <li>Pieces move diagonally forward to unoccupied dark squares.</li>
          <li>Capture opponent pieces by jumping over them diagonally.</li>
          <li>If a piece reaches the farthest row, it becomes a "King" and can move both forward and backward diagonally.</li>
          <li>The goal is to capture all of your opponent's pieces or block them so they cannot move.</li>
        </ul>
        <div className={styles.buttonContainer}>
          <PlayButton onClick={handlePlayClick} />
        </div>
        <p className={styles.infoNote}>
             Good luck and have fun!
        </p>
      </div>
    </div>
  );
};

export default InfoCheckers;