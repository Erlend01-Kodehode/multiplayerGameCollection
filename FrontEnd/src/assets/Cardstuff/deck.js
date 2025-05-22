export function createDeck() {
  const suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  const colorMap = {
    Hearts: "red",
    Diamonds: "red",
    Clubs: "black",
    Spades: "black",
  };

  // Baksidebilder (velg én variant for hver farge)
  const backImages = {
    red: "/cards/cardBack_red1.png",
    black: "/cards/cardBlack_blue1.png",
    green: "/cards/cardBack_green1.png",
  };

  const deck = [];

  suits.forEach((suit) => {
    values.forEach((value, index) => {
      const color = colorMap[suit];
      deck.push({
        id: `${value}${suit}`,
        suit,
        value,
        numericValue: index + 1,
        color,
        faceUp: false,
        image: `/cards/card${suit}${value}.png`,  // forsiden
        backImage: backImages[color] || backImages.red,  // baksiden
      });
    });
  });

  return deck;
}

