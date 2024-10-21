"use client";
import BarChart from "@/components/stats/barChart/barChart";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";

export default function Stats() {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(1); // null para gráfico anual
  const [isAnnual, setIsAnnual] = useState<boolean>(true);
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate(); // Devuelve el último día del mes
  };

  const monthDays = month !== null ? getDaysInMonth(year, month) : 30; // Asume 30 días para la vista anual

  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  useEffect(() => {
    const fetchCosts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          year: year.toString(),
          ...(!isAnnual && month !== null && { month: month.toString() }), // Solo añadir mes si no es null
        });

        const response = await fetch(`/api/order/graph?${queryParams}`);

        // Asegúrate de que la respuesta sea exitosa antes de procesar los datos
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result.gananciasMensuales);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching monthly costs:", error);
        setLoading(false);
      }
    };

    fetchCosts();
  }, [year, month, isAnnual]);

  return (
    <main className={styles.main}>
      <h1>Gráfica</h1>
      <div className={styles.graphFilter}>
        {/* Select para elegir entre anual o mensual */}
        <label className={styles.isAnnualBox}>
          Mostrar gráfico anual
          <input
            type="checkbox"
            checked={isAnnual}
            onChange={(e) => setIsAnnual(e.target.checked)}
          />
        </label>

        {/* Select de año */}
        <div className={styles.yearBox}>
          <label>Año: </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min="2000"
            max={new Date().getFullYear()}
          />
        </div>

        {/* Select de mes (solo se muestra si el gráfico no es anual) */}
        {!isAnnual && (
          <div>
            <label>Mes: </label>
            <select
              value={month ?? ""}
              onChange={(e) => setMonth(Number(e.target.value) || null)}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!loading && (
        <BarChart isAnnual={isAnnual} data={data} monthDays={monthDays} />
      )}
    </main>
  );
}
