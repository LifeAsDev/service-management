"use client";
import Client from "@/models/client";
import { useState } from "react";
import styles from "./styles.module.css";

export default function ClientForm() {
  const [clientData, setClientData] = useState<Omit<Client, "_id">>({
    fullName: "",
    numero: "",
    correo: "",
    direccion: "",
    notas: "",
    id: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(clientData).forEach(([key, value]) => {
        data.append(key, value);
      });
      const response = await fetch("/api/client", {
        // Replace with your endpoint path
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Client created:", result.client);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
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
          className={styles.input}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="numero" className={styles.label}>
          Numero:
        </label>
        <input
          type="text"
          id="numero"
          name="numero"
          value={clientData.numero}
          onChange={handleChange}
          className={styles.input}
          required
        />
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
          className={styles.input}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="direccion" className={styles.label}>
          Direccion:
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={clientData.direccion}
          onChange={handleChange}
          className={styles.input}
          required
        />
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
          className={styles.input}
        />
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
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={styles.button}>
        Crear
      </button>
    </form>
  );
}
