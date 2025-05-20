import { Outlet } from "react-router-dom";

import styles from "../CSSModule/game.module.css";

const GamePage = () => {
    return (
        <div className={styles.gamepage}>
            <Outlet />
        </div>
    );
}
export default GamePage;