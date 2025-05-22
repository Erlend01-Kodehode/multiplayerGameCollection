import { useEffect, useState } from "react";
import { createDeck, shuffleDeck } from "../assets/deck";
import "./SolitaireGame.css";

const BACK_IMAGE = "/cards/cardBack_red1.png";

const SolitaireGame = () => {
  const [foundationPiles, setFoundationPiles] = useState({
    hearts: [],
    diamonds: [],
    clubs: [],
    spades: [],
  });

  const [tableau, setTableau] = useState([[], [], [], [], [], [], []]);
  const [stockPile, setStockPile] = useState([]);
  const [wastePile, setWastePile] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  // Initialiser spill
  const initializeGame = () => {
    const deck = shuffleDeck(createDeck());
    const newTableau = [[], [], [], [], [], [], []];
    let deckIndex = 0;

    for (let pile = 0; pile < 7; pile++) {
      for (let i = 0; i <= pile; i++) {
        const card = { ...deck[deckIndex++] };
        card.faceUp = i === pile;
        newTableau[pile].push(card);
      }
    }

    const remainingCards = deck.slice(deckIndex).map(card => ({ ...card, faceUp: false }));

    setTableau(newTableau);
    setStockPile(remainingCards);
    setWastePile([]);
    setFoundationPiles({ hearts: [], diamonds: [], clubs: [], spades: [] });
    setSelectedCard(null);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const drawFromStock = () => {
    if (stockPile.length === 0) {
      // Reshuffle waste back into stock
      const newStock = wastePile.map(card => ({ ...card, faceUp: false }));
      setStockPile(newStock);
      setWastePile([]);
      return;
    }
    const card = { ...stockPile[0], faceUp: true };
    setWastePile([card, ...wastePile]);
    setStockPile(stockPile.slice(1));
  };

  // Flytt waste-kort til valgt tableau pile
  const moveWasteToTableau = (pileIndex) => {
    if (wastePile.length === 0) return;

    const card = wastePile[0];
    const pile = tableau[pileIndex];
    const topCard = pile.at(-1);

    const canPlace =
      (pile.length === 0 && card.value === "K") ||
      (topCard &&
        topCard.faceUp &&
        topCard.color !== card.color &&
        topCard.numericValue === card.numericValue + 1);

    if (canPlace) {
      const newTableau = tableau.map((p, i) => (i === pileIndex ? [...p, card] : p));
      setTableau(newTableau);
      setWastePile(wastePile.slice(1));
      setSelectedCard(null);
    }
  };

  // Flytt waste-kort til foundation hvis mulig
  const moveWasteToFoundation = () => {
    if (wastePile.length === 0) return;

    const card = wastePile[0];
    const suit = card.suit.toLowerCase();
    const currentPile = foundationPiles[suit];
    const topCard = currentPile.at(-1);
    const expectedValue = topCard ? topCard.numericValue + 1 : 1;

    if (card.numericValue === expectedValue) {
      setFoundationPiles({
        ...foundationPiles,
        [suit]: [...currentPile, card],
      });
      setWastePile(wastePile.slice(1));
      setSelectedCard(null);
    }
  };

  // Flytt tableau kort til foundation hvis mulig
  const moveTableauToFoundation = (pileIndex) => {
    const pile = tableau[pileIndex];
    if (pile.length === 0) return;
    const card = pile.at(-1);
    if (!card.faceUp) return;

    const suit = card.suit.toLowerCase();
    const foundationPile = foundationPiles[suit];
    const topCard = foundationPile.at(-1);
    const expectedValue = topCard ? topCard.numericValue + 1 : 1;

    if (card.numericValue === expectedValue) {
      // Fjern kort fra tableau
      const newTableau = tableau.map((p, i) =>
        i === pileIndex ? p.slice(0, -1) : p
      );

      // Snu siste kort i tableau hvis nedvendt
      if (newTableau[pileIndex].length > 0) {
        const lastCard = newTableau[pileIndex][newTableau[pileIndex].length - 1];
        if (!lastCard.faceUp) {
          newTableau[pileIndex][newTableau[pileIndex].length - 1] = {
            ...lastCard,
            faceUp: true,
          };
        }
      }

      setTableau(newTableau);
      setFoundationPiles({
        ...foundationPiles,
        [suit]: [...foundationPile, card],
      });
      setSelectedCard(null);
    }
  };

  // Håndtering av klikk på tableau-kort for flytting av flere kort
  const handleTableauClick = (pileIndex, cardIndex) => {
    const clickedPile = tableau[pileIndex];
    const card = clickedPile[cardIndex];
    if (!card.faceUp) return;

    if (selectedCard) {
      const { fromIndex, fromCardIndex } = selectedCard;

      // Klikket på samme kort for å avvelge
      if (fromIndex === pileIndex && fromCardIndex === cardIndex) {
        setSelectedCard(null);
        return;
      }

      const movingCards = tableau[fromIndex].slice(fromCardIndex);
      const destinationPile = tableau[pileIndex];
      const topCard = destinationPile.at(-1);

      const canPlace =
        (destinationPile.length === 0 && movingCards[0].value === "K") ||
        (topCard &&
          topCard.faceUp &&
          topCard.color !== movingCards[0].color &&
          topCard.numericValue === movingCards[0].numericValue + 1);

      if (canPlace) {
        const newTableau = tableau.map((p, i) => {
          if (i === fromIndex) {
            // Fjern kortene som flyttes
            return p.slice(0, fromCardIndex);
          }
          if (i === pileIndex) {
            // Legg til flyttede kort
            return [...p, ...movingCards];
          }
          return p;
        });

        // Snu siste kort i from-pile hvis nødvendig
        if (newTableau[fromIndex].length > 0) {
          const lastCard = newTableau[fromIndex][newTableau[fromIndex].length - 1];
          if (!lastCard.faceUp) {
            newTableau[fromIndex][newTableau[fromIndex].length - 1] = {
              ...lastCard,
              faceUp: true,
            };
          }
        }

        setTableau(newTableau);
      }

      setSelectedCard(null);
    } else {
      // Velg kort (flere kort kan flyttes)
      setSelectedCard({ fromIndex: pileIndex, fromCardIndex: cardIndex });
    }
  };

  // Sjekk om alle kort er i foundation = vunnet
  const checkWin = () => {
    return (
      foundationPiles.hearts.length === 13 &&
      foundationPiles.diamonds.length === 13 &&
      foundationPiles.clubs.length === 13 &&
      foundationPiles.spades.length === 13
    );
  };

  return (
    <div className="solitaire-game">
      <h2>Solitaire</h2>

      <button onClick={initializeGame}>Restart Game</button>

      {/* Stock og Waste */}
      <div className="stock-row">
        <div className="stock" onClick={drawFromStock}>
          {stockPile.length > 0 ? (
            <img src={BACK_IMAGE} alt="Stock Back" className="card-image" />
          ) : (
            <div className="card empty">Tom</div>
          )}
        </div>

        <div className="waste">
          {wastePile.length > 0 && (
            <img
              src={wastePile[0].faceUp ? wastePile[0].image : BACK_IMAGE}
              alt={`${wastePile[0].value} of ${wastePile[0].suit}`}
              className="card-image"
              onClick={moveWasteToFoundation}
              title="Klikk for å flytte til foundation"
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      </div>

      {/* Foundation Piles */}
      <div className="foundation-row">
        {["hearts", "diamonds", "clubs", "spades"].map((suit) => (
          <div
            className="foundation"
            key={suit}
            onClick={() => moveTableauToFoundation(suit)} // Dette kan også bli utvidet til å flytte waste, men har nå bare tableau
          >
            {foundationPiles[suit].length > 0 ? (
              <img
                src={foundationPiles[suit].at(-1).image}
                alt={`${foundationPiles[suit].at(-1).value} of ${suit}`}
                className="card-image"
              />
            ) : (
              <div className="card empty">{suit.charAt(0).toUpperCase()}</div>
            )}
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="tableau-row">
        {tableau.map((pile, pileIndex) => (
          <div key={pileIndex} className="tableau-pile" onClick={() => moveWasteToTableau(pileIndex)}>
            {pile.map((card, cardIndex) => (
              <img
                key={cardIndex}
                src={card.faceUp ? card.image : BACK_IMAGE}
                alt={`${card.value} of ${card.suit}`}
                className={`card-image ${
                  selectedCard &&
                  selectedCard.fromIndex === pileIndex &&
                  selectedCard.fromCardIndex <= cardIndex
                    ? "selected"
                    : ""
                }`}
                style={{ marginTop: cardIndex === 0 ? 0 : -60, cursor: card.faceUp ? "pointer" : "default" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTableauClick(pileIndex, cardIndex);
                }}
              />
            ))}
            {pile.length === 0 && <div className="card empty">Tom</div>}
          </div>
        ))}
      </div>

      {checkWin() && <h3>Gratulerer! Du har vunnet!</h3>}
    </div>
  );
};

export default SolitaireGame;





