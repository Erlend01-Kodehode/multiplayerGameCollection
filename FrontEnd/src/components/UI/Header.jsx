import { Link, NavLink } from 'react-router-dom'
import Nav from './Nav'
import logo from '/logo-PIXEL_PANDEMONIUM.png'

export default function Header() {
  return (
    <div className='header'>
      <Link>
        <img className='logo' src={logo} alt='Pixel Pandemonium logo' />
      </Link>
      <Nav />
    </div>
  )
}
