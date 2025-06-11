import { thumbnailImages } from './SourceLibrary.jsx'

/*
  REMARK:
  Perhaps moving this list to the backend, having an endpoint
  return a JSON object with the game information would be better?
  This would allow for more flexibility in the future, and would make it
  easier to add new games to the library.
*/

// This file contains the game library for the home page.
const games = [
  {
    path: '/game/info/tictactoe',
    title: 'Tic Tac Toe',
    thumbnail: thumbnailImages.thumbnail_tictactoe,
  },
  {
    path: '/game/info/checkers',
    title: 'Checkers',
    thumbnail: thumbnailImages.thumbnail_checkers,
  },
  {
    path: '/game/info/chess',
    title: 'Chess',
    thumbnail: thumbnailImages.thumbnail_chess,
  },
  {
    path: '/game/info/minesweeper',
    title: 'Minesweeper',
    thumbnail: thumbnailImages.thumbnail_minesweeper,
  },
  {
    path: '/game/info/guesspokemon',
    title: 'Guess Pokémon',
    thumbnail: thumbnailImages.thumbnail_guesspokemon,
  },
  
]

export default games
