"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import Order from "@/models/order";
import { formatDate } from "@/lib/calculationFunctions";
const mockOrders: Order[] = [
  {
    marca: "Samsung",
    modelo: "Galaxy S23",
    tipo: "Smartphone",
    cliente: "John Doe",
    numeroDeSerie: "SM-S911B1234567",
    contraseña: "password123",
    _id: "647f537234231",
    createdAt: new Date("2023-11-22T10:30:00Z"),
  },
  {
    marca: "Apple",
    modelo: "MacBook Pro 14",
    tipo: "Laptop",
    cliente: "Jane Smith",
    numeroDeSerie: "C0234567890",
    contraseña: "apple123",
    _id: "647f537234232",
    createdAt: new Date("2023-12-15T15:20:00Z"),
  },
  {
    marca: "Sony",
    modelo: "PlayStation 5",
    tipo: "Console",
    cliente: "Michael Johnson",
    numeroDeSerie: "PS5-6789012345",
    contraseña: "gamer123",
    _id: "647f537234233",
    createdAt: new Date("2024-01-10T11:45:00Z"),
  },
  {
    marca: "Dell",
    modelo: "XPS 13",
    tipo: "Laptop",
    cliente: "Alice Brown",
    numeroDeSerie: "XPS13-0987654321",
    contraseña: "dellxps",
    _id: "647f537234234",
    createdAt: new Date("2023-11-29T09:10:00Z"),
  },
  {
    marca: "Google",
    modelo: "Pixel 7",
    tipo: "Smartphone",
    cliente: "Chris Davis",
    numeroDeSerie: "GP7-1234567890",
    contraseña: "pixelpass",
    _id: "647f537234235",
    createdAt: new Date("2024-01-01T14:00:00Z"),
  },
  {
    marca: "Microsoft",
    modelo: "Surface Pro 8",
    tipo: "Tablet",
    cliente: "Emily Wilson",
    numeroDeSerie: "SP8-8765432109",
    contraseña: "surface8",
    _id: "647f537234236",
    createdAt: new Date("2023-12-20T16:25:00Z"),
  },
  {
    marca: "HP",
    modelo: "Spectre x360",
    tipo: "Laptop",
    cliente: "David Martinez",
    numeroDeSerie: "HP360-2345678901",
    contraseña: "hpspectre",
    _id: "647f537234237",
    createdAt: new Date("2023-11-27T12:15:00Z"),
  },
  {
    marca: "Asus",
    modelo: "ROG Strix G15",
    tipo: "Laptop",
    cliente: "Sophia Anderson",
    numeroDeSerie: "ROG15-3456789012",
    contraseña: "rog123",
    _id: "647f537234238",
    createdAt: new Date("2023-12-05T13:30:00Z"),
  },
  {
    marca: "Lenovo",
    modelo: "ThinkPad X1 Carbon",
    tipo: "Laptop",
    cliente: "Lucas Thompson",
    numeroDeSerie: "TPX1-4567890123",
    contraseña: "thinkpadx1",
    _id: "647f537234239",
    createdAt: new Date("2023-12-18T10:50:00Z"),
  },
  {
    marca: "OnePlus",
    modelo: "OnePlus 11",
    tipo: "Smartphone",
    cliente: "Isabella Martinez",
    numeroDeSerie: "OP11-5678901234",
    contraseña: "oneplus11",
    _id: "647f537234240",
    createdAt: new Date("2024-01-12T17:00:00Z"),
  },
];

export default function Orders() {
  const [fetchingMonitor, setFetchingMonitor] = useState(false);
  const [ordersArr, setOrdersArr] = useState<Order[]>(mockOrders);
  const [sortByLastDate, setSortByLastDate] = useState(true);
  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <h3>Órdenes</h3>
        <button className={styles.addOrderBtn}>Crear Orden</button>
      </div>
      <div className={styles.tableOutside}>
        <div
          id="evaluationList"
          className={`${fetchingMonitor ? styles.hidden : ""} ${
            styles.tableBox
          }`}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <div>Orden</div>
                </th>
                <th>
                  <div className={styles.dateHeadBox}>
                    Fecha
                    <svg
                      onClick={() => {
                        setSortByLastDate((prev) => !prev);
                      }}
                      className={`${!sortByLastDate && styles.rotate}`}
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
                          d="M4 8H13"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>{" "}
                        <path
                          d="M6 13H13"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>{" "}
                        <path
                          d="M8 18H13"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>{" "}
                        <path
                          d="M17 20V4L20 8"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </div>
                </th>
                <th>
                  <div>Modelo</div>
                </th>
              </tr>
            </thead>
            <tbody id="evaluationList" className={styles.tbody}>
              {fetchingMonitor ? (
                <>
                  {Array.from({ length: 10 }, (_, index) => (
                    <tr key={index} className={styles.tr}>
                      <td className={styles.td}></td>
                      <td className={styles.td}></td>
                      <td className={styles.td}></td>
                    </tr>
                  ))}
                </>
              ) : (
                ordersArr.map((item, i) => (
                  <tr key={`${item._id}`} className={styles.tr}>
                    <td className={styles.td}>
                      <div>
                        <p>{item._id}</p>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div>
                        <p>{formatDate(item.createdAt)}</p>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div>
                        <p>{item.modelo}</p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {fetchingMonitor ? (
            <div className={styles.overlay}>
              <div className={styles.loader}></div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </main>
  );
}
