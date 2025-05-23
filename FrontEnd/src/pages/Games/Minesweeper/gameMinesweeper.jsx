import Board from './components/Board'
import style from '../../../CSSModule/gameCSS/minesweeperGame.module.css'

export default function GameMinesweeper() {
  return (
    <div className={style.container}>
      <h1>Minesweeper</h1>
      <Board rows={15} cols={10} mines={10} />
    </div>
  )
}
