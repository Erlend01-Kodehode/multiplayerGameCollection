import { Link, NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <div className='nav'>
      <Link className='nav-item' to=''>
        <img className='nav-profile' src='./images/icons/pfp-default.png' />
      </Link>
    </div>
  )
}
