import React from "react";
import ChessBoard from "./components/ChessBoard";

console.log("Imported ChessBoard:", ChessBoard);

const ChessGame = () => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <ChessBoard />
    </div>
  );
};

export default ChessGame;
