"use client";
import Client from "@/models/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Order from "@/models/order"; // Importa la interfaz `Order`

export default function OrderForm({
  creatingOrder,
  handleChange,
  orderData,
  setErrors,
  errors,
}: {
  creatingOrder: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  orderData: Order;
  setErrors: Dispatch<
    SetStateAction<{
      [K in keyof Omit<Order, "_id" | "createdAt" | "cliente">]?: string;
    }>
  >;
  errors: {
    [K in keyof Omit<Order, "_id" | "createdAt" | "cliente">]?: string;
  };
}) {
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
