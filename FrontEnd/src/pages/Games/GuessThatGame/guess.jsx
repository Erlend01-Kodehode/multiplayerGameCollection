import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { audioFiles } from "../../../assets/SourceLibrary.jsx";

import "./guess.css";

export default function GuessPokemon() {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [highScore, setHighScore] = useState(
    localStorage.getItem("highScore") || 0
  );
  const [pokemon, setPokemon] = useState(null);
  const [guess, setGuess] = useState("");

  const [enabledGens, setEnabledGens] = useState({
    gen1: false,
    gen2: false,
    gen3: false,
    gen4: false,
    gen5: false,
    gen6: false,
    gen7: false,
    gen8: false,
    gen9: false,
  });

  const genRanges = {
    gen1: [1, 151],
    gen2: [152, 251],
    gen3: [252, 386],
    gen4: [387, 493],
    gen5: [494, 649],
    gen6: [650, 721],
    gen7: [722, 809],
    gen8: [810, 905],
    gen9: [906, 1025],
  };

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    setScore(0);
    setHealth(3);
    fetchPokemon();
  };

  const fetchPokemon = async () => {
    try {
      let activeGens = Object.entries(enabledGens).filter(([_, val]) => val);

      if (activeGens.length === 0) {
        activeGens = Object.entries(genRanges);
      }

      const enabledRanges = activeGens.map(([gen]) => genRanges[gen]);

      const validIds = enabledRanges.flatMap(([start, end]) =>
        Array.from({ length: end - start + 1 }, (_, i) => start + i)
      );

      const id = validIds[Math.floor(Math.random() * validIds.length)];
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();
      setPokemon(data);
      new Audio(audioFiles.whosthat).play();
    } catch (err) {
      console.error("Failed to fetch Pokémon", err);
    }
  };

  const handleGuess = () => {
    if (!pokemon) return;
    const userGuess = guess.toLowerCase().trim().replace(/\s+/g, "-");
    if (userGuess === pokemon.name) {
      const newScore = score + 1;
      setScore(newScore);
      alert(`Correct! It's ${pokemon.name}!`);
      fetchPokemon();
    } else {
      const newHealth = health - 1;
      setHealth(newHealth);
      if (newHealth > 0) {
        alert(`It was ${pokemon.name}, better luck next time!`);
        fetchPokemon();
      } else {
        alert(
          `The final Pokémon was ${pokemon.name}! Your final score is ${score}`
        );
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("highScore", score);
        }
        startGame();
      }
    }
    setGuess("");
  };

  return (
    <div>
      <div className="header">
        <p className="score">Score: {score}</p>
        <p className="health">Health: {health}</p>
        <p className="high-score">High Score: {highScore}</p>
      </div>

      <div className="gen-select">
        {Object.keys(genRanges).map((genKey) => (
          <label key={genKey} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              checked={enabledGens[genKey]}
              onChange={() =>
                setEnabledGens((prev) => ({
                  ...prev,
                  [genKey]: !prev[genKey],
                }))
              }
            />
            {genKey.toUpperCase()}
          </label>
        ))}
      </div>

      <div className="game-container">
        <img
          className="pokemon-image"
          src={pokemon?.sprites.other["official-artwork"].front_default || ""}
          alt="Who's that Pokémon?"
        />
        <input
          className="guess-input"
          type="text"
          placeholder="Who's that Pokémon!?"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button className="guess-button" onClick={handleGuess}>
          Submit
        </button>
        <button className="restart-button" onClick={startGame}>
          Restart
        </button>
      </div>
    </div>
  );
}
