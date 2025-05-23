import { thumbnailImages } from './SourceLibrary.jsx'

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
]

export default games
