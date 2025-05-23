import style from '../../../../CSSModule/gameCSS/minesweeperGame.module.css'

export default function Square({ square, onClick, onRightClick }) {
  const { revealed, hasMine, adjacentMines, flagged } = square

  const handleClick = () => onClick()
  const handleRightClick = (e) => {
    e.preventDefault()
    onRightClick()
  }

  let content = ''
  let numberClass = ''

  if (flagged) {
    content = '🚩'
  } else if (revealed) {
    if (hasMine) {
      content = '💣'
    } else if (adjacentMines > 0) {
      content = adjacentMines
      numberClass = style[`number${adjacentMines}`] || ''
    }
  }

  return (
    <div
      className={`${style.square} ${revealed ? style.revealed : ''} ${numberClass}`}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {content}
    </div>
  )
}
