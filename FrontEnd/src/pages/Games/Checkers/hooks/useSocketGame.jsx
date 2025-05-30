
import { useEffect } from "react";
import socketApi from "../../Socket.jsx";

const useSocketGame = (pin, playerName, onRemoteMove) => {
  useEffect(() => {
    if (!pin || !playerName) return;

    // 1) Join the Socket.IO room
    socketApi.joinGame({ pin, playerName });

    // 2) Subscribe to incoming moves
    socketApi.onMoveMade(onRemoteMove);

    // 3) Clean up on unmount or change of pin/playerName
    return () => {
      socketApi.leaveGame({ pin, playerName });
      socketApi.off("moveMade", onRemoteMove);
    };
  }, [pin, playerName, onRemoteMove]);
};

export default useSocketGame;