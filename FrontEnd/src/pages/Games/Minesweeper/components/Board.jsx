import { useState, useEffect } from 'react'
import Square from './Square'
import styles from '../../../../CSSModule/gameCSS/minesweeperGame.module.css'

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

export default function Board({ rows = 10, cols = 10, mines = 10 }) {
  const [board, setBoard] = useState([])
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    let newBoard = createEmptyBoard(rows, cols)
    newBoard = placeMines(newBoard, mines)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newBoard[r][c].adjacentMines = countAdjacentMines(newBoard, r, c)
      }
    }
    setBoard(newBoard)
  }, [])

  const revealSquare = (r, c) => {
    if (gameOver || board[r][c].flagged || board[r][c].revealed) return

    const newBoard = [...board.map((row) => [...row])]
    newBoard[r][c].revealed = true

    if (newBoard[r][c].hasMine) {
      setGameOver(true)
      alert('Game over!')
    } else if (newBoard[r][c].adjacentMines === 0) {
      revealEmptySquares(newBoard, r, c)
    }

    setBoard(newBoard)
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

    const newBoard = [...board.map((row) => [...row])]
    newBoard[r][c].flagged = !newBoard[r][c].flagged
    setBoard(newBoard)
  }

  return (
    <div className={styles.board}>
      {board.map((row, r) => (
        <div className={styles.row} key={r}>
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
  )
}
