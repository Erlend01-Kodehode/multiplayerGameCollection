import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "../App.jsx";
import ErrorMessage from "../utility/ErrorMessage.jsx";
import HomePage from "../pages/homepage.jsx";
import GamePage from "../pages/gamepage.jsx";
import GameDetails from "../pages/Games/gameDetails.jsx";
import { homeRedirects, gameRedirects } from "./redirects.jsx";

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
            path: "info/:gameId",
            element: <GameDetails />,
          },
          {
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