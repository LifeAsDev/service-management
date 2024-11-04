import { RefObject, useMemo, useRef } from "react";
import styles from "./styles.module.css";
import Order from "@/models/order";

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Los meses en JavaScript son 0-indexados
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

const formatNumber = (num: number) => {
  const [integerPart, decimalPart] = num.toFixed(2).split(".");
  return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export default function StickerPrint({ order }: { order: Order }) {
  const IVA_RATE = 0.19;

  // Dentro de tu componente
  const costSummary = useMemo(() => {
    if (!order.costos) return { cost: 0, iva: 0, totalCost: 0 };

    // Sumar todos los 'costo' del array
    const cost = order.costos.reduce((acc, curr) => {
      const currentCost = parseFloat(curr.costo) || 0; // Asegurarse de que el costo sea un número
      return acc + currentCost;
    }, 0);

    // Calcular IVA y total
    const iva = cost * IVA_RATE;
    const totalCost = cost + iva;

    return {
      cost: formatNumber(cost),
      iva: formatNumber(iva),
      totalCost: formatNumber(totalCost),
    };
  }, [order.costos]);

  return (
    <>
      <div className={styles.printOrderMainBox}>
        <ul className={styles.ul}>
          <li>
            <span>Nombre Cliente:</span> {order.cliente.fullName}
          </li>
          <li>
            <span>#Orden:</span> #{order.customId || "Null"}
          </li>
          <li>
            <span>Dispositivo:</span> {order.marca} {order.modelo}
          </li>
          <li>
            <span>Tipo:</span> {order.tipo}
          </li>
          <li>
            <span>Observaciones:</span> {order.observacion}
          </li>
        </ul>
      </div>
    </>
  );
}
