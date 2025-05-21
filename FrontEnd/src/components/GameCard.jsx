import { Link, NavLink } from 'react-router-dom'

export default function GameCard({ gameInfo: { path, title, thumbnail } }) {
  return (
    <Link className='game-card' to={path}>
      <img className='game-thumbnail' src={thumbnail} />
      <div className='game-title'>{title}</div>
    </Link>
  )
}
