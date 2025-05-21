import GameCard from '../components/GameCard'
import styles from '../CSSModule/homepage.module.css'

const HomePage = () => {
  const games = [
    {
      path: '',
      title: 'Game 1',
      thumbnail: '',
    },
    {
      path: '',
      title: 'Game 2',
      thumbnail: '',
    },
    {
      path: '',
      title: 'Game 3',
      thumbnail: '',
    },
  ]

  return (
    <div className='main'>
      <h1>Welcome to the Home Page</h1>
      <p>This is the content of the home page.</p>
      <div className='game-list'>
        {games.map((game, index) => (
          <GameCard key={index} gameInfo={game} />
        ))}
      </div>
    </div>
  )
}

export default HomePage
