// /src/utility/getAPI.jsx (Frontend)
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Register a new player
export const registerPlayer = async (playerData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/player/register`,
      playerData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering player:", error.response?.data || error);
    throw error;
  }
};

// Log in a player
export const loginPlayer = async (playerData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/player/login`,
      playerData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error);
    throw error;
  }
};

// Check for a PIN using the parameterized route.
// This endpoint requires a PIN as a URL parameter.
export const checkPin = async (pin) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/game/checkpin/${pin}`);
    return response.data;
  } catch (error) {
    console.error("Error checking PIN:", error.response?.data || error);
    throw error;
  }
};

// Create a new PIN by sending it to the backend for storage.
// Expects a valid 4-digit PIN in the request body, sent as a number.
export const createPin = async (pin) => {
  try {
    // Convert the PIN to a number so that the payload appears as { "pin": 1234 }
    const numericPin = Number(pin);

    const response = await axios.post(
      `${API_BASE_URL}/api/game/createpin`,
      { pin: numericPin },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating PIN:", error.response?.data || error);
    throw error;
  }
};