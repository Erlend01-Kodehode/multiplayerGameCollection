import { thumbnailImages } from './SourceLibrary.jsx'

// This file contains the game library for the home page.
const gamePaths = [
  {
    key: 'tictactoe',
    title: 'Tic Tac Toe',
    thumbnail: thumbnailImages.thumbnail_tictactoe,
  },
  {
    key: 'checkers',
    title: 'Checkers',
    thumbnail: thumbnailImages.thumbnail_checkers,
  },
  {
    key: 'chess',
    title: 'Chess',
    thumbnail: thumbnailImages.thumbnail_chess,
  },
  {
    key: 'minesweeper',
    title: 'Minesweeper',
    thumbnail: thumbnailImages.thumbnail_minesweeper,
  },
  {
    key: 'guesspokemon',
    title: 'Guess Pokémon',
    thumbnail: thumbnailImages.thumbnail_guesspokemon,
  },
]

// Dynamically generate the path property using the key
const games = gamePaths.map(game => ({
  ...game,
  path: `/game/info/${game.key}`,
}))

export default games