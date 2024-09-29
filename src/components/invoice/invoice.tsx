"use client";
import PrintOrder from "@/components/invoice/printOrder/printOrder";
import styles from "./styles.module.css";
export default function Invoice({ id }: { id: string }) {
  return (
    <main className={styles.main}>
      <PrintOrder />
    </main>
  );
}
