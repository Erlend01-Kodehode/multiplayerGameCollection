import style from '../../../../CSSModule/gameCSS/minesweeperGame.module.css'

export default function Square({ square, onClick, onRightClick }) {
  const { revealed, hasMine, adjacentMines, flagged } = square

  const handleClick = () => onClick()
  const handleRightClick = (e) => {
    e.preventDefault()
    onRightClick()
  }

  let content = ''
  if (flagged) {
    content = '🚩'
  } else if (revealed) {
    content = hasMine ? '💣' : adjacentMines || ''
  }

  return (
    <div
      className={`${style.square} ${revealed ? style.revealed : ''}`}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {content}
    </div>
  )
}
