// src/components/SolitaireGame.jsx
import { useEffect, useState } from "react";
import { createDeck, shuffleDeck } from "../assets/deck";

const SolitaireGame = () => {
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
  }, []);

  return (
    <div>
      <h2>Solitaire</h2>
      <p>Antall kort: {deck.length}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {deck.map((card) => (
          <div key={card.id} style={{ width: "50px", height: "70px", border: "1px solid #000", textAlign: "center", lineHeight: "70px" }}>
            {card.faceUp ? `${card.value} ${card.suit[0]}` : "🂠"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolitaireGame;
