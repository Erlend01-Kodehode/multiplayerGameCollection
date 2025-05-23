import { useState, useEffect, useRef } from 'react'
import Square from './Square'
import style from '../../../../CSSModule/gameCSS/minesweeperGame.module.css'

const createEmptyBoard = (rows, cols) =>
  Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      revealed: false,
      hasMine: false,
      adjacentMines: 0,
      flagged: false,
    }))
  )

const placeMines = (board, mineCount) => {
  let placed = 0
  const rows = board.length
  const cols = board[0].length

  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (!board[r][c].hasMine) {
      board[r][c].hasMine = true
      placed++
    }
  }

  return board
}

const countAdjacentMines = (board, r, c) => {
  let count = 0
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = r + i
      const newCol = c + j
      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length &&
        board[newRow][newCol].hasMine
      ) {
        count++
      }
    }
  }
  return count
}

export default function Board({ rows = 0, cols = 0, mines = 0 }) {
  const [board, setBoard] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [flagsUsed, setFlagsUsed] = useState(0)
  const [time, setTime] = useState(0)
  const [started, setStarted] = useState(false)
  const timerRef = useRef(null)

  const initBoard = () => {
    let newBoard = createEmptyBoard(rows, cols)
    newBoard = placeMines(newBoard, mines)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newBoard[r][c].adjacentMines = countAdjacentMines(newBoard, r, c)
      }
    }
    setBoard(newBoard)
    setGameOver(false)
    setGameWon(false)
    setFlagsUsed(0)
    clearInterval(timerRef.current)
    setTime(0)
    setStarted(false)
  }

  useEffect(() => {
    initBoard()
  }, [])

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`
  }

  const revealSquare = (r, c) => {
    if (gameOver || board[r][c].flagged || board[r][c].revealed) return

    const newBoard = board.map((row) => row.map((square) => ({ ...square })))
    newBoard[r][c].revealed = true

    if (!started) {
      setStarted(true)
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 10)
      }, 10)
    }

    if (newBoard[r][c].hasMine) {
      setGameOver(true)
      clearInterval(timerRef.current)
      revealAllMines(newBoard)
      alert('Game over!')
    } else if (newBoard[r][c].adjacentMines === 0) {
      revealEmptySquares(newBoard, r, c)
    }

    setBoard(newBoard)
    checkWin(newBoard)
  }

  const revealEmptySquares = (board, r, c) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = r + i
        const newCol = c + j

        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          !board[newRow][newCol].revealed &&
          !board[newRow][newCol].hasMine
        ) {
          board[newRow][newCol].revealed = true
          if (board[newRow][newCol].adjacentMines === 0) {
            revealEmptySquares(board, newRow, newCol)
          }
        }
      }
    }
  }

  const toggleFlag = (r, c) => {
    if (board[r][c].revealed || gameOver) return

    const newBoard = board.map((row) => row.map((square) => ({ ...square })))
    const square = newBoard[r][c]
    square.flagged = !square.flagged
    setFlagsUsed(flagsUsed + (square.flagged ? 1 : -1))
    setBoard(newBoard)
    checkWin(newBoard)
  }

  const revealAllMines = (board) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].hasMine) {
          board[r][c].revealed = true
        }
      }
    }
  }

  const checkWin = (board) => {
    const allNonMinesRevealed = board.every((row) =>
      row.every((square) => square.hasMine || square.revealed)
    )
    if (allNonMinesRevealed) {
      setGameWon(true)
      setGameOver(true)
      clearInterval(timerRef.current)
      alert('You win!')
    }
  }

  return (
    <div className={style.board}>
      <div className={style.infoContainer}>
        <div className={style.info}>
          <p>Mines left: {mines - flagsUsed}</p>
          <p>Time: {formatTime(time)}</p>
        </div>
        <button className={style.button} onClick={initBoard}>
          Restart
        </button>
      </div>
      <div className={style.board}>
        {board.map((row, r) => (
          <div className={style.row} key={r}>
            {row.map((square, c) => (
              <Square
                key={`${r}-${c}`}
                square={square}
                onClick={() => revealSquare(r, c)}
                onRightClick={() => toggleFlag(r, c)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
