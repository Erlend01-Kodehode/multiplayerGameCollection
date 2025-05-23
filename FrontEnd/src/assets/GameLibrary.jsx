import { thumbnailImages, backgroundImages } from './SourceLibrary.jsx'

// This file contains the game library for the home page.
const games = [
  {
    path: '/game/info/tictactoe',
    title: 'Tic Tac Toe',
    thumbnail: thumbnailImages.thumbnail_tictactoe,
  },
  {
    path: '',
    title: 'Chess',
    thumbnail: backgroundImages.bg,
  },
  {
    path: '/game/info/minesweeper',
    title: 'Minesweeper',
    thumbnail: backgroundImages.bg,
  },
]

export default games
