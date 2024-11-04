"use client";
import OrderForm from "@/components/orders/createOrder/orderForm/orderForm";
import styles from "./styles.module.css";
import SetOrderClientForm from "@/components/orders/createOrder/setOrderClientForm/setOrderClientForm";
import Order from "@/models/order";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OrderCostForm from "@/components/orders/createOrder/orderCostForm/orderCostForm";
import Client from "@/models/client";

export default function CreateOrder({ id }: { id?: string }) {
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
    observacion: "",
    garantia: 3,
  });
  const [orderFetch, setOrderFetch] = useState(false);
  const [clientSelected, setClientSelected] = useState<false | Client>(false);
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

  const handleSubmit = () => {
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
        ["marca", "modelo", "tipo"].includes(key) &&
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

    const fetchSubmit = async () => {
      if (!id) {
        try {
          const data = new FormData();

          const serializedCosts = JSON.stringify(orderData.costos);

          Object.entries(orderData).forEach(([key, value]) => {
            if (key === "costos") {
              data.append(key, serializedCosts);
            } else {
              data.append(key, value as string);
            }
          });

          if (clientSelected)
            data.append("clientId", clientSelected._id as string);
          console.log({ clientSelected });
          const response = await fetch("/api/order", {
            method: "POST",
            body: data,
          });

          const result = await response.json();

          if (response.ok) {
            console.log("Order created:", result.order);
            router.push(`/invoice/${id}`);

            router.push(`/invoice/${result.order._id}`);
          } else {
            console.error("Error:", result.message);
            setCreatingOrder(false);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          setCreatingOrder(false);
        }
      } else {
        try {
          const data = new FormData();

          const serializedCosts = JSON.stringify(orderData.costos);

          Object.entries(orderData).forEach(([key, value]) => {
            if (key === "costos") {
              data.append(key, serializedCosts);
            } else {
              data.append(key, value as string);
            }
          });

          if (clientSelected) {
            data.append("clientId", clientSelected._id as string);
          }

          // Asegúrate de agregar el `orderId` si está disponible en `orderData`

          const response = await fetch(`/api/order/${orderData._id}`, {
            method: "PATCH", // Cambia de POST a PATCH
            body: data,
          });

          const result = await response.json();

          if (response.ok) {
            console.log("Order updated:", result.order);
            router.push(`/invoice/${id}`);
          } else {
            console.error("Error:", result.message);
            setCreatingOrder(false);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          setCreatingOrder(false);
        }
      }
    };
    fetchSubmit();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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
            : parseFloat(value) || 0
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
  const fetchDeleteOrder = async () => {
    try {
      const searchParams = new URLSearchParams();

      searchParams.append("id", id!);

      const res = await fetch(`/api/order?${searchParams.toString()}`, {
        method: "DELETE",
      });

      const resData = await res.json();
      router.push(`/orders`);
    } catch (error) {
      router.push(`/orders`);
    }
  };

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
          if (resData.order.cliente) {
            setClientSelected(resData.order.cliente);
          }
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
      <h2>{id ? "Editar" : "Crear"} Orden</h2>
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
              garantia={orderData.garantia}
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
          <>{id ? "Guardar" : "Crear"}</>
        ) : (
          <div className="loader"></div>
        )}
      </button>
      {id && (
        <button
          disabled={creatingOrder}
          onClick={fetchDeleteOrder}
          className={`${styles.button} ${styles.deleteBtn}`}
        >
          Borrar
        </button>
      )}
    </main>
  );
}
