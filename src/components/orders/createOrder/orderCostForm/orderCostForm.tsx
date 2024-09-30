"use client";
import Client from "@/models/client";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
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
  setOrderData,
}: {
  creatingOrder: boolean;
  costs?: { nombre: string; costo: string; key?: string }[];
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
  setOrderData: Dispatch<SetStateAction<Order>>;
}) {
  const formatNumber = (num: number) => {
    const [integerPart, decimalPart] = num.toFixed(2).split(".");
    return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const IVA_RATE = 0.19;

  // Dentro de tu componente
  const costSummary = useMemo(() => {
    if (!costs) return { cost: 0, iva: 0, totalCost: 0 };

    // Sumar todos los 'costo' del array
    const cost = costs.reduce((acc, curr) => {
      const currentCost = parseFloat(curr.costo) || 0; // Asegurarse de que el costo sea un número
      return acc + currentCost;
    }, 0);

    // Calcular IVA y total
    const iva = cost * IVA_RATE;
    const totalCost = cost + iva;

    return {
      cost: formatNumber(cost),
      iva: formatNumber(iva),
      totalCost: formatNumber(totalCost),
    };
  }, [costs]);

  const addCost = () => {
    setOrderData((prev) => {
      const newOrderData = { ...prev };

      newOrderData.costos = [
        ...(newOrderData.costos || []),
        { nombre: "", costo: "", key: Date.now().toString() },
      ];
      return newOrderData;
    });
  };
  const removeCost = (index: number) => {
    setOrderData((prev) => {
      const newOrderData = { ...prev };

      const updatedCostos = [...(newOrderData.costos || [])];

      updatedCostos.splice(index, 1);

      newOrderData.costos = updatedCostos;

      return newOrderData;
    });
  };

  return (
    <form className={styles.form}>
      <h3>Costo</h3>
      <ul className={styles.costoUl}>
        {costs &&
          costs.map((item, index) => (
            <li key={item.key} className={styles.costoLi}>
              <div className={styles.inputGroup}>
                <label htmlFor={`description${index}`} className={styles.label}>
                  Descripcion:
                </label>
                <input
                  disabled={creatingOrder}
                  type="text"
                  placeholder="Descripcion"
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
                  placeholder="Precio"
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
              <svg
                onClick={() => removeCost(index)}
                className={styles.costMinus}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g id="Edit / Remove_Minus">
                    <path
                      id="Vector"
                      d="M6 12H18"
                      stroke="#ccc"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </g>
              </svg>
            </li>
          ))}
        <li onClick={addCost} className={styles.costoAddBtn}>
          Agregar Costo
        </li>
      </ul>
      <ul className={styles.costsBox}>
        <li>
          Costo <span>$ {costSummary.cost}</span>
        </li>
        <li>
          IVA(19%) <span>$ {costSummary.iva}</span>
        </li>
        <li>
          Costo Total <span>$ {costSummary.totalCost}</span>
        </li>
      </ul>
    </form>
  );
}
