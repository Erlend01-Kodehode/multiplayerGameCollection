import React from "react";
import { useParams } from "react-router-dom";
import GameTicTacToe from "../pages/Games/TicTacToe/gameTicTacToe.jsx";
import GameCheckers from "../pages/Games/Checkers/gameCheckers.jsx";

const gameMap = {
  tictactoe: GameTicTacToe,
  "1": GameTicTacToe,
  checkers: GameCheckers,
  "2": GameCheckers,
  // Add more mappings for other games here
};

const GamePlayRouter = () => {
  const { gameId } = useParams();
  const GameComponent = gameMap[gameId];

  if (!GameComponent) {
    const notFoundStyleContainer = {
      display: "flex",
      justifyContent: "center",
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