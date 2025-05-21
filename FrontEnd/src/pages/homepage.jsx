import GameCard from '../components/GameCard'
import styles from '../CSSModule/homepage.module.css'
import games from '../assets/GameLibrary.jsx'


const HomePage = () => {
  
  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <h1>Game Library</h1>
        <p>Welcome to the Game Library! Choose a game to play.</p>
      </div>
      <div className={styles.gameList}>
        {games.map((game, index) => (
          <GameCard key={index} gameInfo={game} />
        ))}
      </div>
    </div>
  )
}

export default HomePage