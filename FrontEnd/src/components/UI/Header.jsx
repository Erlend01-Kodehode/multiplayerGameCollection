import { Link, NavLink } from 'react-router-dom'
import Nav from './Nav'
import { iconImages } from '../../assets/SourceLibrary.jsx'

export default function Header() {
  return (
    <div className='header'>
      <Link>
        <img className='logo' src={iconImages.pixel_pandemonium} alt='Pixel Pandemonium logo' />
      </Link>
      <Nav />
    </div>
  )
}
