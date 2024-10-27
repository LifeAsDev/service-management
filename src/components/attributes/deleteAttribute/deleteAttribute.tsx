import styles from "./styles.module.css";
import Attribute from "@/models/attribute";
export default function DeleteAttribute({
  handleSubmit,
  attributeData,
  cancel,
}: {
  handleSubmit: () => void;
  attributeData: Attribute;
  cancel: () => void;
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.clientBox}>
        <h3 className={styles.h3}>Borrar Entrada</h3>
        <div className={styles.attributeDataGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre:
            </label>
            <p>{attributeData.name}</p>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="inputType" className={styles.label}>
              Entrada:
            </label>
            <p>{attributeData.inputType}</p>
          </div>
        </div>
        <div className={styles.btnBox}>
          <button
            onClick={cancel}
            className={`${styles.button} ${styles.cancel}`}
          >
            Volver
          </button>
          <button onClick={handleSubmit} className={`${styles.button}`}>
            Borrar Entrada
          </button>
        </div>
      </div>
    </div>
  );
}
