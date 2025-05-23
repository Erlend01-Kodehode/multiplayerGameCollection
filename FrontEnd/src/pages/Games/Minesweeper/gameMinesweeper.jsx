import Board from './components/Board'
import style from '../../../CSSModule/gameCSS/minesweeperGame.module.css'

export default function GameMinesweeper() {
  return (
    <div className={style.container}>
      <h1>Minesweeper</h1>
      <Board rows={20} cols={20} mines={50} />
    </div>
  )
}
