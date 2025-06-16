import { useEffect, useState } from "react";
import { createDeck, shuffleDeck } from "./deck.js";
import "./Solitaire.css";
import Navbar from "./Navbar.jsx";
import { Flipper, Flipped } from "react-flip-toolkit";

const Solitaire = () => {
  const [foundationPiles, setFoundationPiles] = useState([[], [], [], []]);
  const [tableau, setTableau] = useState([[], [], [], [], [], [], []]);
  const [stockPile, setStockPile] = useState([]);
  const [wastePile, setWastePile] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [wasteAnimate, setWasteAnimate] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [history, setHistory] = useState([]);
  const [winSlide, setWinSlide] = useState(false);
  const [hideCards, setHideCards] = useState(false);
  const [playerHistory, setPlayerHistory] = useState([]);
  const [autoCompleting, setAutoCompleting] = useState(false);
  const [slidingCard, setSlidingCard] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [matchHistory, setMatchHistory] = useState([]);
  const [matchSaved, setMatchSaved] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Lagre spillerens trekk (kun etter manuell handling)
  const savePlayerHistory = () => {
    const snapshot = {
      tableau: JSON.parse(JSON.stringify(tableau)),
      foundationPiles: JSON.parse(JSON.stringify(foundationPiles)),
      stockPile: JSON.parse(JSON.stringify(stockPile)),
      wastePile: JSON.parse(JSON.stringify(wastePile)),
    };
    setPlayerHistory((prev) => [...prev, snapshot]);
    setHistory((prev) => [...prev, snapshot]);
  };

  // Starter nytt spill og deler ut kort til bordet og bunken
  const initializeGame = () => {
    const deck = shuffleDeck(createDeck()).map((card, idx) => ({
      ...card,
      id: `${card.value}${card.suit[0]}-${idx}`,
    }));
    const newTableau = [[], [], [], [], [], [], []];
    let deckIndex = 0;

    for (let pile = 0; pile < 7; pile++) {
      for (let i = 0; i <= pile; i++) {
        const card = { ...deck[deckIndex++] };
        card.faceUp = i === pile;
        newTableau[pile].push(card);
      }
    }

    const remainingCards = deck
      .slice(deckIndex)
      .map((card) => ({ ...card, faceUp: false }));

    setTableau(newTableau);
    setStockPile(remainingCards);
    setWastePile([]);
    setFoundationPiles([[], [], [], []]);
    setSelectedCard(null);
    setShowWinAnimation(false);
    setWinSlide(false);
    setHideCards(false);
    setPlayerHistory([]);
    setHistory([]);
    setAutoCompleting(false);
    setSlidingCard(null);
    setMoveCount(0);
    setMatchSaved(false); // Reset når nytt spill starter!
  };

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line
  }, []);

  // Lagre match til historikk kun én gang per seier
  useEffect(() => {
    if (showWinAnimation && !matchSaved) {
      setMatchHistory((prev) => [
        ...prev,
        {
          moves: moveCount,
          score: Math.max(0, 500 - moveCount),
          date: new Date().toLocaleString(),
        },
      ]);
      setMatchSaved(true);
    }
    // Ikke reset matchSaved her! Det gjøres når du lukker win-popup eller starter nytt spill
    // eslint-disable-next-line
  }, [showWinAnimation]);

  // Trekker et kort fra bunken til avfallshaugen
  const drawFromStock = () => {
    if (winSlide || hideCards) return;
    if (stockPile.length === 0) {
      const newStock = wastePile.map((card) => ({ ...card, faceUp: false }));
      setStockPile(newStock);
      setWastePile([]);
      savePlayerHistory();
      return;
    }
    const card = { ...stockPile[0], faceUp: true };
    setWastePile([card, ...wastePile]);
    setStockPile(stockPile.slice(1));
    setWasteAnimate(true);
    setMoveCount((c) => c + 1);
    savePlayerHistory();
  };

  // Flytt fra waste til tableau
  const moveWasteToTableau = (pileIndex) => {
    if (winSlide || hideCards) return;
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
      const newTableau = tableau.map((p, i) =>
        i === pileIndex ? [...p, card] : p
      );
      setTableau(newTableau);
      setWastePile(wastePile.slice(1));
      setSelectedCard(null);
      setMoveCount((c) => c + 1);
      savePlayerHistory();
    }
  };

  // Flytt fra waste til foundation
  const moveWasteToFoundation = (foundationIndex) => {
    if (winSlide || hideCards) return;
    if (wastePile.length === 0) return;
    const card = wastePile[0];
    const foundationPile = foundationPiles[foundationIndex];
    if (foundationPile.length === 0) {
      if (card.value === "A") {
        setFoundationPiles(
          foundationPiles.map((fp, idx) =>
            idx === foundationIndex ? [card] : fp
          )
        );
        setWastePile(wastePile.slice(1));
        setSelectedCard(null);
        setMoveCount((c) => c + 1);
        savePlayerHistory();
      }
      return;
    }
    const topCard = foundationPile.at(-1);
    const expectedValue = topCard ? topCard.numericValue + 1 : 1;
    if (card.suit === topCard.suit && card.numericValue === expectedValue) {
      setFoundationPiles(
        foundationPiles.map((fp, idx) =>
          idx === foundationIndex ? [...fp, card] : fp
        )
      );
      setWastePile(wastePile.slice(1));
      setSelectedCard(null);
      setMoveCount((c) => c + 1);
      savePlayerHistory();
    }
  };

  // Flytt fra tableau til foundation MED animasjon
  const moveTableauCardToFoundationWithAnimation = (
    fromIndex,
    fromCardIndex,
    foundationIndex
  ) => {
    if (winSlide || hideCards) return;
    const pile = tableau[fromIndex];
    const card = pile[fromCardIndex];
    if (!card.faceUp) return;
    if (fromCardIndex !== pile.length - 1) return;

    setSlidingCard({ ...card, fromIndex, fromCardIndex, foundationIndex });

    setTimeout(() => {
      const newTableau = tableau.map((p, i) =>
        i === fromIndex ? p.slice(0, -1) : p
      );
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
      setFoundationPiles(
        foundationPiles.map((fp, idx) =>
          idx === foundationIndex ? [...fp, card] : fp
        )
      );
      setSlidingCard(null);
      setSelectedCard(null);
      savePlayerHistory();
    }, 350);
  };

  // Flytt fra tableau til foundation (uten animasjon, brukes kun manuelt)
  const moveTableauCardToFoundation = (
    fromIndex,
    fromCardIndex,
    foundationIndex
  ) => {
    if (winSlide || hideCards) return;
    const pile = tableau[fromIndex];
    const card = pile[fromCardIndex];
    if (!card.faceUp) return;
    if (fromCardIndex !== pile.length - 1) return;

    const foundationPile = foundationPiles[foundationIndex];
    if (foundationPile.length === 0) {
      if (card.value === "A") {
        const newTableau = tableau.map((p, i) =>
          i === fromIndex ? p.slice(0, -1) : p
        );
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
        setFoundationPiles(
          foundationPiles.map((fp, idx) =>
            idx === foundationIndex ? [card] : fp
          )
        );
        setSelectedCard(null);
        setMoveCount((c) => c + 1);
        savePlayerHistory();
      }
      return;
    }
    const topFoundationCard = foundationPile.at(-1);
    const expectedValue = topFoundationCard
      ? topFoundationCard.numericValue + 1
      : 1;
    if (
      card.suit === topFoundationCard.suit &&
      card.numericValue === expectedValue
    ) {
      const newTableau = tableau.map((p, i) =>
        i === fromIndex ? p.slice(0, -1) : p
      );
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
      setFoundationPiles(
        foundationPiles.map((fp, idx) =>
          idx === foundationIndex ? [...fp, card] : fp
        )
      );
      setSelectedCard(null);
      setMoveCount((c) => c + 1);
      savePlayerHistory();
    }
  };

  // Flytt fra foundation til tableau
  const moveFoundationToTableau = (foundationIndex, pileIndex) => {
    if (winSlide || hideCards) return;
    const foundationPile = foundationPiles[foundationIndex];
    if (foundationPile.length === 0) return;
    const card = foundationPile[foundationPile.length - 1]; // <-- Rettet her!
    const pile = tableau[pileIndex];
    const topCard = pile.at(-1);

    const canPlace =
      (pile.length === 0 && card.value === "K") ||
      (topCard &&
        topCard.faceUp &&
        topCard.color !== card.color &&
        topCard.numericValue === card.numericValue + 1);

    if (canPlace) {
      const newFoundationPiles = foundationPiles.map((fp, idx) =>
        idx === foundationIndex ? fp.slice(0, -1) : fp
      );
      const newTableau = tableau.map((p, i) =>
        i === pileIndex ? [...p, card] : p
      );
      setFoundationPiles(newFoundationPiles);
      setTableau(newTableau);
      setSelectedCard(null);
      savePlayerHistory();
    }
  };

  // Tableau flytt (også tableau → tableau)
  const handleTableauClick = (pileIndex, cardIndex) => {
    if (winSlide || hideCards) return;
    const clickedPile = tableau[pileIndex];

    if (
      clickedPile.length === 0 &&
      selectedCard &&
      selectedCard.fromIndex !== undefined &&
      selectedCard.fromCardIndex !== undefined
    ) {
      const { fromIndex, fromCardIndex } = selectedCard;
      const movingCards = tableau[fromIndex].slice(fromCardIndex);
      if (movingCards.length > 0 && movingCards[0].value === "K") {
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
        savePlayerHistory();
      }
      setSelectedCard(null);
      return;
    }

    if (selectedCard && selectedCard.fromFoundation) {
      moveFoundationToTableau(selectedCard.foundationIndex, pileIndex);
      setSelectedCard(null);
      return;
    }

    if (selectedCard && selectedCard.fromWaste) {
      moveWasteToTableau(pileIndex);
      setSelectedCard(null);
      return;
    }

    if (
      selectedCard &&
      selectedCard.fromIndex !== undefined &&
      selectedCard.fromCardIndex !== undefined
    ) {
      const { fromIndex, fromCardIndex } = selectedCard;
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
        savePlayerHistory();
      }

      setSelectedCard(null);
    } else if (clickedPile.length > 0) {
      const card = clickedPile[cardIndex];
      if (!card || !card.faceUp) return;
      setSelectedCard({ fromIndex: pileIndex, fromCardIndex: cardIndex });
    }
  };

  // Sjekk om auto-complete skal starte (automatisk)
  useEffect(() => {
    const allFaceUp = tableau.every((pile) =>
      pile.every((card) => card.faceUp)
    );
    const noStock = stockPile.length === 0 && wastePile.length === 0;
    const atLeastOneInFoundation = foundationPiles.some(
      (pile) => pile.length > 0
    );
    const notAlreadyWon = foundationPiles.some((pile) => pile.length < 13);

    if (
      allFaceUp &&
      noStock &&
      atLeastOneInFoundation &&
      notAlreadyWon &&
      !autoCompleting &&
      !winSlide &&
      !hideCards &&
      !slidingCard
    ) {
      setAutoCompleting(true);
    }
    // eslint-disable-next-line
  }, [
    tableau,
    stockPile,
    wastePile,
    foundationPiles,
    autoCompleting,
    winSlide,
    hideCards,
    slidingCard,
  ]);

  // Automatisk fullføring av trekk (flytt ett kort per kall, med animasjon)
  useEffect(() => {
    if (autoCompleting && !slidingCard && !winSlide && !hideCards) {
      let timeoutId;
      const suitOrder = { hearts: 0, diamonds: 1, clubs: 2, spades: 3 };
      let found = false;

      // Sjekk tableau
      for (let i = 0; i < tableau.length; i++) {
        const pile = tableau[i];
        if (pile.length === 0) continue;
        const card = pile[pile.length - 1];
        if (!card.faceUp) continue;
        const idx = suitOrder[card.suit];
        if (typeof idx !== "number") continue;
        const foundationPile = foundationPiles[idx];
        if (!foundationPile) continue;
        const expectedValue =
          foundationPile.length === 0
            ? 1
            : foundationPile[foundationPile.length - 1].numericValue + 1;
        if (card.numericValue === expectedValue) {
          moveTableauCardToFoundationWithAnimation(i, pile.length - 1, idx);
          found = true;
          break;
        }
      }

      // Sjekk waste
      if (!found && wastePile.length > 0) {
        const card = wastePile[0];
        const idx = suitOrder[card.suit];
        if (typeof idx !== "number") return;
        const foundationPile = foundationPiles[idx];
        if (!foundationPile) return;
        const expectedValue =
          foundationPile.length === 0
            ? 1
            : foundationPile[foundationPile.length - 1].numericValue + 1;
        if (card.numericValue === expectedValue) {
          setSlidingCard({ ...card, fromWaste: true, foundationIndex: idx });
          timeoutId = setTimeout(() => {
            setWastePile(wastePile.slice(1));
            setFoundationPiles(
              foundationPiles.map((fp, j) =>
                j === idx ? [...fp, { ...card, faceUp: true }] : fp
              )
            );
            setSlidingCard(null);
          }, 350);
          found = true;
        }
      }

      // Hvis ingen flere trekk, sjekk om du faktisk har vunnet
      if (!found) {
        if (foundationPiles.every((pile) => pile.length === 13)) {
          setWinSlide(true);
          timeoutId = setTimeout(() => {
            setHideCards(true);
            setWinSlide(false);
          }, 1700);
          setAutoCompleting(false);
          setShowWinAnimation(true);
        } else {
          setAutoCompleting(false);
        }
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
    // eslint-disable-next-line
  }, [autoCompleting, slidingCard, winSlide, hideCards]);

  useEffect(() => {
    if (wasteAnimate) {
      const timeout = setTimeout(() => setWasteAnimate(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [wasteAnimate]);

  const flipKey =
    JSON.stringify(tableau) +
    JSON.stringify(wastePile) +
    JSON.stringify(foundationPiles);

  // Sjekker om du har vunnet (alle foundation har 13 kort)
  const checkWin = () => {
    return foundationPiles.every((pile) => pile.length === 13);
  };

  const rerollToWinnable = () => {
    for (let i = history.length - 1; i >= 0; i--) {
      if (isWinnable(history[i])) {
        setTableau(history[i].tableau);
        setFoundationPiles(history[i].foundationPiles);
        setStockPile(history[i].stockPile);
        setWastePile(history[i].wastePile);
        setSelectedCard(null);
        break;
      }
    }
  };

  // Rollback-funksjoner:
  const goBackPlayerMoves = (moves = 1) => {
    if (playerHistory.length <= moves) return;
    const state = playerHistory[playerHistory.length - 1 - moves];
    setTableau(state.tableau);
    setFoundationPiles(state.foundationPiles);
    setStockPile(state.stockPile);
    setWastePile(state.wastePile);
    setSelectedCard(null);
    setPlayerHistory(playerHistory.slice(0, playerHistory.length - moves));
  };

  // Blokker input under animasjon
  const blockInput = winSlide || hideCards || slidingCard;

  return (
    <div className="solitaire-game">
      <Navbar
        onBackOne={() => goBackPlayerMoves(1)}
        onBackThree={() => goBackPlayerMoves(3)}
        onReroll={rerollToWinnable}
        moveCount={moveCount}
        onShowHistory={() => setShowLeaderboard(true)}
      />
      <Flipper flipKey={flipKey} spring="gentle">
        {/* Bunke og avfallshaugen */}
        <div className="stock-row">
          <div
            className="stock"
            onClick={blockInput ? undefined : drawFromStock}
            style={{ cursor: blockInput ? "default" : "pointer" }}
          >
            {stockPile.length > 0 ? (
              <img
                src={stockPile[0].backImage}
                alt="Bunke bakside"
                className="card-image"
                style={{
                  visibility: hideCards ? "hidden" : "visible",
                }}
              />
            ) : (
              <div className="card empty">Cardz</div>
            )}
          </div>

          <div
            className="waste"
            style={{
              cursor:
                wastePile.length > 0 && !blockInput ? "pointer" : "default",
            }}
          >
            {wastePile.length > 0 && (
              <Flipped flipId={wastePile[0].id}>
                <img
                  src={
                    wastePile[0].faceUp
                      ? wastePile[0].image
                      : wastePile[0].backImage
                  }
                  alt={`${wastePile[0].value} of ${wastePile[0].suit}`}
                  className={`card-image${wasteAnimate ? " waste-flip" : ""}${
                    slidingCard &&
                    slidingCard.fromWaste &&
                    slidingCard.id === wastePile[0].id &&
                    winSlide
                      ? " win-slide"
                      : ""
                  }`}
                  onClick={
                    blockInput
                      ? undefined
                      : () => {
                          if (selectedCard && selectedCard.fromWaste) {
                            setSelectedCard(null);
                          } else {
                            setSelectedCard({ fromWaste: true });
                          }
                        }
                  }
                  style={{
                    border:
                      selectedCard && selectedCard.fromWaste
                        ? "2px solid blue"
                        : "none",
                    visibility: hideCards ? "hidden" : "visible",
                  }}
                  title="Klikk for å velge avfallskort"
                />
              </Flipped>
            )}
          </div>
        </div>

        {/* Målhauger */}
        <div className="foundation-row">
          {foundationPiles.map((pile, foundationIndex) => (
            <div
              className="foundation"
              key={foundationIndex}
              onClick={
                blockInput
                  ? undefined
                  : () => {
                      if (
                        selectedCard &&
                        selectedCard.fromIndex !== undefined &&
                        selectedCard.fromCardIndex !== undefined
                      ) {
                        moveTableauCardToFoundation(
                          selectedCard.fromIndex,
                          selectedCard.fromCardIndex,
                          foundationIndex
                        );
                        setSelectedCard(null);
                      } else if (selectedCard && selectedCard.fromWaste) {
                        moveWasteToFoundation(foundationIndex);
                        setSelectedCard(null);
                      } else if (pile.length > 0) {
                        setSelectedCard({
                          fromFoundation: true,
                          foundationIndex,
                        });
                      }
                    }
              }
              style={{
                cursor: blockInput ? "default" : "pointer",
                position: "relative",
              }}
            >
              {pile.length > 0 ? (
                pile.map((card, idx) => (
                  <Flipped key={card.id} flipId={card.id}>
                    <img
                      src={card.image}
                      alt={`${card.value} of ${card.suit}`}
                      className="card-image"
                      style={{
                        border:
                          selectedCard &&
                          selectedCard.fromFoundation &&
                          selectedCard.foundationIndex === foundationIndex &&
                          idx === pile.length - 1
                            ? "2px solid blue"
                            : "none",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        zIndex: idx,
                        visibility: hideCards ? "hidden" : "visible",
                      }}
                    />
                  </Flipped>
                ))
              ) : (
                <div className="card empty">A</div>
              )}
            </div>
          ))}
        </div>

        {/* Bordrader */}
        <div className="tableau-row">
          {tableau.map((pile, pileIndex) => (
            <div
              key={pileIndex}
              className="tableau-pile"
              style={{
                cursor: blockInput ? "default" : "pointer",
                position: "relative",
              }}
              onClick={
                blockInput
                  ? undefined
                  : () => {
                      if (
                        pile.length === 0 &&
                        selectedCard &&
                        selectedCard.fromIndex !== undefined &&
                        selectedCard.fromCardIndex !== undefined
                      ) {
                        handleTableauClick(pileIndex, 0);
                        return;
                      }

                      if (pile.length === 0) {
                        if (selectedCard && selectedCard.fromWaste) {
                          moveWasteToTableau(pileIndex);
                          setSelectedCard(null);
                          return;
                        }
                        if (
                          selectedCard &&
                          selectedCard.fromIndex !== undefined &&
                          selectedCard.fromCardIndex !== undefined
                        ) {
                          handleTableauClick(pileIndex, 0);
                          return;
                        }
                      }
                    }
              }
            >
              {pile.map((card, cardIndex) => (
                <Flipped key={card.id} flipId={card.id}>
                  <img
                    src={card.faceUp ? card.image : card.backImage}
                    alt={
                      card.faceUp
                        ? `${card.value} of ${card.suit}`
                        : "Kort bakside"
                    }
                    className={`card-image${
                      selectedCard &&
                      selectedCard.fromIndex === pileIndex &&
                      selectedCard.fromCardIndex === cardIndex
                        ? " selected"
                        : ""
                    }${
                      slidingCard &&
                      slidingCard.fromIndex === pileIndex &&
                      slidingCard.fromCardIndex === cardIndex &&
                      winSlide
                        ? " win-slide"
                        : ""
                    }`}
                    onClick={
                      blockInput
                        ? undefined
                        : (e) => {
                            e.stopPropagation();
                            handleTableauClick(pileIndex, cardIndex);
                          }
                    }
                    style={{
                      position: "absolute",
                      top: cardIndex * 40,
                      left: 0,
                      userSelect: "none",
                      border:
                        selectedCard &&
                        selectedCard.fromIndex === pileIndex &&
                        selectedCard.fromCardIndex === cardIndex
                          ? "2px solid blue"
                          : "none",
                      boxSizing: "border-box",
                      zIndex: cardIndex,
                      visibility: hideCards ? "hidden" : "visible",
                    }}
                  />
                </Flipped>
              ))}
            </div>
          ))}
        </div>
      </Flipper>
      {(winSlide || hideCards) && <div className="win-overlay"></div>}
      {showWinAnimation && (
        <div className="win-popup">
          <h2>Gratulerer, du vant!</h2>
          <p>Antall trekk: {moveCount}</p>
          <p>Score: {Math.max(0, 500 - moveCount)}</p>
          <button
            onClick={() => {
              setShowWinAnimation(false);
              setMatchSaved(false); // Reset når du lukker win-popup!
            }}
          >
            Lukk
          </button>
          <h4>Match History</h4>
          <ul>
            {matchHistory.map((match, i) => (
              <li key={i}>
                Moves: {match.moves} | Score: {match.score} | {match.date}
              </li>
            ))}
          </ul>
        </div>
      )}
      {showLeaderboard && (
        <div className="win-popup">
          <h2>Leaderboard</h2>
          <button onClick={() => setShowLeaderboard(false)}>Lukk</button>
          <ul>
            {matchHistory.length === 0 && <li>Ingen matcher spilt ennå.</li>}
            {matchHistory.map((match, i) => (
              <li key={i}>
                Moves: {match.moves} | Score: {match.score} | {match.date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

function isWinnable(state) {
  for (let i = 0; i < state.tableau.length; i++) {
    const pile = state.tableau[i];
    if (pile.length === 0) continue;
    const card = pile[pile.length - 1];
    for (let f = 0; f < 4; f++) {
      const foundation = state.foundationPiles[f];
      if (foundation.length === 0 && card.value === "A") return true;
      if (
        foundation.length > 0 &&
        card.suit === foundation.at(-1).suit &&
        card.numericValue === foundation.at(-1).numericValue + 1
      )
        return true;
    }
  }
  if (state.wastePile.length > 0) {
    const card = state.wastePile[0];
    for (let f = 0; f < 4; f++) {
      const foundation = state.foundationPiles[f];
      if (foundation.length === 0 && card.value === "A") return true;
      if (
        foundation.length > 0 &&
        card.suit === foundation.at(-1).suit &&
        card.numericValue === foundation.at(-1).numericValue + 1
      )
        return true;
    }
  }
  return false;
}

export default Solitaire;
