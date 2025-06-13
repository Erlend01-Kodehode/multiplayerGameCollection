import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "./soliterror.png";

const Navbar = ({
  onBackOne,
  onBackThree,
  onReroll,
  autoCompleteButton,
  moveCount,
  onShowHistory,
}) => {
  return (
    <div className="solitaire-navbar-buttons">
      <button className="button small" onClick={onBackOne}>
        Angre 1
      </button>
      <button className="button small" onClick={onBackThree}>
        Angre 3
      </button>
      <button className="button small" onClick={onReroll}>
        Reroll
      </button>
      {autoCompleteButton}
      <span className="move-counter">Moves: {moveCount}</span>
      <button className="button small" onClick={onShowHistory}>
        History
      </button>
    </div>
  );
};

export default Navbar;
