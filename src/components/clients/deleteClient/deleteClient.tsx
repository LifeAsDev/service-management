import Client from "@/models/client";
import styles from "./styles.module.css";
export default function DeleteClient({
  handleSubmit,
  clientData,
  cancel,
}: {
  handleSubmit: () => void;
  clientData: Client;
  cancel: () => void;
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.clientBox}>
        <h3 className={styles.h3}>Borrar Cliente</h3>
        <div className={styles.clientDataGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName" className={styles.label}>
              Nombre completo:
            </label>
            <p>{clientData.fullName}</p>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="id" className={styles.label}>
              ID:
            </label>
            <p>{clientData.id}</p>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="numero" className={styles.label}>
              Número:
            </label>
            <p>{clientData.numero}</p>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="correo" className={styles.label}>
              Correo:
            </label>
            <p>{clientData.correo}</p>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="direccion" className={styles.label}>
              Dirección:
            </label>
            <p>{clientData.direccion}</p>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="notas" className={styles.label}>
              Notas:
            </label>
            <p>{clientData.notas}</p>
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
            Borrar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
