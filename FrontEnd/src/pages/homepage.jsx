import React from 'react';
import GameCard from '../components/GameCard';
import styles from '../CSSModule/homepage.module.css';
import games from '../assets/GameLibrary.jsx';

// Helper to chunk array into rows of N items
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const getRowSize = (length) => {
  if (length <= 2) return 2;
  if (length % 3 === 0 || length > 4) return 3;
  return 2;
};

const HomePage = () => {
  const rowSize = getRowSize(games.length);
  const rows = chunkArray(games, rowSize);

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <h1>Game Library</h1>
        <p>Welcome to the Pixel Pademonium! Choose a game to play.</p>
      </div>
      <div className={styles.gameContainer}>
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className={styles.gameRow}>
            {row.map((game, index) => (
              <GameCard key={index} gameInfo={game} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;