import { Link, NavLink } from 'react-router-dom'

import styles from "../CSSModule/componentCSS/gamecard.module.css"

export default function GameCard({ gameInfo: { path, title, thumbnail } }) {
  return (
    <Link className={styles.gameCard} to={path}>
      <img className={styles.gameThumbnail} src={thumbnail} />
      <div className={styles.gameTitle}>{title}</div>
    </Link>
  )
}
