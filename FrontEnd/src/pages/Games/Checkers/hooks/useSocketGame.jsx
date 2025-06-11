import { useEffect } from "react";
import socketApi from "../../Socket.jsx";

const useSocketGame = (pin, playerName, piece, onRemoteMove) => {
  useEffect(() => {
    if (!pin || !playerName || !piece) return;

    // Join with piece info
    socketApi.joinGame({ pin, playerName, piece });

    // Subscribe to incoming moves
    socketApi.onMoveMade(onRemoteMove);

    // Clean up on unmount or change of pin/playerName/piece
    return () => {
      socketApi.leaveGame({ pin, playerName, piece });
      socketApi.off("checkers:moveMade", onRemoteMove);
    };
  }, [pin, playerName, piece, onRemoteMove]);
};

export default useSocketGame;