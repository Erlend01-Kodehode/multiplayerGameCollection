import { Link, NavLink } from 'react-router-dom'
import { iconImages } from "../../assets/SourceLibrary.jsx"

import styles from "../../CSSModule/componentCSS/header.module.css"

export default function Nav() {
  return (
    <div className={styles.nav}>
      <Link className={styles.navItem}>
        <img className={styles.navProfile} src={iconImages.navProfile} />
      </Link>
    </div>
  )
}