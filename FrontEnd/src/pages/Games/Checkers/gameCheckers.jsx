import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PreGameSetup from "./components/PreGameSetup.jsx";
import CheckersGameView from "./CheckersGameView.jsx";
import styles from "../../../CSSModule/gameCSS/checkersGame.module.css";

const GameCheckers = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "host";
  const pin = searchParams.get("pin");

  // Pre-game setup state: player names are stored under keys "red" and "black"
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [setupData, setSetupData] = useState({
    playerNames: { red: "", black: "" },
    initialTurn: "red",
  });

  if (!isSetupComplete) {
    return (
      <PreGameSetup
        mode={mode}
        // For join mode, automatically assign the available piece:
        // if red is still "Waiting", assign "red"; otherwise, assign "black".
        availablePiece={
          mode === "join"
            ? setupData.playerNames.red === "Waiting"
              ? "red"
              : "black"
            : null
        }
        onSetupComplete={(data) => {
          if (mode === "host") {
            if (data.piece === "red") {
              setSetupData({
                playerNames: { red: data.name, black: "Waiting" },
                initialTurn: "red",
              });
            } else {
              setSetupData({
                playerNames: { red: "Waiting", black: data.name },
                initialTurn: "black",
              });
            }
          } else {
            if (data.piece === "red") {
              setSetupData({
                playerNames: { red: data.name, black: setupData.playerNames.black },
                initialTurn: setupData.initialTurn,
              });
            } else {
              setSetupData({
                playerNames: { red: setupData.playerNames.red, black: data.name },
                initialTurn: setupData.initialTurn,
              });
            }
          }
          setIsSetupComplete(true);
        }}
      />
    );
  }

  // Determine waiting mode if either slot is still "Waiting"
  const opponentWaiting =
    setupData.playerNames.red === "Waiting" || setupData.playerNames.black === "Waiting";

  return (
    <div className={styles.checkersContainer}>
      {pin && <h2>Your game PIN is: {pin}</h2>}
      {opponentWaiting ? (
        <>
          <h1 className={styles.checkersTitle}>Checkers</h1>
          <div>
            <p>
              Player <span className={styles.textRed}>Red</span>: {setupData.playerNames.red}
            </p>
            <p>
              Player <span className={styles.textBlack}>Black</span>: {setupData.playerNames.black}
            </p>
          </div>
          <p>
            {mode === "join"
              ? "Waiting for host to join..."
              : "Waiting for opponent to join..."}
          </p>
        </>
      ) : (
        <CheckersGameView
          playerNames={setupData.playerNames}
          initialTurn={setupData.initialTurn}
        />
      )}
    </div>
  );
};

export default GameCheckers;