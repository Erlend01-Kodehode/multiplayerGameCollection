import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../CSSModule/infoCSS/chessgameinfo.module.css";
import {
  PlayButton,
  JoinGameButton,
  HostGameButton,
} from "../../../components/Buttons";
import GameSession from "../GameSession";

const InfoSolitaire = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const [showSession, setShowSession] = useState(false);

  const handlePlayClick = useCallback(() => {
    navigate("/game/play/solitaire");
  }, [navigate]);

  const handleComplete = (pin) => {
    navigate(`/game/play/solitaire?pin=${pin}`);
  };

  const info = useMemo(
    () => [
      {
        title: "Klondike Solitaire Regler",
        content: (
          <ul>
            <li>
              <strong>Mål:</strong> Flytt alle kortene til de fire grunnbunkene (ess til konge, sortert etter farge).
            </li>
            <li>
              <strong>Oppsett:</strong> 7 kolonner med stigende antall kort fra venstre mot høyre. Kun det øverste kortet i hver kolonne er synlig.
            </li>
            <li>
              <strong>Flytting:</strong>
              <ul>
                <li>
                  <strong>Kort i kolonner:</strong> Kan flyttes i synkende rekkefølge og annenhver farge (rød/svart).
                </li>
                <li>
                  <strong>Tom kolonne:</strong> Bare konger (eller sekvenser som starter med konge) kan flyttes hit.
                </li>
                <li>
                  <strong>Grunnbunker:</strong> Bygges opp fra ess til konge i samme farge.
                </li>
                <li>
                  <strong>Trekkbunken:</strong> Snu kort fra trekkbunken til avfallsbunken for å få flere kort i spill.
                </li>
              </ul>
            </li>
            <li>
              <strong>Vinn:</strong> Når alle kortene ligger i grunnbunkene.
            </li>
          </ul>
        ),
      },
      {
        title: "Slik spiller du",
        content: (
          <ul>
            <li>
              <strong>Flytt kort:</strong> Klikk og dra kort mellom kolonner, grunnbunker og avfallsbunken.
            </li>
            <li>
              <strong>Angre:</strong> Bruk "Angre"-knappene for å gå tilbake i trekkene dine.
            </li>
            <li>
              <strong>Reroll:</strong> Trykk "Reroll" for å stokke og starte på nytt.
            </li>
            <li>
              <strong>Auto-complete:</strong> Når det er mulig, bruk auto-complete for å flytte alle gjenværende kort til grunnbunkene automatisk.
            </li>
            <li>
              <strong>Tips:</strong> Prøv å avsløre skjulte kort i kolonnene så tidlig som mulig.
            </li>
          </ul>
        ),
      },
    ],
    []
  );

  return (
    <div className={styles.infoContainer}>
      <h2 className={styles.infoTitle}>Klondike Solitaire Info</h2>
      {/* <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <PlayButton onClick={handlePlayClick}>Spill Solitaire</PlayButton>
      </div> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <JoinGameButton
          onClick={() => {
            setMode("join");
            setShowSession(true);
          }}
        />
        <HostGameButton
          onClick={() => {
            setMode("host");
            setShowSession(true);
          }}
        />
      </div>
      {showSession && <GameSession mode={mode} onComplete={handleComplete} />}
      {info.map((section, idx) => (
        <div key={idx} className={styles.infoSection}>
          <h3 className={styles.sectionTitle}>{section.title}</h3>
          <div className={styles.sectionContent}>{section.content}</div>
        </div>
      ))}
    </div>
  );
};

export default InfoSolitaire;