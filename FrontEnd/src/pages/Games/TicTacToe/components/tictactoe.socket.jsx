import socket from "../../Socket.jsx";

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
}) {
  socket.on("gameCreatedWaitingForPlayers", (data) => {
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

  socket.on("playerJoinedLobby", (data) => {
    setLobbyPlayers(data.playersList);
    setGameStatusMessage(`Players: ${data.playersList.length}/${data.maxPlayers}. Waiting for more...`);
  });

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

  socket.on("gameReady", (data) => {
    setGamePin(data.pin);
    setBoardSquares(data.board);
    setCurrentTurn(data.initialTurn);
    setPlayers(data.playersData);
    setIsSetupComplete(true);
    setIsWaitingInLobby(false);
    setGameStatusMessage("Game started!");
  });

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

  socket.on("gameError", (error) => {
    setGameStatusMessage(`Error: ${error.message}`);
    alert(`Game Error: ${error.message}`);
  });

  socket.on("playerDisconnected", (data) => {
    setGameStatusMessage(data.message);
    setIsSetupComplete(false);
    setIsWaitingInLobby(false);
    setGamePin(null);
    navigate(`/game/info/tictactoe`, { replace: true });
    alert("Host disconnected. The lobby was closed.");
  });

  socket.on("gameTerminated", (data) => {
    setGameStatusMessage(data.message);
    setIsSetupComplete(false);
    setIsWaitingInLobby(false);
    setGamePin(null);
    navigate(`/game/info/tictactoe`, { replace: true });
    alert("Game terminated.");
  });
}

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
}