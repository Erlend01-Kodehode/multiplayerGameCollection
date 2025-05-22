import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import useChessEngine from "../hooks/useChessEngine";

const ChessBoard = ({ setTurnText, highlightedSquares, setHighlightedSquares }) => {
  const { getFen, getTurn, makeMove, getLegalMoves } = useChessEngine();
  const currentTurn = getTurn();

  // Track the currently selected square
  const [selectedSquare, setSelectedSquare] = useState(null);

  useEffect(() => {
    setTurnText(currentTurn === "w" ? "♙ White's Turn" : "♟ Black's Turn");
  }, [currentTurn, setTurnText]);

  const onSquareClick = (square) => {
    const legalMoves = getLegalMoves(square);
    if (legalMoves.length > 0) {
      setSelectedSquare(square);
      setHighlightedSquares([square, ...legalMoves]);
    } else {
      setSelectedSquare(null);
      setHighlightedSquares([]);
    }
  };

  const onPieceDrop = (sourceSquare, targetSquare) => {
    const move = makeMove(sourceSquare, targetSquare);
    setSelectedSquare(null);
    setHighlightedSquares([]);
    return !!move;
  };

  // Use inline styles for highlighting
  const customSquareStyles = () => {
    const stylesObj = {};
    if (highlightedSquares && highlightedSquares.length > 0) {
      stylesObj[highlightedSquares[0]] = { backgroundColor: "#ffe066" };
      highlightedSquares.slice(1).forEach((sq) => {
        stylesObj[sq] = { backgroundColor: "#4caf5099" };
      });
    }
    return stylesObj;
  };

  return (
    <div style={{ width: 600, margin: "0 auto", textAlign: "center" }}>
      <Chessboard
        position={getFen()}
        onPieceDrop={onPieceDrop}
        onSquareClick={onSquareClick}
        customSquareStyles={customSquareStyles()}
        arePiecesDraggable={true}
      />
    </div>
  );
};

export default ChessBoard;