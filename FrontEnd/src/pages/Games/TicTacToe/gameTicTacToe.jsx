import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Board from "./components/Board.jsx";
import PreGameSetupTicTacToe from "./components/PreGameSetupTicTacToe.jsx";
import { ResetButton } from "../../../components/Buttons.jsx";
import useGameReset from "../generalGameUtil/useGameReset.jsx";
import styles from "../../../CSSModule/gameCSS/tictactoeGame.module.css";

const GameTicTacToe = () => {
  // Create boardRef and use the original reset handler.
  const boardRef = useRef();
  const handleReset = useGameReset(() => {
    if (boardRef.current && boardRef.current.resetBoard) {
      boardRef.current.resetBoard();
    }
  });

  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "host";
  const pin = searchParams.get("pin");

  // Pre-game setup state:
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  // setupData stores player names keyed by symbols "X" and "O"
  const [setupData, setSetupData] = useState({
    playerNames: { X: "", O: "" },
    initialTurn: "X",
  });

  // Render pre-game setup if not complete.
  if (!isSetupComplete) {
    return (
      <PreGameSetupTicTacToe
        mode={mode}
        // In join mode, assign the available symbol:
        // if "X" is still "Waiting", assign "X"; otherwise, assign "O".
        availableSymbol={
          mode === "join"
            ? setupData.playerNames.X === "Waiting"
              ? "X"
              : "O"
            : null
        }
        onSetupComplete={(data) => {
          if (mode === "host") {
            // Host manually selects a symbol and provides a name.
            if (data.symbol === "X") {
              setSetupData({
                playerNames: { X: data.name, O: "Waiting" },
                initialTurn: "X",
              });
            } else {
              setSetupData({
                playerNames: { X: "Waiting", O: data.name },
                initialTurn: "O",
              });
            }
          } else {
            // In join mode, the symbol is auto-assigned.
            if (data.symbol === "X") {
              setSetupData({
                playerNames: { X: data.name, O: setupData.playerNames.O },
                initialTurn: setupData.initialTurn,
              });
            } else {
              setSetupData({
                playerNames: { X: setupData.playerNames.X, O: data.name },
                initialTurn: setupData.initialTurn,
              });
            }
          }
          setIsSetupComplete(true);
        }}
      />
    );
  }

  // Check if one player is still "Waiting".
  const opponentWaiting =
    setupData.playerNames.X === "Waiting" || setupData.playerNames.O === "Waiting";

  return (
    <div className={styles.game}>
      {pin && <h2>Your game PIN is: {pin}</h2>}
      <h1>Tic Tac Toe</h1>
      <div>
        <p>
          Player <span className={styles.squareX}>X</span>: {setupData.playerNames.X}
        </p>
        <p>
          Player <span className={styles.squareO}>O</span>: {setupData.playerNames.O}
        </p>
      </div>
      {opponentWaiting ? (
        <p>
          {mode === "join"
            ? "Waiting for host to join..."
            : "Waiting for opponent to join..."}
        </p>
      ) : (
        <>
          <Board ref={boardRef} />
          <ResetButton onClick={handleReset} style={{ marginTop: "1rem" }} />
        </>
      )}
    </div>
  );
};

export default GameTicTacToe;