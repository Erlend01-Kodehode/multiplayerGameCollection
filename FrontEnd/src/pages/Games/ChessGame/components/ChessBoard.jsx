import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import useChessEngine from "../hooks/useChessEngine";

const ChessBoard = ({ setTurnText, highlightedSquares, setHighlightedSquares }) => {
  const { getFen, getTurn, makeMove, getLegalMoves } = useChessEngine();
  const currentTurn = getTurn();

  const [selectedSquare, setSelectedSquare] = useState(null);
  const [moveInfo, setMoveInfo] = useState([]);

  useEffect(() => {
    setTurnText(currentTurn === "w" ? "♙ White's Turn" : "♟ Black's Turn");
  }, [currentTurn, setTurnText]);

  const onSquareClick = (square, piece) => {
    if (!selectedSquare) {
      const moves = getLegalMoves(square);
      if (moves.length > 0) {
        setSelectedSquare(square);
        setMoveInfo(moves);
        setHighlightedSquares([square, ...moves.map(m => m.to)]);
      } else {
        setSelectedSquare(null);
        setMoveInfo([]);
        setHighlightedSquares([]);
      }
    } else {
      if (square === selectedSquare) {
        setSelectedSquare(null);
        setMoveInfo([]);
        setHighlightedSquares([]);
        return;
      }
      const move = moveInfo.find(m => m.to === square);
      if (move && move.promotion) {
        setSelectedSquare(null);
        setMoveInfo([]);
        setHighlightedSquares([]);
        return;
      }
      const result = makeMove(selectedSquare, square);
      setSelectedSquare(null);
      setMoveInfo([]);
      setHighlightedSquares([]);
      return result;
    }
  };

  const onPieceDrop = (sourceSquare, targetSquare, piece) => {
    if (
      (piece === "wP" && targetSquare[1] === "8") ||
      (piece === "bP" && targetSquare[1] === "1")
    ) {
      return false;
    }
    const result = makeMove(sourceSquare, targetSquare);
    setSelectedSquare(null);
    setMoveInfo([]);
    setHighlightedSquares([]);
    return !!result;
  };

  const onPromotionCheck = (sourceSquare, targetSquare, piece) => {
    return (
      (piece === "wP" && targetSquare[1] === "8") ||
      (piece === "bP" && targetSquare[1] === "1")
    );
  };

  const onPromotionPieceSelect = (piece, from, to) => {
    const promotion = piece ? piece[1].toLowerCase() : "q";
    const result = makeMove(from, to, promotion);
    setSelectedSquare(null);
    setMoveInfo([]);
    setHighlightedSquares([]);
    return !!result;
  };

  const customSquareStyles = () => {
    const stylesObj = {};
    if (highlightedSquares && highlightedSquares.length > 0) {
      stylesObj[highlightedSquares[0]] = { backgroundColor: "#ffe066" };
      moveInfo.forEach((move) => {
        stylesObj[move.to] = {
          backgroundColor: move.isCapture ? "#ff9800" : "#4caf5099",
        };
      });
    }
    return stylesObj;
  };

  return (
    <div style={{ width: 600, margin: "0 auto", textAlign: "center" }}>
      <Chessboard
        position={getFen()}
        onSquareClick={onSquareClick}
        onPieceDrop={onPieceDrop}
        customSquareStyles={customSquareStyles()}
        arePiecesDraggable={true}
        onPromotionCheck={onPromotionCheck}
        onPromotionPieceSelect={onPromotionPieceSelect}
        promotionDialogVariant="default"
        showBoardNotation={false}
      />
    </div>
  );
};

export default ChessBoard;