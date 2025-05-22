// Cardstuff/deck.js

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck() {
  const deck = [];

  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({
        id: `${suit}-${value}`,   // unik ID
        suit: suit,
        value: value,
        color: suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black',
        faceUp: false             // standard: kortet er skjult
      });
    });
  });

  return deck;
}

// Enkel shuffle-funksjon (Durstenfeld/Fisher-Yates)
export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
