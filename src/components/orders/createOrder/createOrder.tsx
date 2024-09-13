"use client";
import OrderForm from "@/components/orders/createOrder/orderForm/orderForm";
import styles from "./styles.module.css";
import SetOrderClientForm from "@/components/orders/createOrder/setOrderClientForm/setOrderClientForm";
import confirmNewClient from "@/components/orders/createOrder/confirmNewClient/confirmNewClient";
import Order from "@/models/order";
import router from "next/router";
import { useState } from "react";
export default function CreateOrder({ orderFetch }: { orderFetch?: Order }) {
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
  const [errors, setErrors] = useState<{
    [K in keyof Omit<Order, "_id" | "createdAt" | "cliente">]?: string;
  }>({});
  const [creatingOrder, setCreatingOrder] = useState(false);

  const handleSubmit = async () => {
    const newOrderErrors: Partial<
      Record<keyof Omit<Order, "_id" | "createdAt">, string>
    > = {};

    Object.entries(orderData).forEach(([key, value]) => {
      if (
        ["marca", "modelo", "tipo", "numeroDeSerie", "contraseña"].includes(
          key
        ) &&
        typeof value === "string" &&
        value.trim() === ""
      ) {
        newOrderErrors[key as keyof Omit<Order, "_id" | "createdAt">] =
          "Este campo es obligatorio.";
      }
    });

    if (Object.keys(newOrderErrors).length > 0) {
      setErrors(newOrderErrors);
      return;
    }

    setCreatingOrder(true);

    try {
      const data = new FormData();
      Object.entries(orderData).forEach(([key, value]) => {
        data.append(key, value as string);
      });
      data.append("clientId", "asdaad" as string);

      data.append("confirmNewClient", String(confirmNewClient)); // donde confirmClientCreate es un booleano

      const response = await fetch("/api/order", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Order created:", result.order);
        router.push(`/orders`);
      } else {
        console.error("Error:", result.message);
        setCreatingOrder(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setCreatingOrder(false);
    }
  };

  return (
    <main className={styles.main}>
      <h2>Crear Orden</h2>
      <div className={styles.serviceBox}>
        <OrderForm />
        <SetOrderClientForm />
      </div>
      <button
        disabled={creatingOrder}
        onClick={handleSubmit}
        className={`${styles.button} ${creatingOrder && styles.creatingClient}`}
      >
        {!creatingOrder ? (
          <>{orderFetch ? "Guardar" : "Crear"}</>
        ) : (
          <div className="loader"></div>
        )}
      </button>
    </main>
  );
}
