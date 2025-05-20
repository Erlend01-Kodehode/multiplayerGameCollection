
import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";

import HomePage from "../pages/homepage.jsx";
import GamePage from "../pages/game.jsx"
import App from "../App.jsx";
import ErrorMessage from "../utility/ErrorMessage.jsx";

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
        element: <HomePage/>,
      },
      {
        path: "game",
        element: <GamePage/>,
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