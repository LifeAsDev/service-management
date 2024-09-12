import OrderForm from "@/components/orders/createOrder/orderForm/orderForm";
import styles from "./styles.module.css";
import SetOrderClientForm from "@/components/orders/createOrder/setOrderClientForm/setOrderClientForm";
export default function CreateOrder() {
  return (
    <main className={styles.main}>
      <h2>Crear Orden</h2>
      <div className={styles.serviceBox}>
        <OrderForm />
        <SetOrderClientForm />
      </div>
    </main>
  );
}
