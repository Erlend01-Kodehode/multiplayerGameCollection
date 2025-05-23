import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "../App.jsx";
import ErrorMessage from "../utility/ErrorMessage.jsx";
import HomePage from "../pages/homepage.jsx";
import GamePage from "../pages/gamepage.jsx";
import GameDetails from "./GameInfoRouter.jsx";
import { homeRedirects, gameRedirects } from "./redirects.jsx";
import GamePlayRouter from "./GamePlayRouter.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorMessage />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      ...homeRedirects,
      {
        path: "game",
        element: <GamePage />,
        errorElement: <ErrorMessage />,
        children: [
          ...gameRedirects,
          {
            // example: /multiplayerGameCollection/#/game/info/tictactoe
            // or /multiplayerGameCollection/#/game/info/1
            path: "info/:gameId",
            element: <GameDetails />,
          },
          {
            // example: /multiplayerGameCollection/#/game/play/tictactoe
            // or /multiplayerGameCollection/#/game/play/1
            path: "play/:gameId",
            element: <GamePlayRouter />,
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