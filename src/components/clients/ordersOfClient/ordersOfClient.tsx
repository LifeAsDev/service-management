import Client from "@/models/client";
import styles from "./styles.module.css";

export default function OrdersOfClient({
  cancel,
  orders,
}: {
  cancel: () => void;
  orders: string[];
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.clientBox}>
        <h3 className={styles.h3}>Ordenes de cliente</h3>
        <p>Borra las ordenes primero</p>
        <ul>
          {orders.map((order) => (
            <li key={order}>{order}</li>
          ))}
        </ul>
        <div className={styles.btnBox}>
          <button
            onClick={cancel}
            className={`${styles.button} ${styles.cancel}`}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
