"use client";
import Client from "@/models/client";
import { useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

export default function ClientForm({ clientFetch }: { clientFetch?: Client }) {
  const [clientData, setClientData] = useState<Omit<Client, "_id">>(
    clientFetch || {
      fullName: "",
      numero: "",
      correo: "",
      direccion: "",
      notas: "",
      id: "",
    }
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof Omit<Client, "_id">, string>>
  >({});
  const [creatingClient, setCreatingClient] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value,
    });

    // Limpiar errores cuando el usuario escribe
    if (value.trim() !== "") {
      setErrors({});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof Omit<Client, "_id">, string>> = {};
    Object.entries(clientData).forEach(([key, value]) => {
      if (["fullName"].includes(key) && value.trim() === "") {
        newErrors[key as keyof Omit<Client, "_id">] =
          "Este campo es obligatorio.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setCreatingClient(true);

    // Definir el método (POST o PATCH) según si clientFetch es falsy o truthy
    const method = clientFetch ? "PATCH" : "POST";
    const endpoint = clientFetch
      ? `/api/client/${clientFetch._id}`
      : "/api/client";

    const fetchSubmit = async () => {
      try {
        const data = new FormData();
        Object.entries(clientData).forEach(([key, value]) => {
          data.append(key, value);
        });

        // Hacer la solicitud con POST o PATCH
        const response = await fetch(endpoint, {
          method,
          body: data,
        });

        const result = await response.json();

        if (response.ok) {
          router.push(`/clients`); // Redirige después de la creación/edición
          console.log(
            `${clientFetch ? "Client updated" : "Client created"}:`,
            result.client
          );
        } else {
          console.error("Error:", result.message);
          setCreatingClient(false);
          setErrors(result.errors);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
    fetchSubmit();
  };

  return (
    <>
      <button
        disabled={creatingClient}
        onClick={handleSubmit}
        type="submit"
        className={`${styles.button} ${
          creatingClient && styles.creatingClient
        }`}
      >
        {!creatingClient ? (
          <>{clientFetch ? "Guardar" : "Crear"}</>
        ) : (
          <div className="loader"></div>
        )}
      </button>
      <form className={styles.form}>
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
              errors.fullName ? styles.errorInput : ""
            }`}
            onFocus={() => setErrors({})}
          />
          {errors.fullName && (
            <p className={styles.errorText}>{errors.fullName}</p>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="id" className={styles.label}>
            RUT:
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={clientData.id}
            onChange={handleChange}
            className={`${styles.input} ${errors.id ? styles.errorInput : ""}`}
            onFocus={() => setErrors({})}
          />
          {errors.id && <p className={styles.errorText}>{errors.id}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="numero" className={styles.label}>
            Número de telefono:
          </label>
          <input
            type="text"
            id="numero"
            name="numero"
            value={clientData.numero}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.numero ? styles.errorInput : ""
            }`}
            onFocus={() => setErrors({})}
          />
          {errors.numero && <p className={styles.errorText}>{errors.numero}</p>}
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
              errors.correo ? styles.errorInput : ""
            }`}
            onFocus={() => setErrors({})}
          />
          {errors.correo && <p className={styles.errorText}>{errors.correo}</p>}
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
              errors.direccion ? styles.errorInput : ""
            }`}
            onFocus={() => setErrors({})}
          />
          {errors.direccion && (
            <p className={styles.errorText}>{errors.direccion}</p>
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
              errors.notas ? styles.errorInput : ""
            }`}
            onFocus={() => setErrors({})}
          />
          {errors.notas && <p className={styles.errorText}>{errors.notas}</p>}
        </div>
      </form>
    </>
  );
}
