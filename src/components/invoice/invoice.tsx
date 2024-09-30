"use client";
import PrintOrder from "@/components/invoice/printOrder/printOrder";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Order from "@/models/order";

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
  });
  const [orderFetch, setOrderFetch] = useState(false);

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

  if (id && !orderFetch) {
    return <main className={styles.main}></main>;
  }

  return (
    <main className={styles.main}>
      <PrintOrder order={orderData} />
    </main>
  );
}
