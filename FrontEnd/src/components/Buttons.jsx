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

export const NavigationButton = ({ onClick, children = "Navigate" }) => (
  <button className={styles.navigationButton} onClick={onClick}>
    {children}
  </button>
);
