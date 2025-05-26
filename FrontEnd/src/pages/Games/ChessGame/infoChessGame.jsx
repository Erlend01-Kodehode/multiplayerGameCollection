import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../CSSModule/infoCSS/chessgameinfo.module.css";
import {
  PlayButton,
  JoinGameButton,
  HostGameButton,
} from "../../../components/Buttons";
import GameSession from "../GameSession";

const InfoChessGame = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const [showSession, setShowSession] = useState(false);

  const handlePlayClick = useCallback(() => {
    navigate("/game/play/chess");
  }, [navigate]);

  const handleComplete = (pin) => {
    navigate(`/game/play/chess?pin=${pin}`);
  };

  const info = useMemo(
    () => [
      {
        title: "Chess Rules",
        content: (
          <ul>
            <li>
              <strong>Objective:</strong> Checkmate your opponent's king—put the
              king in a position where it cannot escape capture.
            </li>
            <li>
              <strong>Setup:</strong> Each player starts with 16 pieces: 1 king,
              1 queen, 2 rooks, 2 bishops, 2 knights, and 8 pawns, arranged on
              the two rows closest to them.
            </li>
            <li>
              <strong>Piece Movement:</strong>
              <ul>
                <li>
                  <strong>Pawns</strong> move forward one square, capture
                  diagonally, and can move two squares forward from their
                  starting position. Upon reaching the last rank, they promote
                  to another piece (usually a queen).
                </li>
                <li>
                  <strong>Knights</strong> move in an L-shape: two squares in
                  one direction and then one square perpendicular.
                </li>
                <li>
                  <strong>Bishops</strong> move diagonally any number of
                  squares.
                </li>
                <li>
                  <strong>Rooks</strong> move horizontally or vertically any
                  number of squares.
                </li>
                <li>
                  <strong>Queens</strong> move any number of squares in any
                  direction.
                </li>
                <li>
                  <strong>Kings</strong> move one square in any direction.
                </li>
              </ul>
            </li>
            <li>
              <strong>Special Moves:</strong>
              <ul>
                <li>
                  <strong>Castling:</strong> The king and a rook move
                  simultaneously under certain conditions.
                </li>
                <li>
                  <strong>En passant:</strong> A special pawn capture that can
                  occur immediately after a pawn moves two squares forward from
                  its starting position.
                </li>
                <li>
                  <strong>Promotion:</strong> When a pawn reaches the last rank,
                  it must be promoted to a queen, rook, bishop, or knight.
                </li>
              </ul>
            </li>
            <li>
              <strong>Game End:</strong> The game ends in checkmate, stalemate,
              draw by repetition, insufficient material, or the 50-move rule.
            </li>
          </ul>
        ),
      },
      {
        title: "How to Play",
        content: (
          <ul>
            <li>
              <strong>Click-to-move:</strong> Click a piece to select it, then
              click a destination square to move.
            </li>
            <li>
              <strong>Drag-and-drop:</strong> You can also drag and drop pieces
              to move them.
            </li>
            <li>
              <strong>Pawn Promotion:</strong> When a pawn reaches the last
              rank, select a promotion piece in the dialog that appears.
            </li>
            <li>
              <strong>Automatic Detection:</strong> The game will automatically
              detect checkmate and draws.
            </li>
            <li>
              <strong>Tip:</strong> Use highlighted squares to see possible
              moves for the selected piece.
            </li>
          </ul>
        ),
      },
    ],
    []
  );

  return (
    <div className={styles.infoContainer}>
      <h2 className={styles.infoTitle}>Chess Game Info</h2>
      {/* <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <PlayButton onClick={handlePlayClick}>Play Chess</PlayButton>
      </div> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <JoinGameButton
          onClick={() => {
            setMode("join");
            setShowSession(true);
          }}
        />
        <HostGameButton
          onClick={() => {
            setMode("host");
            setShowSession(true);
          }}
        />
      </div>
      {showSession && <GameSession mode={mode} onComplete={handleComplete} />}
      {info.map((section, idx) => (
        <div key={idx} className={styles.infoSection}>
          <h3 className={styles.sectionTitle}>{section.title}</h3>
          <div className={styles.sectionContent}>{section.content}</div>
        </div>
      ))}
    </div>
  );
};

export default InfoChessGame;
