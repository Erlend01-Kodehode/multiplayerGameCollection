import { Navigate } from "react-router-dom";

// Top-level redirects (for /home/play and /home/info)
export const homeRedirects = [
  {
    path: "home/play",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "home/info",
    element: <Navigate to="/home" replace />,
  },
];

// Nested game redirects
export const gameRedirects = [
  {
    index: true,
    element: <Navigate to="/home" replace />,
  },
  {
    path: "info",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "play",
    element: <Navigate to="/home" replace />,
  },
];