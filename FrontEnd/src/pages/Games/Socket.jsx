import { io } from "socket.io-client";
import { API_BASE_URL } from "../../utility/getAPI";
const SOCKET_URL = API_BASE_URL;
const socket = io(SOCKET_URL, {
  autoConnect: true, 
});

let _gameType = null; // Variable to store the current game type

socket.game = {
  type: {
    get: () => _gameType,
    set: (type) => {
      _gameType = type;
      // Keep the 'value' property in sync if it's intended to be a public reflection
      socket.game.type.value = type;
    },
    value: null, // Initial value, will be updated by set
  }
}

export default socket;