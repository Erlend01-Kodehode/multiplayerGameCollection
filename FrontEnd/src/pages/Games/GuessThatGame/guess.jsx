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
      const id = Math.floor(Math.random() * 1025) + 1;
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
    const userGuess = guess.toLowerCase().trim();
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
        alert(`Game Over! Your final score is ${score}`);
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
        <Link to="/home" className="logo-link">
          <img className="logo" src="./images/api.png" alt="Logo" />
        </Link>
        <p className="score">Score: {score}</p>
        <p className="health">Health: {health}</p>
        <p className="high-score">High Score: {highScore}</p>
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
