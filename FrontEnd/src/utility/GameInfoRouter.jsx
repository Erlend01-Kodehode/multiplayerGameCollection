import React from 'react'
import { useParams } from 'react-router-dom'
import InfoTicTacToe from '../pages/Games/TicTacToe/infoTicTacToe.jsx'
import InfoMinesweeper from '../pages/Games/Minesweeper/infoMinesweeper.jsx'

const gameInfoMap = {
  tictactoe: InfoTicTacToe,
  1: InfoTicTacToe,
  // Add more mappings for other games here
  minesweeper: InfoMinesweeper,
  3: InfoMinesweeper,
}

const GameDetails = () => {
  const { gameId } = useParams()
  const InfoComponent = gameInfoMap[gameId]

  if (!InfoComponent) {
    const notFoundStyleContainer = {
      display: 'flex',
      justifyContent: 'center',
    }
    return (
      <div styles={notFoundStyleContainer}>
        <h1>Game Details</h1>
        <p>No information available for this game.</p>
      </div>
    )
  }

  return <InfoComponent />
}

export default GameDetails
