import GameCard from '../components/GameCard'
import styles from '../CSSModule/homepage.module.css'
import GameLibrary from '../assets/GameLibrary.jsx'


const HomePage = () => {
  const games = GameLibrary;
  
  return (
    <div className={styles.main}>
      <h1>Welcome to the Home Page</h1>
      <p>This is the content of the home page.</p>
      <div className={styles.gameList}>
        {games.map((game, index) => (
          <GameCard key={index} gameInfo={game} />
        ))}
      </div>
    </div>
  )
}

export default HomePage
