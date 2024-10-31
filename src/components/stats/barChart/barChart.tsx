import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import styles from "./styles.module.css";

interface BarChartProps {
  data: number[]; // Array de datos: si es anual, será un array de 12 meses; si es mensual, será un array de 30 o 31 días.
  isAnnual: boolean; // Prop para diferenciar si es gráfico anual o mensual
  monthDays?: number; // Número de días del mes si es mensual
  data2: number[];
}

const BarChart = ({ data, isAnnual, monthDays, data2 }: BarChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null); // Ref para mantener la instancia del gráfico

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");

      if (chartRef.current) {
        chartRef.current.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
      }

      if (ctx && data) {
        // Etiquetas para los gráficos
        const labels = isAnnual
          ? [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Agosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre",
            ]
          : Array.from({ length: monthDays || 30 }, (_, i) => `Día ${i + 1}`); // Etiquetas para los días del mes

        chartRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels, // Etiquetas dinámicas según sea anual o mensual
            datasets: [
              {
                label: "Ganancias Pendientes (CLP)",
                data: data2, // Los datos se pasan desde el componente padre
                backgroundColor: "rgba(255, 159, 64, 0.2)", // Color de fondo de las barras para pendientes
                borderColor: "rgba(255, 159, 64, 1)", // Color del borde de las barras para pendientes
                borderWidth: 1,
              },
              {
                label: isAnnual
                  ? "Ganancias Mensuales (CLP)"
                  : "Ganancias Diarias (CLP)",
                data: data, // Los datos se pasan desde el componente padre
                backgroundColor: "rgba(75, 192, 192, 0.2)", // Color de las barras
                borderColor: "rgba(75, 192, 192, 1)", // Color del borde de las barras
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return "$" + value.toLocaleString("es-CL"); // Formato de pesos chilenos
                  },
                },
              },
            },
            maintainAspectRatio: false, // Permitir que el gráfico mantenga su aspecto al cambiar de tamaño
            responsive: true, // Hacer que el gráfico sea responsivo
          },
        });
      }
    }

    // Limpiar al desmontar el componente
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, isAnnual, monthDays]);

  return (
    <div>
      <canvas className={styles.canvas} ref={canvasRef}></canvas>
    </div>
  );
};

export default BarChart;
