"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { formatDate } from "@/lib/calculationFunctions";
import Client from "@/models/client";
import Link from "next/link";

export default function Clients() {
  const [fetchingMonitor, setFetchingMonitor] = useState(true);
  const [clientsArr, setClientsArr] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`/api/client`, {
          method: "GET",
        });

        const resData = await res.json();
        setFetchingMonitor(false);
        setClientsArr(resData.clients);
      } catch (error) {}
    };
    fetchClients();
  }, []);
  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <h3>Clientes</h3>
        <Link className={styles.addOrderBtn} href={"/clients/create"}>
          <button>Crear Cliente</button>
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
                  <div>Nombre Completo</div>
                </th>
                <th>
                  <div className={styles.dateHeadBox}>ID</div>
                </th>
                <th>
                  <div>Correo</div>
                </th>
              </tr>
            </thead>
            <tbody id="evaluationList" className={styles.tbody}>
              {fetchingMonitor ? (
                <></>
              ) : (
                clientsArr.map((item, i) => (
                  <tr key={`${item._id}`} className={styles.tr}>
                    <td className={styles.td}>
                      <div>
                        <p>{item.fullName}</p>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div>
                        <p>{item.id}</p>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div>
                        <p>{item.correo}</p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {fetchingMonitor ? (
            <p className={styles.fetchText}>Obteniendo Datos...</p>
          ) : (
            ""
          )}
        </div>
      </div>
    </main>
  );
}
