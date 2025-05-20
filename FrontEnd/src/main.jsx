import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./utility/customstyle.css"
import AppRouter from "./utility/router.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
