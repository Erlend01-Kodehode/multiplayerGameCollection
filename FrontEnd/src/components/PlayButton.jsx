import React from "react";
import styles from "../CSSModule/componentCSS/playbutton.module.css";

const PlayButton = ({ onClick, children = "Play" }) => (
  <button className={styles.playButton} onClick={onClick}>
    {children}
  </button>
);

export default PlayButton;