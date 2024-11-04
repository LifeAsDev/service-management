"use client";
import PrintOrder from "@/components/invoice/printOrder/printOrder";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Order from "@/models/order";
import { useReactToPrint } from "react-to-print";
import TermicoPrint from "@/components/invoice/termicoPrint/termicoPrint";
import StickerPrint from "@/components/invoice/stickerPrint/stickerPrint";

export default function Invoice({ id }: { id: string }) {
  const [orderData, setOrderData] = useState<Order>({
    marca: "",
    modelo: "",
    tipo: "",
    cliente: {
      fullName: "",
      numero: "",
      correo: "",
      direccion: "",
      notas: "",
      id: "",
    },
    numeroDeSerie: "",
    contraseña: "",
    garantia: 3,
  });
  const [orderFetch, setOrderFetch] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [printType, setPrintType] = useState("Estandar");
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return; // Asegúrate de que exista el id

      try {
        // Realiza la petición a la API con el id
        const res = await fetch(`/api/order/${id}`, {
          method: "GET",
        });

        const resData = await res.json();

        // Asegúrate de que se reciban datos válidos antes de actualizar el estado
        if (res.ok) {
          setOrderData(resData.order);
          setOrderFetch(true);
        } else {
          router.push(`/orders`);
        }
      } catch (error) {
        console.log(error);
        router.push(`/orders`);
      }
    };

    fetchOrder();
  }, [id]);
  const handlePrint = useReactToPrint({
    contentRef,
  });

  if (id && !orderFetch) {
    return <main className={styles.main}></main>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.printOptionsBox}>
        <select
          value={printType}
          onChange={(e) => setPrintType(e.target.value)}
        >
          <option value={"Estandar"}>Estandar</option>
          <option value={"Termico"}>Termico</option>
          <option value={"Sticker"}>Sticker</option>
        </select>
        <button
          onClick={() => {
            handlePrint();
          }}
          className={styles.printBtn}
        >
          Imprimir
        </button>
      </div>

      <div ref={contentRef}>
        {printType === "Estandar" ? (
          <PrintOrder order={orderData} />
        ) : printType === "Sticker" ? (
          <StickerPrint order={orderData} />
        ) : (
          <TermicoPrint order={orderData} />
        )}
      </div>
    </main>
  );
}
