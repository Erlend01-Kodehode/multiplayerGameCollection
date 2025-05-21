import { Link, NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <div className='nav'>
      <Link className='nav-item'>Games</Link>
      <Link className='nav-item'>Profile</Link>
    </div>
  )
}
