import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import styles from "./styles.module.css";
const BarChart = ({ data }: { data: number[] }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null); // Ref para mantener la instancia del gráfico

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");

      if (chartRef.current) {
        chartRef.current.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
      }

      if (ctx && data) {
        chartRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: [
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
            ],
            datasets: [
              {
                label: "Ganancias (CLP)",
                data: data || [
                  500000, 700000, 300000, 800000, 1000000, 1500000, 1000000,
                  900000, 1100000, 1300000, 1700000, 1400000,
                ], // Datos de ganancias por mes en pesos chilenos
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
  }, [data]);
  return (
    <div>
      <canvas className={styles.canvas} ref={canvasRef}></canvas>
    </div>
  );
};

export default BarChart;
