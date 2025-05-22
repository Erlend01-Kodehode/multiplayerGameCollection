import { useState } from "react";
import { Chess } from "chess.js";

const useChessEngine = () => {
  const [game, setGame] = useState(new Chess());

  const makeMove = (sourceSquare, targetSquare) => {
    const possibleMoves = game.moves({ square: sourceSquare, verbose: true });
    const foundMove = possibleMoves.find((m) => m.to === targetSquare);

    if (!foundMove) return null;

    const move = game.move(foundMove.san);
    setGame(new Chess(game.fen()));
    return move;
  };

  const getFen = () => game.fen();
  const getTurn = () => game.turn();

  // Returns legal destination squares for highlighting and move logic
  const getLegalMoves = (square) => {
    const piece = game.get(square);
    if (!piece || piece.color !== game.turn()) return [];
    return game.moves({ square }).map((move) => move.slice(2, 4));
  };

  const isGameOver = () => game.game_over();
  const isInCheckmate = () => game.in_checkmate();
  const isInDraw = () => game.in_draw();

  return {
    getFen,
    getTurn,
    makeMove,
    getLegalMoves,
    isGameOver,
    isInCheckmate,
    isInDraw,
  };
};

export default useChessEngine;