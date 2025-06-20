import socket from "../../Socket.jsx";

/**
 * Register all TicTacToe socket event handlers.
 * @param {Object} params
 * @param {(pin: string) => void} params.setGamePin
 * @param {(symbol: "X"|"O"|null) => void} params.setPlayerSymbol
 * @param {(name: string) => void} params.setPlayerName
 * @param {(players: any[]) => void} params.setLobbyPlayers
 * @param {(min: number) => void} params.setMinPlayersRequired
 * @param {(max: number) => void} params.setMaxPlayersAllowed
 * @param {(id: string) => void} params.setHostId
 * @param {(mode: "host"|"join") => void} params.setGameMode
 * @param {(waiting: boolean) => void} params.setIsWaitingInLobby
 * @param {(setup: boolean) => void} params.setIsSetupComplete
 * @param {(msg: string) => void} params.setGameStatusMessage
 * @param {(squares: ("X"|"O"|null)[]) => void} params.setBoardSquares
 * @param {(turn: string|null) => void} params.setCurrentTurn
 * @param {(players: any[]) => void} params.setPlayers
 * @param {(winner: "X"|"O"|null) => void} params.setWinner
 * @param {(draw: boolean) => void} params.setIsDraw
 * @param {Function} params.navigate
 * @param {React.RefObject} params.boardRef
 * @param {(string|null) => void} [params.setResetRequestedBy]
 * @param {(boolean) => void} [params.setShowResetConfirm]
 */
export function registerTicTacToeSocketHandlers({
  setGamePin,
  setPlayerSymbol,
  setPlayerName,
  setLobbyPlayers,
  setMinPlayersRequired,
  setMaxPlayersAllowed,
  setHostId,
  setGameMode,
  setIsWaitingInLobby,
  setIsSetupComplete,
  setGameStatusMessage,
  setBoardSquares,
  setCurrentTurn,
  setPlayers,
  setWinner,
  setIsDraw,
  navigate,
  boardRef,
  setResetRequestedBy,
  setShowResetConfirm,
}) {
  // event: gameCreatedWaitingForPlayers
  socket.on("gameCreatedWaitingForPlayers", (data) => {
    console.log("Game created:", data);
    setGamePin(data.pin);
    setPlayerSymbol(data.playerSymbol);
    setPlayerName(data.playerName);
    setLobbyPlayers(data.playersList);
    setMinPlayersRequired(data.minPlayers);
    setMaxPlayersAllowed(data.maxPlayers);
    setHostId(data.hostId);
    setGameMode("host");
    setIsWaitingInLobby(true);
    setIsSetupComplete(false);
    setGameStatusMessage(`Game PIN: ${data.pin}. Waiting for players... (${data.playersList.length}/${data.minPlayers})`);
    navigate(`?mode=host&pin=${data.pin}`, { replace: true });
  });

  // event: playerJoinedLobby
  socket.on("playerJoinedLobby", (data) => {
    setLobbyPlayers(data.playersList);
    setGameStatusMessage(`Players: ${data.playersList.length}/${data.maxPlayers}. Waiting for more...`);
  });

  // event: joinedLobby
  socket.on("joinedLobby", (data) => {
    setGamePin(data.pin);
    setPlayerSymbol(data.yourSymbol);
    setGameMode("join");
    setIsWaitingInLobby(true);
    setIsSetupComplete(false);
    setLobbyPlayers(data.playersData);
    setGameStatusMessage(data.message || `Joined lobby for PIN: ${data.pin}. Waiting for host.`);
    navigate(`?mode=join&pin=${data.pin}`, { replace: true });
  });

  // event: gameReady
  socket.on("gameReady", (data) => {
    setGamePin(data.pin);
    setBoardSquares(data.board);
    setCurrentTurn(data.initialTurn);
    setPlayers(data.playersData);
    setIsSetupComplete(true);
    setIsWaitingInLobby(false);
    setGameStatusMessage("Game started!");
  });

  // event: gameStateUpdate
  socket.on("gameStateUpdate", (data) => {
    setBoardSquares(data.board);
    setCurrentTurn(data.turn);
    setWinner(data.winner);
    setIsDraw(data.isDraw);
    setPlayers(data.playersData || []);
    if (data.winner) {
      setGameStatusMessage(`${data.winner} wins!`);
    } else if (data.isDraw) {
      setGameStatusMessage("It's a draw!");
    } else {
      setGameStatusMessage(`Turn: ${data.turn}`);
    }
  });

  // event: gameReset
  socket.on("gameReset", (data) => {
    setBoardSquares(data.board);
    setCurrentTurn(data.turn);
    setWinner(null);
    setIsDraw(false);
    setPlayers(data.playersData);
    setGameStatusMessage(data.message || "Game reset.");
    if (boardRef.current && boardRef.current.resetBoardVisuals) {
      boardRef.current.resetBoardVisuals();
    }
  });

  // event: gameError
  socket.on("gameError", (error) => {
    setGameStatusMessage(`Error: ${error.message}`);
    alert(`Game Error: ${error.message}`);
  });

  // event: playerDisconnected
  socket.on("playerDisconnected", (data) => {
    setGameStatusMessage(data.message);
    setIsSetupComplete(false);
    setIsWaitingInLobby(false);
    setGamePin(null);
    navigate(`/game/info/tictactoe`, { replace: true });
    alert("Host disconnected. The lobby was closed.");
  });

  // event: gameTerminated
  socket.on("gameTerminated", (data) => {
    setGameStatusMessage(data.message);
    setIsSetupComplete(false);
    setIsWaitingInLobby(false);
    setGamePin(null);
    navigate(`/game/info/tictactoe`, { replace: true });
    alert("Game terminated.");
  });

  // --- Reset confirmation request handler ---
  socket.on("resetConfirmationRequested", (data) => {
    if (setResetRequestedBy) setResetRequestedBy(data.requestedByName || "Opponent");
    if (setShowResetConfirm) setShowResetConfirm(true);
    setGameStatusMessage(`${data.requestedByName || "Opponent"} wants to reset the game.`);
  });

  // --- Reset confirmed handler ---
  socket.on("resetConfirmed", () => {
    setGameStatusMessage("Game reset.");
    if (setShowResetConfirm) setShowResetConfirm(false);
  });

  // --- Reset declined handler ---
  socket.on("resetDeclined", () => {
    setGameStatusMessage("Reset request was declined.");
    if (setShowResetConfirm) setShowResetConfirm(false);
  });
}

/**
 * Unregister all TicTacToe socket event handlers.
 * @returns {void}
 */
export function unregisterTicTacToeSocketHandlers() {
  socket.off("gameCreatedWaitingForPlayers");
  socket.off("playerJoinedLobby");
  socket.off("joinedLobby");
  socket.off("gameReady");
  socket.off("gameStateUpdate");
  socket.off("gameReset");
  socket.off("gameError");
  socket.off("playerDisconnected");
  socket.off("gameTerminated");
  socket.off("resetConfirmationRequested");
  socket.off("resetConfirmed");
  socket.off("resetDeclined");
}