import React from 'react'
import { useParams } from 'react-router-dom'
import InfoTicTacToe from '../pages/Games/TicTacToe/infoTicTacToe.jsx'
import InfoCheckers from '../pages/Games/Checkers/infoCheckers.jsx'
import InfoChessGame from '../pages/Games/ChessGame/infoChessGame.jsx'
import InfoMinesweeper from '../pages/Games/Minesweeper/infoMinesweeper.jsx'
import InfoGuessPokemon from '../pages/Games/GuessThatGame/infoGuessPokemon.jsx'
import InfoSolitaire from '../pages/Games/Solitaire/infoSolitaire.jsx'

const gameInfoMap = {
  tictactoe: InfoTicTacToe,
  1: InfoTicTacToe,
  checkers: InfoCheckers,
  2: InfoCheckers,
  chess: InfoChessGame,
  3: InfoChessGame,
  minesweeper: InfoMinesweeper,
  4: InfoMinesweeper,
  guesspokemon: InfoGuessPokemon,
  5: InfoGuessPokemon,
  6: InfoSolitaire,
  solitaire: InfoSolitaire,

  // Add more mappings for other games here
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
