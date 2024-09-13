"use client";
import Client from "@/models/client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import Order from "@/models/order"; // Importa la interfaz `Order`
import ConfirmNewClient from "@/components/orders/createOrder/confirmNewClient/confirmNewClient";

export default function OrderForm() {
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
  const [confirmNewClient, setConfirmNewClient] = useState(false);
  const [errors, setErrors] = useState<{
    [K in keyof Omit<Order, "_id" | "createdAt" | "cliente">]?: string;
  }>({});
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof Client, string>>
  >({});
  const [clientData, setClientData] = useState<Client>({
    fullName: "",
    numero: "",
    correo: "",
    direccion: "",
    id: "",
    notas: "",
  });

  const [creatingOrder, setCreatingOrder] = useState(false);
  const [clientsArr, setClientsArr] = useState<Client[]>([]);
  const [fetchingMonitor, setFetchingMonitor] = useState(true);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (Object.keys(clientData).includes(name)) {
      setClientData({
        ...clientData,
        [name]: value,
      });

      if (value.trim() !== "") {
        setClientErrors({ ...clientErrors, [name]: undefined });
      }
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

  const handleSubmit = async (
    e: React.FormEvent | undefined,
    confirmNewClient: boolean = false
  ) => {
    if (e) e.preventDefault();
    const newOrderErrors: Partial<
      Record<keyof Omit<Order, "_id" | "createdAt">, string>
    > = {};
    const newClientErrors: Partial<Record<keyof Client, string>> = {};

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

    Object.entries(clientData).forEach(([key, value]) => {
      if (typeof value === "string" && value.trim() === "") {
        newClientErrors[key as keyof Client] = "Este campo es obligatorio.";
      }
    });

    if (
      Object.keys(newOrderErrors).length > 0 ||
      Object.keys(newClientErrors).length > 0
    ) {
      setErrors(newOrderErrors);
      setClientErrors(newClientErrors);
      return;
    }

    setCreatingOrder(true);

    try {
      const data = new FormData();
      Object.entries(orderData).forEach(([key, value]) => {
        data.append(key, value as string);
      });
      Object.entries(clientData).forEach(([key, value]) => {
        data.append(key, value as string);
      });

      data.append("confirmNewClient", String(confirmNewClient)); // donde confirmClientCreate es un booleano

      const response = await fetch("/api/order", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        if (result.clientNew) {
          setConfirmNewClient(true);
        } else {
          console.log("Order created:", result.order);
          router.push(`/orders`);
        }
      } else {
        console.error("Error:", result.message);
        setCreatingOrder(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setCreatingOrder(false);
    }
  };

  const cancelOrderPost = () => {
    setConfirmNewClient(false);
    setCreatingOrder(false);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const searchParams = new URLSearchParams();

        searchParams.append("keyword", clientData.fullName);
        const res = await fetch(
          `/api/client/search?${searchParams.toString()}`,
          {
            method: "GET",
          }
        );

        const resData = await res.json();
        if (res.ok) {
          if (clientData.fullName === resData.keyword) {
            setFetchingMonitor(false);
            setClientsArr(resData.clients);
          }
        }
      } catch (error) {}
    };
    setFetchingMonitor(true);
    fetchClients();
  }, [clientData.fullName]);

  return (
    <form className={styles.form}>
      <h3>Servicio</h3>

      <div className={styles.inputGroup}>
        <label htmlFor="marca" className={styles.label}>
          Marca:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="marca"
          name="marca"
          value={orderData.marca}
          onChange={handleChange}
          className={`${styles.input} ${errors.marca ? styles.errorInput : ""}`}
          onFocus={() => setErrors({})}
        />
        {errors.marca && <p className={styles.errorText}>{errors.marca}</p>}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="modelo" className={styles.label}>
          Modelo:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="modelo"
          name="modelo"
          value={orderData.modelo}
          onChange={handleChange}
          className={`${styles.input} ${
            errors.modelo ? styles.errorInput : ""
          }`}
          onFocus={() => setErrors({})}
        />
        {errors.modelo && <p className={styles.errorText}>{errors.modelo}</p>}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="tipo" className={styles.label}>
          Tipo:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="tipo"
          name="tipo"
          value={orderData.tipo}
          onChange={handleChange}
          className={`${styles.input} ${errors.tipo ? styles.errorInput : ""}`}
          onFocus={() => setErrors({})}
        />
        {errors.tipo && <p className={styles.errorText}>{errors.tipo}</p>}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="numeroDeSerie" className={styles.label}>
          Número de Serie:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="numeroDeSerie"
          name="numeroDeSerie"
          value={orderData.numeroDeSerie}
          onChange={handleChange}
          className={`${styles.input} ${
            errors.numeroDeSerie ? styles.errorInput : ""
          }`}
          onFocus={() => setErrors({})}
        />
        {errors.numeroDeSerie && (
          <p className={styles.errorText}>{errors.numeroDeSerie}</p>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="contraseña" className={styles.label}>
          Contraseña:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="contraseña"
          name="contraseña"
          value={orderData.contraseña}
          onChange={handleChange}
          className={`${styles.input} ${
            errors.contraseña ? styles.errorInput : ""
          }`}
          onFocus={() => setErrors({})}
        />
        {errors.contraseña && (
          <p className={styles.errorText}>{errors.contraseña}</p>
        )}
      </div>
    </form>
  );
}
