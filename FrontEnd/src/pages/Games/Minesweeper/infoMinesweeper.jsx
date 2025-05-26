import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlayButton,
  JoinGameButton,
  HostGameButton,
} from "../../../components/Buttons.jsx";
import GameSession from "../GameSession.jsx";
import style from "../../../CSSModule/infoCSS/minesweeperInfo.module.css";

export default function InfoMinesweeper() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);

  const handlePlayClick = () => {
    navigate("/game/play/minesweeper");
  };

  const handleComplete = (pin) => {
    navigate(`/game/play/minesweeper?pin=${pin}`);
  };

  return (
    <div className={style.container}>
      <h1>Minesweeper</h1>
      <div className={style.game}>
        <div className={style.gameInfo}>
          <p>Players: 2</p>
          <p>Grid size: 20x20</p>
          <p>Mines: 50</p>
          <p>Clear the minefield without setting off any mines.</p>
        </div>

        {/* <PlayButton onClick={handlePlayClick} /> */}

        <div className={style.buttonContainer}>
          <JoinGameButton onClick={() => setMode("join")} />
          <HostGameButton onClick={() => setMode("host")} />
        </div>

        {mode && <GameSession mode={mode} onComplete={handleComplete} />}
      </div>
    </div>
  );
}
