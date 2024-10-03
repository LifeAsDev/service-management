"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import order from "@/schemas/order";
interface CountByState {
  _id: string;
  count: number;
}
export default function Home() {
  const [orderStates, setOrderStates] = useState({
    asignadas: 0,
    revisiones: 0,
    rechazadas: 0,
    reparadas: 0,
    sinSolucion: 0,
    entregadas: 0,
  });
  const todayDate = useMemo(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses son indexados desde 0
    const year = String(today.getFullYear()).slice(-2); // Obtiene los últimos 2 dígitos del año

    return `${day}/${month}/${year}`;
  }, []);

  useEffect(() => {
    const fetchOrderStates = async () => {
      try {
        const response = await fetch("/api/order/countByStatus"); // Ajusta la ruta según tu API
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const data = await response.json();
        console.log({ data });
        setOrderStates({
          asignadas: data.asignadas,
          revisiones: data.revisiones,
          rechazadas: data.rechazadas,
          reparadas: data.reparadas,
          sinSolucion: data.sinSolucion,
          entregadas: data.entregadas,
        });
      } catch (error) {
        console.error("Error fetching order states:", error);
      }
    };

    fetchOrderStates();
  }, []);

  return (
    <main className={styles.main}>
      <p className={styles.topInfo}>{todayDate}</p>
      <p className={styles.topInfo}>Saludos, Alan Rodriguez</p>
      <div className={styles.orderStatesBox}>
        <div className={styles.orderState}>
          <svg
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
              {" "}
              <path
                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
              <path
                d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>
          <p>{orderStates.asignadas} Asignadas</p>
        </div>
        <div className={styles.orderState}>
          <svg
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
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15 14.25C13.3431 14.25 12 15.5931 12 17.25C12 18.9069 13.3431 20.25 15 20.25C16.6569 20.25 18 18.9069 18 17.25C18 15.5931 16.6569 14.25 15 14.25ZM10.5 17.25C10.5 14.7647 12.5147 12.75 15 12.75C17.4853 12.75 19.5 14.7647 19.5 17.25C19.5 19.7353 17.4853 21.75 15 21.75C12.5147 21.75 10.5 19.7353 10.5 17.25Z"
                fill="#ffffff"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.75 8.25H8.25V6.75H15.75V8.25Z"
                fill="#ffffff"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.75 11.25H8.25V9.75H15.75V11.25Z"
                fill="#ffffff"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.25 3H16.0607L18.75 5.68934V12H17.25V6.31066L15.4393 4.5H6.75V19.5H9.75V21H5.25V3Z"
                fill="#ffffff"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.75 14.25H8.25V12.75H9.75V14.25Z"
                fill="#ffffff"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.5791 16.0854L14.9207 15.4146L15.4634 16.5H16.4999V18H14.5364L13.5791 16.0854Z"
                fill="#ffffff"
              ></path>
            </g>
          </svg>
          <p>{orderStates.revisiones} Revisiones</p>
        </div>
        <div className={styles.orderState}>
          <svg
            fill="#ffffff"
            viewBox="0 0 24 24"
            id="Layer_1"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M18,18c-0.55,0-1,0.45-1,1v1H6V4h6v5c0,0.55,0.45,1,1,1h4v1c0,0.55,0.45,1,1,1s1-0.45,1-1V9c0-0.13-0.03-0.25-0.07-0.37 c-0.02-0.04-0.04-0.08-0.07-0.11c-0.03-0.05-0.05-0.11-0.09-0.16l-5-6c-0.01-0.01-0.02-0.02-0.03-0.03 c-0.07-0.07-0.15-0.13-0.23-0.18c-0.03-0.02-0.06-0.05-0.1-0.06C13.28,2.03,13.15,2,13,2H5C4.45,2,4,2.45,4,3v18c0,0.55,0.45,1,1,1 h13c0.55,0,1-0.45,1-1v-2C19,18.45,18.55,18,18,18z M14,5.76L15.86,8H14V5.76z"></path>
              <path d="M8,10h2c0.55,0,1-0.45,1-1s-0.45-1-1-1H8C7.45,8,7,8.45,7,9S7.45,10,8,10z"></path>
              <path d="M13,11H8c-0.55,0-1,0.45-1,1s0.45,1,1,1h5c0.55,0,1-0.45,1-1S13.55,11,13,11z"></path>
              <path d="M13,14H8c-0.55,0-1,0.45-1,1s0.45,1,1,1h5c0.55,0,1-0.45,1-1S13.55,14,13,14z"></path>
              <path d="M13,17H8c-0.55,0-1,0.45-1,1s0.45,1,1,1h5c0.55,0,1-0.45,1-1S13.55,17,13,17z"></path>
              <path d="M20.71,12.29c-0.39-0.39-1.02-0.39-1.41,0L18,13.59l-1.29-1.29c-0.39-0.39-1.02-0.39-1.41,0s-0.39,1.02,0,1.41L16.59,15 l-1.29,1.29c-0.39,0.39-0.39,1.02,0,1.41s1.02,0.39,1.41,0L18,16.41l1.29,1.29C19.49,17.9,19.74,18,20,18s0.51-0.1,0.71-0.29 c0.39-0.39,0.39-1.02,0-1.41L19.41,15l1.29-1.29C21.1,13.32,21.1,12.68,20.71,12.29z"></path>
            </g>
          </svg>
          <p>{orderStates.rechazadas} Rechazadas</p>
        </div>
        <div className={styles.orderState}>
          <svg
            fill="#ffffff"
            viewBox="0 0 24 24"
            id="Layer_1"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M17.71,13.29c-0.39-0.39-1.02-0.39-1.41,0s-0.39,1.02,0,1.41l1,1C17.49,15.9,17.74,16,18,16s0.51-0.1,0.71-0.29l3-3 c0.39-0.39,0.39-1.02,0-1.41s-1.02-0.39-1.41,0L18,13.59L17.71,13.29z"></path>
              <path d="M5,22h13c0.55,0,1-0.45,1-1v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v2H6V4h6v5c0,0.55,0.45,1,1,1h4v1c0,0.55,0.45,1,1,1 s1-0.45,1-1V9c0-0.13-0.03-0.25-0.07-0.36c-0.02-0.04-0.04-0.08-0.07-0.12c-0.03-0.05-0.05-0.11-0.09-0.16l-5-6 c-0.01-0.01-0.02-0.01-0.03-0.03c-0.07-0.07-0.15-0.13-0.23-0.18c-0.03-0.02-0.06-0.05-0.1-0.06C13.28,2.03,13.15,2,13,2H5 C4.45,2,4,2.45,4,3v18C4,21.55,4.45,22,5,22z M14,5.76L15.87,8H14V5.76z"></path>
              <path d="M8,10h2c0.55,0,1-0.45,1-1s-0.45-1-1-1H8C7.45,8,7,8.45,7,9S7.45,10,8,10z"></path>
              <path d="M14,11H8c-0.55,0-1,0.45-1,1s0.45,1,1,1h6c0.55,0,1-0.45,1-1S14.55,11,14,11z"></path>
              <path d="M8,16h4c0.55,0,1-0.45,1-1s-0.45-1-1-1H8c-0.55,0-1,0.45-1,1S7.45,16,8,16z"></path>
              <path d="M8,19h6c0.55,0,1-0.45,1-1s-0.45-1-1-1H8c-0.55,0-1,0.45-1,1S7.45,19,8,19z"></path>
            </g>
          </svg>
          <p>{orderStates.reparadas} Reparadas</p>
        </div>
        <div className={styles.orderState}>
          <svg
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
              <path
                d="M15 16L20 21M20 16L15 21M11 14C7.13401 14 4 17.134 4 21H11M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
          <p>{orderStates.sinSolucion} Sin Solucion</p>
        </div>
        <div className={styles.orderState}>
          <svg
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
              <path
                d="M14.9999 15.2547C13.8661 14.4638 12.4872 14 10.9999 14C7.40399 14 4.44136 16.7114 4.04498 20.2013C4.01693 20.4483 4.0029 20.5718 4.05221 20.6911C4.09256 20.7886 4.1799 20.8864 4.2723 20.9375C4.38522 21 4.52346 21 4.79992 21H9.94465M13.9999 19.2857L15.7999 21L19.9999 17M14.9999 7C14.9999 9.20914 13.2091 11 10.9999 11C8.79078 11 6.99992 9.20914 6.99992 7C6.99992 4.79086 8.79078 3 10.9999 3C13.2091 3 14.9999 4.79086 14.9999 7Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
          <p>{orderStates.entregadas} Entregado</p>
        </div>
      </div>
    </main>
  );
}
