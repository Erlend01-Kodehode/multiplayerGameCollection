import { base_url as base } from '../../config.js'

// This file manages the paths for various assets used in the application.
const filePaths = {
  background: '/images/background',
  icons: '/images/icons',
  thumbnail: '/images/thumbnail',
  audio: '/audio',
  // Add other categories as needed
}

// Utility function to generate file paths
const path = (folderKey, fileName) => {
  const folderPath = filePaths[folderKey]
  if (!folderPath) {
    console.error(`Invalid folder key: ${folderKey}`)
    return ''
  }
  const encodedFileName = encodeURI(fileName)
  return `${base}${folderPath}/${encodedFileName}`
}

// getFilePaths utility for batch file path generation
export const getFilePaths = (folderKey, fileNames) =>
  fileNames.map(fileName => path(folderKey, fileName))

// Export individual file paths for easy access
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
  thumbnail_soliterror: path('thumbnail', 'soliterror.png'),
}

export const audioFiles = {
  whosthat: path('audio', 'whosthat.mp3'),
  // Add other audio files as needed
}