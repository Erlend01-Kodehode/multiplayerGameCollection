const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['A', '2', '3','4','5','6','7','8','9','10','J','Q','K',]

function createDeck () {
    const deck = [];
    suits.forEach((suit) => {
        values.forEach((value) => {
            deck.push({
                suit,
                value,
                color: suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black',
                faceUp: false,
                id: `${suit}-${value}`
            });
        });
    });

    return deck;

}