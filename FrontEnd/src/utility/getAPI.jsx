export const API_BASE_URL = "http://34.51.175.243:3000";

// Generic helper function for API calls using fetch.
async function request(endpoint, method, body = null) {
  const url = API_BASE_URL + endpoint;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body !== null && method.toUpperCase() !== "GET") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    // Throw an error using the error message returned from the server (if any)
    throw new Error(data.error || response.statusText);
  }
  return data;
}

// ========================
// Player-related API calls
// ========================

export async function registerPlayer(playerData) {
  return await request("/api/player/register", "POST", playerData);
}

export async function loginPlayer(playerData) {
  return await request("/api/player/login", "POST", playerData);
}

// ========================
// Pin-related API calls
// ========================

// Check for a game PIN using the provided PIN.
export async function checkPin(pin) {
  return await request(`/api/game/checkpin/${pin}`, "GET");
}

// Create a new game PIN.
// The backend auto-generates the PIN so we send an empty object.
// If SQLite returns "SQLITE_BUSY", retry up to 3 times.
export async function createPin(retryCount = 0) {
  try {
    return await request("/api/game/createpin", "POST", {});
  } catch (error) {
    const errorMessage = error.message || "";
    if (retryCount < 3 && errorMessage.includes("SQLITE_BUSY")) {
      console.warn(
        `Database is busy. Retrying createPin (attempt ${retryCount + 1})...`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await createPin(retryCount + 1);
    }
    throw error;
  }
}

// Delete an existing game PIN by its PIN value.
export async function deletePin(pin) {
  return await request(`/api/game/deletepin/${pin}`, "DELETE");
}

// New function to fetch a new PIN:
// If an old PIN is provided, delete it first; then create a new one.
export async function fetchNewPin(oldPin) {
  if (oldPin) {
    try {
      await deletePin(oldPin);
    } catch (error) {
      console.error("Error deleting old pin:", error);
    }
  }
  return await createPin();
}
