import React from "react";
import { useParams } from "react-router-dom";
import InfoTicTacToe from "../pages/Games/TicTacToe/infoTicTacToe.jsx";

const gameInfoMap = {
  tictactoe: InfoTicTacToe,
  "1": InfoTicTacToe,
  // Add more mappings for other games here
};

const GameDetails = () => {
  const { gameId } = useParams();
  const InfoComponent = gameInfoMap[gameId];

  if (!InfoComponent) {
    return (
      <div>
        <h1>Game Details</h1>
        <p>No information available for this game.</p>
      </div>
    );
  }

  return <InfoComponent />;
};

export default GameDetails;