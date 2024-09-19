"use client";
import OrderForm from "@/components/orders/createOrder/orderForm/orderForm";
import styles from "./styles.module.css";
import SetOrderClientForm from "@/components/orders/createOrder/setOrderClientForm/setOrderClientForm";
import Order from "@/models/order";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OrderCostForm from "@/components/orders/createOrder/orderCostForm/orderCostForm";
import Client from "@/models/client";
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
  const [clientSelected, setClientSelected] = useState<false | string>(false);
  const [errors, setErrors] = useState<{
    [K in keyof Omit<Order, "_id" | "createdAt" | "cliente">]?: string;
  }>({});
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [tabSelected, setTabSelected] = useState<number>(0);
  const [errorsCost, setErrorsCost] = useState<
    { nombre?: string; costo?: string }[]
  >([]);
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof Client | "cliente", string>>
  >({});
  const router = useRouter();

  const handleSubmit = async () => {
    const newOrderErrors: Partial<
      Record<keyof Omit<Order, "_id" | "createdAt">, string>
    > = {};
    const newClientErrors = { ...clientErrors };
    const errorsCost: { nombre?: string; costo?: string }[] =
      orderData.costos?.map((item) => {
        return {
          nombre: item.nombre === "" ? "Este campo es obligatorio." : undefined,
          costo: item.costo === "" ? "Este campo es obligatorio." : undefined,
        };
      }) || [];

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

    if (!clientSelected) {
      newClientErrors.cliente = "Selecciona o crea un cliente.";
    }
    const hasCostErrors = errorsCost.some(
      (error) => error.nombre || error.costo
    );

    if (
      Object.keys(newOrderErrors).length > 0 ||
      Object.keys(newClientErrors).length > 0 ||
      hasCostErrors
    ) {
      setClientErrors(newClientErrors);
      setErrors(newOrderErrors);
      setErrorsCost(errorsCost);

      if (Object.keys(newOrderErrors).length > 0) {
        setTabSelected(0);
      } else if (hasCostErrors) {
        setTabSelected(1);
      }

      return;
    }
    setCreatingOrder(true);

    try {
      const data = new FormData();
      Object.entries(orderData).forEach(([key, value]) => {
        data.append(key, value as string);
      });
      data.append("clientId", clientSelected as string);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, id } = e.target;
    if (name.startsWith("description") || name.startsWith("price")) {
      const costosKey = name.startsWith("description") ? "nombre" : "costo";
      const costosIndex = parseInt(
        name.replace("description", "").replace("price", "")
      );
      const newValue =
        costosKey === "costo"
          ? value === ""
            ? ""
            : parseFloat(value) || ""
          : value;

      setOrderData((prev) => {
        const newOrderData = { ...prev };

        const updatedCostos = [...(newOrderData.costos || [])];

        if (updatedCostos[costosIndex]) {
          updatedCostos[costosIndex] = {
            ...updatedCostos[costosIndex],
            [costosKey]: newValue,
          };
        }

        newOrderData.costos = updatedCostos;

        return newOrderData;
      });
    } else {
      setOrderData({
        ...orderData,
        [name]: value,
      });

      if (value.trim() !== "") {
        setErrors({ ...errors, [name]: undefined });
      }
    }
  };

  return (
    <main className={styles.main}>
      <h2>Crear Orden</h2>
      <div className={styles.serviceBox}>
        <div className={styles.serviceLeftBox}>
          <div className={styles.tabsBox}>
            <div
              onClick={() => {
                setTabSelected(0);
              }}
              className={`${styles.tabBox} ${
                tabSelected === 0 && styles.selected
              }`}
            >
              Servicio
            </div>
            <div
              onClick={() => {
                setTabSelected(1);
              }}
              className={`${styles.tabBox} ${
                tabSelected === 1 && styles.selected
              }`}
            >
              Costo
            </div>
          </div>
          {tabSelected === 0 ? (
            <OrderForm
              creatingOrder={creatingOrder}
              handleChange={handleChange}
              orderData={orderData}
              setErrors={setErrors}
              errors={errors}
            />
          ) : (
            <OrderCostForm
              setOrderData={setOrderData}
              handleChange={handleChange}
              errorsCosts={errorsCost}
              setErrorsCosts={setErrorsCost}
              creatingOrder={creatingOrder}
              costs={orderData.costos}
            />
          )}
        </div>
        <SetOrderClientForm
          setClientErrors={setClientErrors}
          clientErrors={clientErrors}
          setClientSelected={setClientSelected}
          clientSelected={clientSelected}
          errors={errors}
        />
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
