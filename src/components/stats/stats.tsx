"use client";
import BarChart from "@/components/stats/barChart/barChart";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";
interface MonthlyCost {
  mes: string;
  costoTotal: number;
}
export default function Stats() {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const response = await fetch("/api/order/graph"); // Cambia a la ruta correcta del API
        const result = await response.json();
        setData(result.gananciasMensuales);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching monthly costs:", error);
        setLoading(false);
      }
    };

    fetchCosts();
  }, []);
  return (
    <main className={styles.main}>
      <h1>Grafica</h1>
      {!loading && <BarChart data={data} />}
    </main>
  );
}
