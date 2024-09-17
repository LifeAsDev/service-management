"use client";
import Client from "@/models/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import Order from "@/models/order"; // Importa la interfaz `Order`
import ConfirmNewClient from "@/components/orders/createOrder/confirmNewClient/confirmNewClient";

export default function OrderCostForm({
  creatingOrder,
  costs,
  errorsCosts,
  setErrorsCosts,
  handleChange,
}: {
  creatingOrder: boolean;
  costs?: { nombre: string; costo: string }[];
  errorsCosts: { nombre?: string; costo?: string }[];
  setErrorsCosts: Dispatch<
    SetStateAction<
      {
        nombre?: string;
        costo?: string;
      }[]
    >
  >;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <form className={styles.form}>
      <h3>Costo</h3>
      <ul className={styles.costoUl}>
        {costs &&
          costs.map((item, index) => (
            <li className={styles.costoLi}>
              <div className={styles.inputGroup}>
                <label htmlFor={`description${index}`} className={styles.label}>
                  Descripcion:
                </label>
                <input
                  disabled={creatingOrder}
                  type="text"
                  id={`description${index}`}
                  name={`description${index}`}
                  value={item.nombre}
                  onChange={handleChange}
                  className={`${styles.input} ${
                    errorsCosts?.[index]?.nombre ? styles.errorInput : ""
                  }`}
                  onFocus={() => setErrorsCosts([])}
                />
                {errorsCosts?.[index]?.nombre && (
                  <p className={styles.errorText}>
                    {errorsCosts?.[index]?.nombre}
                  </p>
                )}
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor={`price${index}`} className={styles.label}>
                  Precio:
                </label>
                <input
                  disabled={creatingOrder}
                  type="text"
                  id={`price${index}`}
                  name={`price${index}`}
                  value={item.costo}
                  onChange={handleChange}
                  className={`${styles.input} ${
                    errorsCosts?.[index]?.costo ? styles.errorInput : ""
                  }`}
                  onFocus={() => setErrorsCosts([])}
                />
                {errorsCosts?.[index]?.costo && (
                  <p className={styles.errorText}>
                    {errorsCosts?.[index]?.costo}
                  </p>
                )}
              </div>
            </li>
          ))}

        <li className={styles.costoAddBtn}>Agregar Costo</li>
      </ul>
      <ul className={styles.costsBox}>
        <li>
          Costo <span>$ 160,000</span>
        </li>
        <li>
          IVA(19%) <span>$ 23,000</span>
        </li>
        <li>
          Costo Total <span>$ 183,000</span>
        </li>
      </ul>
    </form>
  );
}
