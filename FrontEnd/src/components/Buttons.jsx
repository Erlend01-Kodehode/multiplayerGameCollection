import React from "react";
import styles from "../CSSModule/componentCSS/buttons.module.css";

export const PlayButton = ({ onClick, children = "Play" }) => (
  <button className={styles.playButton} onClick={onClick}>
    {children}
  </button>
);

export const ResetButton = ({ onClick, children = "Reset" }) => (
  <button className={styles.resetButton} onClick={onClick}>
    {children}
  </button>
);

export const JoinGameButton = ({ onClick, children = "Join Game" }) => (
  <button className={styles.joinGame} onClick={onClick}>
    {children}
  </button>
);

export const HostGameButton = ({ onClick, children = "Host Game" }) => (
  <button className={styles.hostGame} onClick={onClick}>
    {children}
  </button>
);

export const LocalGameButton = ({ onClick, children = "Local Game" }) => (
  <button className={styles.localGame} onClick={onClick}>
    {children}
  </button>
);

export const NavigationButton = ({ onClick, children = "Navigate" }) => (
  <button className={styles.navigationButton} onClick={onClick}>
    {children}
  </button>
);
