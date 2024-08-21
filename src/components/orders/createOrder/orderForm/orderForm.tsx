"use client";
import Client from "@/models/client";
import { useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import Order from "@/models/order"; // Importa la interfaz `Order`

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const response = await fetch("/api/order", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      router.push(`/orders`);

      if (response.ok) {
        console.log("Order created:", result.order);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="marca" className={styles.label}>
          Marca:
        </label>
        <input
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
      <div className={styles.inputGroup}>
        <label htmlFor="fullName" className={styles.label}>
          Nombre completo:
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={clientData.fullName}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.fullName ? styles.errorInput : ""
          }`}
          onFocus={() => setClientErrors({})}
        />
        {clientErrors.fullName && (
          <p className={styles.errorText}>{clientErrors.fullName}</p>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="id" className={styles.label}>
          ID:
        </label>
        <input
          type="text"
          id="id"
          name="id"
          value={clientData.id}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.id ? styles.errorInput : ""
          }`}
          onFocus={() => setClientErrors({})}
        />
        {clientErrors.id && (
          <p className={styles.errorText}>{clientErrors.id}</p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="numero" className={styles.label}>
          Número:
        </label>
        <input
          type="text"
          id="numero"
          name="numero"
          value={clientData.numero}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.numero ? styles.errorInput : ""
          }`}
          onFocus={() => setClientErrors({})}
        />
        {clientErrors.numero && (
          <p className={styles.errorText}>{clientErrors.numero}</p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="correo" className={styles.label}>
          Correo:
        </label>
        <input
          type="text"
          id="correo"
          name="correo"
          value={clientData.correo}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.correo ? styles.errorInput : ""
          }`}
          onFocus={() => setClientErrors({})}
        />
        {clientErrors.correo && (
          <p className={styles.errorText}>{clientErrors.correo}</p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="direccion" className={styles.label}>
          Dirección:
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={clientData.direccion}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.direccion ? styles.errorInput : ""
          }`}
          onFocus={() => setClientErrors({})}
        />
        {clientErrors.direccion && (
          <p className={styles.errorText}>{clientErrors.direccion}</p>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="notas" className={styles.label}>
          Notas:
        </label>
        <input
          type="text"
          id="notas"
          name="notas"
          value={clientData.notas}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.notas ? styles.errorInput : ""
          }`}
          onFocus={() => setErrors({})}
        />
        {clientErrors.notas && (
          <p className={styles.errorText}>{clientErrors.notas}</p>
        )}
      </div>
      <button
        disabled={creatingOrder}
        onClick={handleSubmit}
        type="submit"
        className={`${styles.button} ${creatingOrder && styles.creatingClient}`}
      >
        {!creatingOrder ? "Crear" : <div className="loader"></div>}
      </button>
    </form>
  );
}
