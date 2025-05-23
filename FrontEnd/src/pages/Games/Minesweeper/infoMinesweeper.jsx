import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PlayButton } from '../../../components/Buttons.jsx'
import style from '../../../CSSModule/infoCSS/minesweeperInfo.module.css'

export default function InfoMinesweeper() {
  const navigate = useNavigate()

  const handlePlayClick = () => {
    navigate('/game/play/minesweeper')
  }

  return (
    <div className={style.container}>
      <h1>Minesweeper</h1>
      <div className={style.game}>
        <div className={style.gameInfo}>
          <p>Players: 2</p>
          <p>Grid size: 20x20</p>
          <p>Mines: 50</p>
          <p>Clear the minefield without setting off any mines.</p>
        </div>
        <PlayButton onClick={handlePlayClick} />
      </div>
    </div>
  )
}
