import OrderForm from "@/components/orders/createOrder/orderForm/orderForm";
import styles from "./styles.module.css";
export default function CreateOrder() {
  return (
    <main className={styles.main}>
      <h2>Crear Orden</h2>
      <OrderForm />
    </main>
  );
}
