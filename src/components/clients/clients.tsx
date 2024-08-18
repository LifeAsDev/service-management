"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { formatDate } from "@/lib/calculationFunctions";
import Client from "@/models/client";
import Link from "next/link";
const mockclients: Client[] = [
  {
    fullName: "John Doe",
    numero: "+1234567890",
    correo: "johndoe@example.com",
    direccion: "123 Main St, Springfield",
    notas: "Cliente preferencial",
    id: "1",
    _id: "a1b2c3d4e5",
  },
  {
    fullName: "Jane Smith",
    numero: "+1987654321",
    correo: "janesmith@example.com",
    direccion: "456 Elm St, Metropolis",
    notas: "Solicitó una cotización",
    id: "2",
    _id: "f6g7h8i9j0",
  },
  {
    fullName: "Carlos García",
    numero: "+1111222233",
    correo: "cgarcia@example.com",
    direccion: "789 Oak St, Gotham",
    notas: "Cliente potencial",
    id: "3",
    _id: "k1l2m3n4o5",
  },
  {
    fullName: "María López",
    numero: "+4444555566",
    correo: "mlopez@example.com",
    direccion: "321 Pine St, Star City",
    notas: "Requiere seguimiento",
    id: "4",
    _id: "p6q7r8s9t0",
  },
  {
    fullName: "Luis Martínez",
    numero: "+7777888899",
    correo: "lmartinez@example.com",
    direccion: "654 Maple St, Central City",
    notas: "Interesado en nuevos productos",
    id: "5",
    _id: "u1v2w3x4y5",
  },
  {
    fullName: "Ana González",
    numero: "+0000111122",
    correo: "agonzalez@example.com",
    direccion: "987 Birch St, Coast City",
    notas: "Cliente frecuente",
    id: "6",
    _id: "z6a7b8c9d0",
  },
  {
    fullName: "Miguel Rodríguez",
    numero: "+3333444455",
    correo: "mrodriguez@example.com",
    direccion: "135 Cedar St, Keystone City",
    notas: "Solicitó una devolución",
    id: "7",
    _id: "e1f2g3h4i5",
  },
  {
    fullName: "Lucía Fernández",
    numero: "+6666777788",
    correo: "lfernandez@example.com",
    direccion: "246 Walnut St, Blüdhaven",
    notas: "Cliente nuevo",
    id: "8",
    _id: "j6k7l8m9n0",
  },
  {
    fullName: "Pedro Sánchez",
    numero: "+9999000011",
    correo: "psanchez@example.com",
    direccion: "369 Chestnut St, Fawcett City",
    notas: "Requiere facturación electrónica",
    id: "9",
    _id: "o1p2q3r4s5",
  },
  {
    fullName: "Elena Ruiz",
    numero: "+2222333344",
    correo: "eruiz@example.com",
    direccion: "753 Sycamore St, Smallville",
    notas: "Cliente internacional",
    id: "10",
    _id: "t6u7v8w9x0",
  },
];

export default function Clients() {
  const [fetchingMonitor, setFetchingMonitor] = useState(true);
  const [clientsArr, setClientsArr] = useState<Client[]>([]);
  const [sortByLastDate, setSortByLastDate] = useState(true);

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
