"use client";
import Client from "@/models/client";
import { useState } from "react";
import styles from "./styles.module.css";

export default function ClientForm() {
  const [formData, setFormData] = useState<Omit<Client, "_id">>({
    fullName: "",
    numero: "",
    correo: "",
    direccion: "",
    notas: "",
    id: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          value={formData.fullName}
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
          value={formData.numero}
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
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
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
          value={formData.direccion}
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
          value={formData.notas}
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
          value={formData.id}
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
