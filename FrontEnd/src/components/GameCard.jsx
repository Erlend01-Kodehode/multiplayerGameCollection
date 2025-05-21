export default function GameCard({ gameInfo: { thumbnail, title } }) {
  return (
    <div className='game-card'>
      <img className='game-thumbnail' src={thumbnail} />
      <div className='game-title'>{title}</div>
    </div>
  )
}
