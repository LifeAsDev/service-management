"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import Order from "@/models/order";
import { formatDate } from "@/lib/calculationFunctions";
import Link from "next/link";

export default function Orders() {
  const [fetchingMonitor, setFetchingMonitor] = useState(false);
  const [ordersArr, setOrdersArr] = useState<Order[]>([]);
  const [sortByLastDate, setSortByLastDate] = useState(true);
  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <h3>Órdenes</h3>
        <Link className={styles.addOrderBtn} href={"/orders/create"}>
          <button>Crear Orden</button>
        </Link>
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
