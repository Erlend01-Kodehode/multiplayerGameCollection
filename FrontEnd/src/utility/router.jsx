import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";

import App from "../App.jsx";
import ErrorMessage from "../utility/ErrorMessage.jsx";
import HomePage from "../pages/homepage.jsx";
import GamePage from "../pages/gamepage.jsx";
import GameDetails from "../pages/Games/gameDetails.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorMessage />,
    children: [
      {
        // Home page redirection when landing at the root path.
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        // Container for game-related routes.
        path: "game",
        element: <GamePage />,
        errorElement: <ErrorMessage />,
        children: [
          {
            // When at '/game' with no additional segment, redirect to home.
            index: true,
            element: <Navigate to="/home" replace />,
          },
          {
            // Example: /multiplayerGameCollection/#/game/info/1
            path: "info/:gameId",
            element: <GameDetails />,
          },
          {
            // Future route for playing the game.
            // Example: /multiplayerGameCollection/#/game/play/1
            path: "play/:gameId",
            element: (
              <div>
                <h1>Game Play</h1>
              </div>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorMessage />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;