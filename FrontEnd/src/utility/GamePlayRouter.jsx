import React from "react";
import { useParams } from "react-router-dom";
import GameTicTacToe from "../pages/Games/TicTacToe/gameTicTacToe.jsx";

const gameMap = {
  tictactoe: GameTicTacToe,
  "1": GameTicTacToe,
  // Add more mappings for other games here
};

const GamePlayRouter = () => {
  const { gameId } = useParams();
  const GameComponent = gameMap[gameId];

  if (!GameComponent) {
    const notFoundStyleContainer = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "1.2rem",
      color: "#ff0000", // Red color for error message
    };
    return (
      <div style={notFoundStyleContainer}>
        <h1>Game not found</h1>
      </div>
    );
  }

  return <GameComponent />;
};

export default GamePlayRouter;