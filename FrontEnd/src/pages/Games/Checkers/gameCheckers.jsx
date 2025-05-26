
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PreGameSetup from "./components/PreGameSetup.jsx";
import CheckersGameView from "./CheckersGameView.jsx";

const GameCheckers = () => {
  // Get mode from the URL query parameter; default to "host" if not present.
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "host";

  // Pre-game setup state:
  // isSetupComplete becomes true once the player's piece selection and name entry are done.
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  // setupData stores the player names for red and black, plus which side will start.
  const [setupData, setSetupData] = useState({
    playerNames: { red: "", black: "" },
    initialTurn: "red",
  });

  if (!isSetupComplete) {
    return (
      <PreGameSetup
        mode={mode}
        // For join mode, determine the available piece automatically.
        availablePiece={
          mode === "join"
            ? setupData.playerNames.red === "Waiting"
              ? "red"
              : "black"
            : null
        }
        onSetupComplete={(data) => {
          if (mode === "host") {
            // In host mode, the chosen side gets the entered name and the opposite side becomes "Waiting"
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
            // In join mode, update the available slot with the join player's name.
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

  return (
    <CheckersGameView
      playerNames={setupData.playerNames}
      initialTurn={setupData.initialTurn}
    />
  );
};

export default GameCheckers;