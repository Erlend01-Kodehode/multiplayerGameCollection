import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import infoStyles from "../../../CSSModule/infoCSS/tictactoeInfo.module.css";
import gameStyles from "../../../CSSModule/gameCSS/tictactoeGame.module.css";
import { HostGameButton, JoinGameButton } from "../../../components/Buttons.jsx";
import GameSession from "../GameSession.jsx";

const InfoTicTacToe = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const modeFromUrl = searchParams.get("mode"); // "host" or "join"

  const handleHostClick = () => {
    setSearchParams({ mode: "host" });
  };

  const handleJoinClick = () => {
    setSearchParams({ mode: "join" });
  };

  const handleSessionComplete = (pin) => {
    // Navigate to the game play screen with the PIN and mode
    navigate(`/game/play/tictactoe?pin=${pin}&mode=${modeFromUrl}`);
  };

  return (
    <div className={infoStyles.infoTicTacToe}>
      <h1>Tic Tac Toe</h1>
      <div className={infoStyles.infoContent}>
        <p>
          Challenge a friend to a classic game of Tic Tac Toe! Create a game as
          Host or join an existing session using a unique PIN.
        </p>
        <ul className={infoStyles.noListStyle}>
          <li>Simple 3x3 grid.</li>
          <li>
            Choose your symbol:{" "}
            <span className={gameStyles.squareX}>X</span> or{" "}
            <span className={gameStyles.squareO}>O</span>.
          </li>
          <li>Host generates a game PIN.</li>
          <li>Join with the game PIN to play.</li>
        </ul>
        <div className={infoStyles.buttonContainer}>
          <JoinGameButton onClick={handleJoinClick} />
        </div>
        <div className={infoStyles.buttonContainer}>
          <HostGameButton onClick={handleHostClick} />
        </div>
        {modeFromUrl && (
          <GameSession mode={modeFromUrl} onComplete={handleSessionComplete} />
        )}
        <p className={infoStyles.infoNote}>Good luck and have fun!</p>
      </div>
    </div>
  );
};

export default InfoTicTacToe;