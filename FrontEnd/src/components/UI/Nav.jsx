import { Link, NavLink } from 'react-router-dom'

import styles from "../../CSSModule/componentCSS/header.module.css"

export default function Nav() {
  return (
    <div className={styles.nav}>
      <Link className={styles.navItem}>Games</Link>
      <Link className={styles.navItem}>Profile</Link>
    </div>
  )
}
