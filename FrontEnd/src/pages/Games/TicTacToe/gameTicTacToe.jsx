import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Board from "./components/Board.jsx";
import PreGameSetupTicTacToe from "./components/PreGameSetupTicTacToe.jsx";
import { ResetButton } from "../../../components/Buttons.jsx";
import useGameReset from "../generalGameUtil/useGameReset.jsx";

const GameTicTacToe = () => {
  const boardRef = useRef();

  // Bot config
  const [bot, setBot] = useState(null);
  const [botPlayer, setBotPlayer] = useState(null);

  // Extract URL query parameters using the hook
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "host";
  const pin = searchParams.get("pin");

  // Determine multiplayer mode based on the "pin" query param.
  const [multiplayer, setMultiplayer] = useState(false);
  useEffect(() => {
    setMultiplayer(Boolean(pin));
    console.log(pin ? "Multiplayer" : "Local");
  }, [pin]);

  const handleReset = useGameReset(() => {
    if (boardRef.current && boardRef.current.resetBoard) {
      boardRef.current.resetBoard();
      setBot(null);
      setBotPlayer(null);
    }
  });

  // Pre-game setup state:
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  // setupData stores player names keyed by symbols "X" and "O"
  const [setupData, setSetupData] = useState({
    playerNames: { X: "", O: "" },
    initialTurn: "X",
  });

  if (!isSetupComplete) {
    return (
      <PreGameSetupTicTacToe
        mode={mode}
        availableSymbol={
          mode === "join"
            ? setupData.playerNames.X === "Waiting"
              ? "X"
              : "O"
            : null
        }
        onSetupComplete={(data) => {
          if (mode === "host") {
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

  return (
    <div className="game">
      {pin && <h2>Your game PIN is: {pin}</h2>}
      {!multiplayer && bot === null && (
        <>
          <button onClick={() => setBot(true)}>Enable Bot</button>
          <button onClick={() => setBot(false)}>Disable Bot</button>
        </>
      )}
      {!multiplayer && bot && !botPlayer && (
        <>
          <button onClick={() => setBotPlayer(1)}>Bot is X</button>
          <button onClick={() => setBotPlayer(2)}>Bot is O</button>
        </>
      )}
      <h1>Tic Tac Toe</h1>
      <Board ref={boardRef} props={{ bot, botPlayer }} />
      <ResetButton onClick={handleReset} style={{ marginTop: "1rem" }} />
    </div>
  );
};

export default GameTicTacToe;