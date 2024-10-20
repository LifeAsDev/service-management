"use client";
import BarChart from "@/components/stats/barChart/barChart";
import styles from "./styles.module.css";
export default function Stats() {
  return (
    <main className={styles.main}>
      <h1>Grafica</h1>
      <BarChart />
    </main>
  );
}
