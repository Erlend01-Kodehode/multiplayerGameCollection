import styles from "../../CSSModule/componentCSS/confirmation.module.css";

const Confirmation = ({ open, message, onConfirm, onCancel, confirmText = "Yes", cancelText = "No" }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.confirm} onClick={onConfirm}>{confirmText}</button>
          <button className={styles.cancel} onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;