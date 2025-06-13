import React from "react";
import { useParams } from "react-router-dom";
import GameTicTacToe from "../pages/Games/TicTacToe/gameTicTacToe.jsx";
import GameCheckers from "../pages/Games/Checkers/gameCheckers.jsx";
import GameChess from "../pages/Games/ChessGame/ChessGame.jsx";
import GameMinesweeper from "../pages/Games/Minesweeper/gameMinesweeper.jsx";
import GuessPokemon from "../pages/Games/GuessThatGame/guess.jsx";
import Solitaire from "../pages/Games/Solitaire/Solitaire.jsx";

const gameMap = {
  tictactoe: GameTicTacToe,
  1: GameTicTacToe,
  checkers: GameCheckers,
  2: GameCheckers,
  chess: GameChess,
  3: GameChess,
  minesweeper: GameMinesweeper,
  4: GameMinesweeper,
  guesspokemon: GuessPokemon,
  5: GuessPokemon,
  6: Solitaire,
  solitaire: Solitaire,
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
