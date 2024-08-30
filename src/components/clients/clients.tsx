"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { formatDate } from "@/lib/calculationFunctions";
import Client from "@/models/client";
import Link from "next/link";
import SearchInput from "@/components/searchInput/searchInput";

export default function Clients() {
  const [fetchingMonitor, setFetchingMonitor] = useState(true);
  const [clientsArr, setClientsArr] = useState<Client[]>([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const fetchClients = async () => {
    setFetchingMonitor(true);

    try {
      const searchParams = new URLSearchParams();

      searchParams.append("keyword", keyword);
      searchParams.append("page", page.toString());
      searchParams.append("pageSize", pageSize.toString());

      const res = await fetch(`/api/client?${searchParams.toString()}`, {
        method: "GET",
      });

      const resData = await res.json();
      if (resData.keyword === keyword) {
        setPageCount(Math.ceil(resData.totalCount / pageSize));
        setFetchingMonitor(false);
        setClientsArr(resData.clients);
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchClients();
  }, [page]);

  useEffect(() => {
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
        <SearchInput
          input={keyword}
          setInput={setKeyword}
          action={() => {
            if (page === 1) fetchClients();
            else {
              setPage(1);
              setPageCount(1);
            }
          }}
          placeholder="Nombre, ID, Correo"
        />
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
      <div className={styles.pageBox}>
        <div
          className={`${styles.arrow} ${page === 1 ? styles.disabled : ""}`}
          onClick={() => page > 1 && setPage(page - 1)}
        >
          {"<"}
        </div>
        {Array.from({ length: pageCount }, (_, i) => (
          <div
            key={i}
            className={`${styles.page} ${
              page === i + 1 ? styles.selected : ""
            }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </div>
        ))}
        <div
          className={`${styles.arrow} ${
            page === pageCount ? styles.disabled : ""
          }`}
          onClick={() => page < pageCount && setPage(page + 1)}
        >
          {">"}
        </div>
      </div>
    </main>
  );
}
