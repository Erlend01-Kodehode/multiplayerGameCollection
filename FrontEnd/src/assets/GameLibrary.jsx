import { thumbnailImages, backgroundImages } from "./SourceLibrary.jsx";

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
      path: '',
      title: 'Game 3',
      thumbnail: backgroundImages.bg,
    },
  ]

  export default games;