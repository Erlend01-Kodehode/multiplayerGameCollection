import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import AppRouter from './utility/router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
)
