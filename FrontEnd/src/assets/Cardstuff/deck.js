// Deck.js

const suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];




const colorMap = {
  Hearts: "red",
  Diamonds: "red",
  Clubs: "black",
  Spades: "black",
};

const backImages = {
  red: "/cards/cardBack_red1.png",
  black: "/cards/cardBack_blue1.png",
  green: "/cards/cardBack_green1.png", // valgfri ekstra farge
};

export function createDeck(backColor = null) {
  const deck = suits.flatMap((suit) =>
    values.map((value, index) => {
      const color = colorMap[suit];
      return {
        id: `${value}${suit}`,
        suit,
        value,
        numericValue: index + 1,
        color,
        faceUp: false,
        image: `/cards/card${suit}${value}.png`,
        backImage: backColor
          ? backImages[backColor] || backImages.red
          : backImages[color] || backImages.red,
      };
    })
  );

  return deck;
}

export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }


  return shuffled;
}

