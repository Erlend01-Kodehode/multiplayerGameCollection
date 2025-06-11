import { base_url as base } from '../../config.js'

/*
  REMARK:
  If the source information for each game was separated into separate directories,
  and each directory had a "resources.json" file with the asset information,
  then it would be easier to add new games to the library.

  Even better if the assets were hosted by the backend, and the frontend
  just requested the assets from the backend.

  This would allow for more flexibility in the future, and would make it
  easier to add new games to the library.

  The backend would need to be able to handle the requests for the assets,
  but this can easily be done by using something like `app.use(express.static('public'))`.
*/

const filePaths = {
  background: '/images/background',
  icons: '/images/icons',
  thumbnail: '/images/thumbnail',
  audio: '/audio',
  // Add other categories as needed
}

const path = (folderKey, fileName) => {
  const folderPath = filePaths[folderKey]
  if (!folderPath) {
    console.error(`Invalid folder key: ${folderKey}`)
    return ''
  }
  const encodedFileName = encodeURI(fileName)
  return `${base}${folderPath}/${encodedFileName}`
}

export const backgroundImages = {
  bg: path('background', 'bg.svg'),
  bg2: path('background', 'bg2.svg'),
  bg2_1080p: path('background', 'bg21080p.svg'),
}

export const iconImages = {
  pixel_pandemonium: path('icons', 'logo-PIXEL_PANDEMONIUM.png'),
  navProfile: path('icons', 'pfp-default.png'),
}

export const thumbnailImages = {
  thumbnail_tictactoe: path('thumbnail', 'thumbnail-tictactoe.svg'),
  thumbnail_checkers: path('thumbnail', 'thumbnail-checkers.svg'),
  thumbnail_chess: path('thumbnail', 'thumbnail-chess.svg'),
  thumbnail_minesweeper: path('thumbnail', 'thumbnail-minesweeper.png'),
  thumbnail_guesspokemon: path('thumbnail', 'thumbnail-guesspokemon.svg'),
}

export const audioFiles = {
  whosthat: path('audio', 'whosthat.mp3'),
  // Add other audio files as needed
}