import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import useChessEngine from "../hooks/useChessEngine";

const ChessBoard = () => {
  const { getFen, getTurn, makeMove, getLegalMoves } = useChessEngine();
  const currentTurn = getTurn();

  const turnText = currentTurn === "w" ? "♙ White's Turn" : "♟ Black's Turn";

  const [highlightedSquares, setHighlightedSquares] = useState([]);

  const onSquareClick = (square) => {
    console.log("Clicked square:", square);

    const legalMoves = getLegalMoves(square);
    console.log("Legal moves:", legalMoves);

    setHighlightedSquares(legalMoves);
  };

  const onPieceDrop = (sourceSquare, targetSquare) => {
    const move = makeMove(sourceSquare, targetSquare);
    setHighlightedSquares([]);
    return !!move;
  };

  const customSquareStyles = () => {
    const styles = {};
    highlightedSquares.forEach((sq) => {
      styles[sq] = { backgroundColor: "#a9a9a966" };
    });
    return styles;
  };

  return (
    <div style={{ width: 600, margin: "0 auto", textAlign: "center" }}>
      <h2>{turnText}</h2>

      <p>Highlighting: {JSON.stringify(highlightedSquares)}</p>

      <Chessboard
        position={getFen()}
        onPieceDrop={onPieceDrop}
        onSquareClick={onSquareClick}
        customSquareStyle={customSquareStyles()}
        arePiecesDraggable={true}
      />
    </div>
  );
};

export default ChessBoard;
