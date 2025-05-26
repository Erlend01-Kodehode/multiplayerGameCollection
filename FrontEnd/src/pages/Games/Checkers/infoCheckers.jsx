// /src/pages/Games/Checkers/infoCheckers.jsx
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../../../CSSModule/infoCSS/checkersInfo.module.css";
import {
  JoinGameButton,
  HostGameButton,
} from "../../../components/Buttons.jsx";
import GameSession from "../GameSession.jsx";

const InfoCheckers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const modeFromUrl = searchParams.get("mode"); // should be either 'host' or 'join'

  const handleHostClick = () => {
    setSearchParams({ mode: "host" });
  };

  const handleJoinClick = () => {
    setSearchParams({ mode: "join" });
  };

  const handleSessionComplete = (pin) => {
    // Navigate to game play screen and carry both the pin and mode in the URL
    navigate(`/game/play/checkers?pin=${pin}&mode=${modeFromUrl}`);
  };

  return (
    <div className={styles.infoCheckers}>
      <h1>Checkers</h1>
      <div className={styles.infoContent}>
        <p>
          Experience a classic game of Checkers with modern enhancements! In
          this version, the game is played on an 8x8 grid where each player
          starts with 12 pieces on the dark squares. Key features include:
        </p>
        <ul className={styles.noListStyle}>
          <li>
            <strong>Forced Capture:</strong> When a capture move is available,
            you must capture your opponent’s piece.
          </li>
          <li>
            <strong>Multi-Capture:</strong> If a piece can continue capturing
            after a jump, it must do so.
          </li>
          <li>
            <strong>Kinging:</strong> When a piece reaches the far side of the
            board, it becomes a king and gains the ability to move backward.
          </li>
          <li>
            <strong>Score System:</strong> Wins and losses are tracked and shown
            in each player’s reserve.
          </li>
          <li>
            <strong>Standard Movement:</strong> Pieces move diagonally forward
            to unoccupied dark squares.
          </li>
          <li>
            <strong>Win Conditions:</strong> The game ends when one player has
            no moves left or no remaining pieces.
          </li>
        </ul>
        <div className={styles.buttonContainer}>
          <JoinGameButton onClick={handleJoinClick} />
        </div>
        <div className={styles.buttonContainer}>
          <HostGameButton onClick={handleHostClick} />
        </div>
        {modeFromUrl && (
          <GameSession mode={modeFromUrl} onComplete={handleSessionComplete} />
        )}
        <p className={styles.infoNote}>Good luck and have fun!</p>
      </div>
    </div>
  );
};

export default InfoCheckers;