import GameCard from '../components/GameCard'
import styles from '../CSSModule/homepage.module.css'

const HomePage = () => {
  const games = [
    {
      path: '/game/play/tictactoe',
      title: 'Tic Tac Toe',
      thumbnail: './images/thumbnail-tictactoe.png',
    },
    {
      path: '',
      title: 'Game 2',
      thumbnail: './images/background/bg.png',
    },
    {
      path: '',
      title: 'Game 3',
      thumbnail: './images/background/bg.png',
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
