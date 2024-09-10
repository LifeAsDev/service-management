import { formatDate } from "@/lib/calculationFunctions";
import styles from "./styles.module.css";
import Order from "@/models/order";
export default function DeleteOrder({
  handleSubmit,
  orderData,
  cancel,
}: {
  handleSubmit: () => void;
  orderData: Order;
  cancel: () => void;
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.clientBox}>
        <h3 className={styles.h3}>Borrar Orden</h3>
        <div className={styles.clientDataGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="orden" className={styles.label}>
              Orden:
            </label>
            <p>{orderData._id}</p>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="estado" className={styles.label}>
              Estado:
            </label>
            <p>{orderData.estado || "Sin Estado"}</p>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="fecha" className={styles.label}>
              Fecha:
            </label>
            <p>{formatDate(orderData.createdAt)}</p>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cliente" className={styles.label}>
              Cliente:
            </label>
            <p>{orderData.clienteFullName || "Sin Cliente"}</p>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="equipo" className={styles.label}>
              Equipo:
            </label>
            <p>{`${orderData.modelo} ${orderData.marca}`}</p>
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
            Borrar Orden
          </button>
        </div>
      </div>
    </div>
  );
}
