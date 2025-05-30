import { Link, NavLink } from 'react-router-dom'
import Nav from './Nav'
import { iconImages } from '../../assets/SourceLibrary.jsx'
import styles from "../../CSSModule/componentCSS/header.module.css"

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <Link to={'/'} className={styles.logoLink}>
          <img className={styles.logo} src={iconImages.pixel_pandemonium} alt='Pixel Pandemonium logo' />
        </Link>
        <Nav />
      </div>
    </div>
  )
}
