import { Link, NavLink } from 'react-router-dom'

import styles from "../CSSModule/componentCSS/gamecard.module.css"

export default function GameCard({ gameInfo: { path, title, thumbnail } }) {
  return (
    <Link className={styles.gameList} to={path}>
      <img className={styles.gameCard} src={thumbnail} />
      <div className={styles.gameThumbnail}>{title}</div>
    </Link>
  )
}
