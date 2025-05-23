import { useState } from "react";
import { Chess } from "chess.js";

const useChessEngine = () => {
  const [game, setGame] = useState(new Chess());

  const makeMove = (sourceSquare, targetSquare, promotion = "q") => {
    const possibleMoves = game.moves({ square: sourceSquare, verbose: true });
    const foundMove = possibleMoves.find(
      (m) =>
        m.to === targetSquare &&
        (m.promotion ? m.promotion === promotion : true)
    );

    if (!foundMove) return null;

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: foundMove.promotion ? promotion : undefined,
    });
    setGame(new Chess(game.fen()));
    return move;
  };

  const getFen = () => game.fen();
  const getTurn = () => game.turn();

  const getLegalMoves = (square) => {
    const piece = game.get(square);
    if (!piece || piece.color !== game.turn()) return [];
    return game.moves({ square, verbose: true }).map((move) => ({
      to: move.to,
      isCapture: !!move.captured,
      promotion: move.promotion,
    }));
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