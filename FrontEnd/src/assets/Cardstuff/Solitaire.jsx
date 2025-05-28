import { useEffect, useState } from "react";
import { createDeck, shuffleDeck } from "./deck.js";
import "./Solitaire.css";

const Solitaire = () => {
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

  // Starter nytt spill og deler ut kort til bordet og bunken
  const initializeGame = () => {
    const deck = shuffleDeck(createDeck());
    const newTableau = [[], [], [], [], [], [], []];
    let deckIndex = 0;

    // Legger ut kort i bordrader med siste kort opp (synlig)
    for (let pile = 0; pile < 7; pile++) {
      for (let i = 0; i <= pile; i++) {
        const card = { ...deck[deckIndex++] };
        card.faceUp = i === pile;
        newTableau[pile].push(card);
      }
    }

    // Resten av kortene går til bunken (stokkhaugen)
    const remainingCards = deck
      .slice(deckIndex)
      .map((card) => ({ ...card, faceUp: false }));

    setTableau(newTableau);
    setStockPile(remainingCards);
    setWastePile([]);
    setFoundationPiles({ hearts: [], diamonds: [], clubs: [], spades: [] });
    setSelectedCard(null);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Trekker et kort fra bunken til avfallshaugen
  const drawFromStock = () => {
    if (stockPile.length === 0) {
      // Når bunken er tom, snur vi avfallshaugen tilbake til bunken
      const newStock = wastePile.map((card) => ({ ...card, faceUp: false }));
      setStockPile(newStock);
      setWastePile([]);
      return;
    }
    const card = { ...stockPile[0], faceUp: true };
    setWastePile([card, ...wastePile]);
    setStockPile(stockPile.slice(1));
  };

  // Flytter øverste kort fra avfallshaugen til valgt bordrad hvis lovlig
  const moveWasteToTableau = (pileIndex) => {
    if (wastePile.length === 0) return;

    const card = wastePile[0];
    const pile = tableau[pileIndex];
    const topCard = pile.at(-1);

    // Sjekker om kortet kan legges på valgt rad (motsatt farge og én lavere verdi)
    const canPlace =
      (pile.length === 0 && card.value === "K") ||
      (topCard &&
        topCard.faceUp &&
        topCard.color !== card.color && // Motsatt farge
        topCard.numericValue === card.numericValue + 1); // Én høyere verdi

    if (canPlace) {
      const newTableau = tableau.map((p, i) =>
        i === pileIndex ? [...p, card] : p
      );
      setTableau(newTableau);
      setWastePile(wastePile.slice(1));
      setSelectedCard(null);
    }
  };

  // Flytter øverste kort fra avfallshaugen til målhaug hvis mulig
  const moveWasteToFoundation = () => {
    if (wastePile.length === 0) return;

    const card = wastePile[0];
    const suit = card.suit.toLowerCase();
    const currentPile = foundationPiles[suit];
    const topCard = currentPile.at(-1);
    const expectedValue = topCard ? topCard.numericValue + 1 : 1;

    // Sjekker både farge og verdi!
    if (
      card.suit.toLowerCase() === suit &&
      card.numericValue === expectedValue
    ) {
      setFoundationPiles({
        ...foundationPiles,
        [suit]: [...currentPile, card],
      });
      setWastePile(wastePile.slice(1));
      setSelectedCard(null);
    }
  };

  // Flytter øverste kort fra valgt bordrad til målhaug hvis mulig
  const moveTableauToFoundation = (suit) => {
    let foundIndex = -1;
    let card = null;

    for (let i = 0; i < tableau.length; i++) {
      const pile = tableau[i];
      if (pile.length === 0) continue;
      const topCard = pile.at(-1);
      if (topCard.faceUp && topCard.suit.toLowerCase() === suit) {
        foundIndex = i;
        card = topCard;
        break;
      }
    }

    if (foundIndex === -1 || !card) return;

    const foundationPile = foundationPiles[suit];
    const topFoundationCard = foundationPile.at(-1);
    const expectedValue = topFoundationCard
      ? topFoundationCard.numericValue + 1
      : 1;

    // Sjekker både farge og verdi!
    if (
      card.suit.toLowerCase() === suit &&
      card.numericValue === expectedValue
    ) {
      const newTableau = tableau.map((p, i) =>
        i === foundIndex ? p.slice(0, -1) : p
      );

      if (newTableau[foundIndex].length > 0) {
        const lastCard =
          newTableau[foundIndex][newTableau[foundIndex].length - 1];
        if (!lastCard.faceUp) {
          newTableau[foundIndex][newTableau[foundIndex].length - 1] = {
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

  // Flytter øverste kort fra målhaug til valgt bordrad hvis lovlig
  const moveFoundationToTableau = (suit, pileIndex) => {
    const foundationPile = foundationPiles[suit];
    if (foundationPile.length === 0) return;
    const card = foundationPile[foundationPile.length - 1];
    const pile = tableau[pileIndex];
    const topCard = pile.at(-1);

    const canPlace =
      (pile.length === 0 && card.value === "K") ||
      (topCard &&
        topCard.faceUp &&
        topCard.color !== card.color && // Motsatt farge
        topCard.numericValue === card.numericValue + 1); // Én høyere verdi

    if (canPlace) {
      const newFoundationPiles = {
        ...foundationPiles,
        [suit]: foundationPile.slice(0, -1),
      };
      const newTableau = tableau.map((p, i) =>
        i === pileIndex ? [...p, card] : p
      );
      setFoundationPiles(newFoundationPiles);
      setTableau(newTableau);
      setSelectedCard(null);
    }
  };

  // Flytter valgt kort fra bordrad til foundation hvis mulig
  const moveTableauCardToFoundation = (fromIndex, fromCardIndex, suit) => {
    const pile = tableau[fromIndex];
    const card = pile[fromCardIndex];
    if (!card.faceUp) return;

    // Bare tillat flytting av øverste kort i raden
    if (fromCardIndex !== pile.length - 1) return;

    const foundationPile = foundationPiles[suit];
    const topFoundationCard = foundationPile.at(-1);
    const expectedValue = topFoundationCard
      ? topFoundationCard.numericValue + 1
      : 1;

    // Sjekk at kortet har riktig farge og verdi
    if (
      card.suit.toLowerCase() === suit &&
      card.numericValue === expectedValue
    ) {
      // Fjern kortet fra bordraden
      const newTableau = tableau.map((p, i) =>
        i === fromIndex ? p.slice(0, -1) : p
      );

      // Snu siste kort i bordraden hvis nødvendig
      if (newTableau[fromIndex].length > 0) {
        const lastCard =
          newTableau[fromIndex][newTableau[fromIndex].length - 1];
        if (!lastCard.faceUp) {
          newTableau[fromIndex][newTableau[fromIndex].length - 1] = {
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
    }
  };

  // Håndterer klikk på bordet for å flytte flere kort mellom rader eller fra foundation eller waste
  const handleTableauClick = (pileIndex, cardIndex) => {
    const clickedPile = tableau[pileIndex];

    // NYTT: Håndter tom rad for flytting av konge/bunke
    if (clickedPile.length === 0 && selectedCard) {
      const { fromIndex, fromCardIndex } = selectedCard;
      const movingCards = tableau[fromIndex].slice(fromCardIndex);
      if (movingCards[0].value === "K") {
        const newTableau = tableau.map((p, i) => {
          if (i === fromIndex) {
            return p.slice(0, fromCardIndex);
          }
          if (i === pileIndex) {
            return [...p, ...movingCards];
          }
          return p;
        });
        // Snu siste kort i fra-rad hvis nødvendig
        if (newTableau[fromIndex].length > 0) {
          const lastCard =
            newTableau[fromIndex][newTableau[fromIndex].length - 1];
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
      return;
    }

    const card = clickedPile[cardIndex];
    if (!card || !card.faceUp) return;

    // Hvis du har valgt et kort fra foundation, prøv å flytte det hit
    if (selectedCard && selectedCard.fromFoundation) {
      moveFoundationToTableau(selectedCard.suit, pileIndex);
      setSelectedCard(null);
      return;
    }

    // Hvis du har valgt et kort fra waste, prøv å flytte det hit
    if (selectedCard && selectedCard.fromWaste) {
      moveWasteToTableau(pileIndex);
      setSelectedCard(null);
      return;
    }

    if (selectedCard) {
      const { fromIndex, fromCardIndex } = selectedCard;

      // Hvis du klikker på samme kort igjen, fjernes valget
      if (fromIndex === pileIndex && fromCardIndex === cardIndex) {
        setSelectedCard(null);
        return;
      }

      const movingCards = tableau[fromIndex].slice(fromCardIndex);
      const destinationPile = tableau[pileIndex];
      const topCard = destinationPile.at(-1);

      // Dette er kabal-regel: Kun konge eller bunke som starter med konge kan flyttes til tom kolonne
      const canPlace =
        (destinationPile.length === 0 && movingCards[0].value === "K") ||
        (topCard &&
          topCard.faceUp &&
          topCard.color !== movingCards[0].color &&
          topCard.numericValue === movingCards[0].numericValue + 1);

      if (canPlace) {
        const newTableau = tableau.map((p, i) => {
          if (i === fromIndex) {
            return p.slice(0, fromCardIndex);
          }
          if (i === pileIndex) {
            return [...p, ...movingCards];
          }
          return p;
        });

        if (newTableau[fromIndex].length > 0) {
          const lastCard =
            newTableau[fromIndex][newTableau[fromIndex].length - 1];
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
      setSelectedCard({ fromIndex: pileIndex, fromCardIndex: cardIndex });
    }
  };

  // Sjekker om spilleren har fått alle kortene opp på målhaugen
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

      {/* Bunke og avfallshaugen */}
      <div
        className="stock-row"
        style={{ display: "flex", gap: "20px", marginTop: "10px" }}
      >
        <div
          className="stock"
          onClick={drawFromStock}
          style={{ cursor: "pointer" }}
        >
          {stockPile.length > 0 ? (
            <img
              src={stockPile[0].backImage}
              alt="Bunke bakside"
              className="card-image"
            />
          ) : (
            <div
              className="card empty"
              style={{
                width: "72px",
                height: "96px",
                border: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Tom
            </div>
          )}
        </div>

        <div
          className="waste"
          style={{ cursor: wastePile.length > 0 ? "pointer" : "default" }}
        >
          {wastePile.length > 0 && (
            <img
              src={
                wastePile[0].faceUp
                  ? wastePile[0].image
                  : wastePile[0].backImage
              }
              alt={`${wastePile[0].value} of ${wastePile[0].suit}`}
              className="card-image"
              onClick={() => {
                // Velg/fjern waste-kortet
                if (selectedCard && selectedCard.fromWaste) {
                  setSelectedCard(null);
                } else {
                  setSelectedCard({ fromWaste: true });
                }
              }}
              style={{
                border:
                  selectedCard && selectedCard.fromWaste
                    ? "2px solid blue"
                    : "none",
              }}
              title="Klikk for å velge avfallskort"
            />
          )}
        </div>
      </div>

      {/* Målhauger */}
      <div
        className="foundation-row"
        style={{ display: "flex", gap: "20px", marginTop: "20px" }}
      >
        {["hearts", "diamonds", "clubs", "spades"].map((suit) => (
          <div
            className="foundation"
            key={suit}
            onClick={() => {
              if (
                selectedCard &&
                selectedCard.fromIndex !== undefined &&
                selectedCard.fromCardIndex !== undefined
              ) {
                moveTableauCardToFoundation(
                  selectedCard.fromIndex,
                  selectedCard.fromCardIndex,
                  suit
                );
                setSelectedCard(null);
              } else if (selectedCard && selectedCard.fromWaste) {
                moveWasteToFoundation();
                setSelectedCard(null);
              } else {
                moveTableauToFoundation(suit);
              }
            }}
            style={{
              width: "72px",
              height: "96px",
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {foundationPiles[suit].length > 0 ? (
              <img
                src={foundationPiles[suit].at(-1).image}
                alt={`${foundationPiles[suit].at(-1).value} of ${suit}`}
                className="card-image"
                style={{
                  border:
                    selectedCard &&
                    selectedCard.fromFoundation &&
                    selectedCard.suit === suit
                      ? "2px solid blue"
                      : "none",
                }}
              />
            ) : (
              <div
                className="card empty"
                style={{
                  fontSize: "2rem",
                  color: "#999",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                A
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bordrader */}
      <div
        className="tableau-row"
        style={{ display: "flex", gap: "10px", marginTop: "20px" }}
      >
        {tableau.map((pile, pileIndex) => (
          <div
            key={pileIndex}
            className="tableau-pile"
            onClick={() => {
              if (selectedCard && selectedCard.fromWaste) {
                moveWasteToTableau(pileIndex);
                setSelectedCard(null);
                return;
              }
              if (selectedCard && selectedCard.fromFoundation) {
                moveFoundationToTableau(selectedCard.suit, pileIndex);
                setSelectedCard(null);
                return;
              }
              // NYTT: Flytt valgt tableau-bunke til denne raden hvis valgt
              if (
                selectedCard &&
                selectedCard.fromIndex !== undefined &&
                selectedCard.fromCardIndex !== undefined
              ) {
                handleTableauClick(pileIndex, 0);
                return;
              }
            }}
            style={{
              width: "72px",
              minHeight: "96px",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {pile.map((card, cardIndex) => (
              <img
                key={cardIndex}
                src={card.faceUp ? card.image : card.backImage}
                alt={
                  card.faceUp ? `${card.value} of ${card.suit}` : "Kort bakside"
                }
                className={`card-image ${
                  selectedCard &&
                  selectedCard.fromIndex === pileIndex &&
                  selectedCard.fromCardIndex === cardIndex
                    ? "selected"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTableauClick(pileIndex, cardIndex);
                }}
                style={{
                  position: "absolute",
                  top: cardIndex * 20,
                  left: 0,
                  width: "72px",
                  height: "96px",
                  userSelect: "none",
                  border:
                    selectedCard &&
                    selectedCard.fromIndex === pileIndex &&
                    selectedCard.fromCardIndex === cardIndex
                      ? "2px solid blue"
                      : "none",
                  boxSizing: "border-box",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Vinnermelding */}
      {checkWin() && (
        <div
          className="win-message"
          style={{ marginTop: "20px", fontSize: "1.5rem", color: "green" }}
        >
          Gratulerer Ta på gress :D!
        </div>
      )}
    </div>
  );
};

export default Solitaire;





