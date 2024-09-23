"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Order from "@/models/order";
import { formatDate } from "@/lib/calculationFunctions";
import Link from "next/link";
import { useMemo } from "react";
import SearchInput from "@/components/searchInput/searchInput";
import DropdownMenu from "@/components/clients/dropdownMenu/dropdownMenu";
import DeleteOrder from "@/components/orders/deleteOrder/deleteOrder";
import { useRouter } from "next/navigation";
import DropdownState from "@/components/orders/dropdownState/dropdownState";

export default function Orders() {
  const [fetchingMonitor, setFetchingMonitor] = useState(true);
  const [ordersArr, setOrdersArr] = useState<Order[]>([]);
  const [sortByLastDate, setSortByLastDate] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [confirmOrderDelete, setConfirmOrderDelete] = useState<Order | false>(
    false
  );
  const router = useRouter();

  const fetchOrders = async () => {
    setFetchingMonitor(true);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append("page", page.toString());
      searchParams.append("pageSize", pageSize.toString());
      searchParams.append("sortByLastDate", sortByLastDate.toString());
      searchParams.append("keyword", keyword); // Añadir el keyword a los parámetros de búsqueda

      const res = await fetch(`/api/order?${searchParams.toString()}`, {
        method: "GET",
      });

      const resData = await res.json();
      if (
        resData.keyword === keyword &&
        resData.page === page &&
        resData.sortByLastDate === sortByLastDate
      ) {
        setOrdersArr(resData.orders);
        setTotalCount(resData.totalCount);
        setPageCount(Math.ceil(resData.totalCount / pageSize));
        setFetchingMonitor(false);
      }
    } catch (error) {
      setFetchingMonitor(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, sortByLastDate]);
  useEffect(() => {
    fetchOrders();
  }, []);

  const usePagination = ({
    totalCount,
    pageSize,
    siblingCount = 1,
    currentPage,
  }: {
    totalCount: number;
    pageSize: number;
    siblingCount: number;
    currentPage: number;
  }) => {
    const paginationRange = useMemo(() => {
      const totalPageCount = Math.ceil(totalCount / pageSize);
      const totalPageNumbers = siblingCount + 5;

      if (totalPageNumbers >= totalPageCount) {
        return Array.from({ length: totalPageCount }, (_, index) => index + 1);
      }

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(
        currentPage + siblingCount,
        totalPageCount
      );

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

      const firstPageIndex = 1;
      const lastPageIndex = totalPageCount;

      if (!shouldShowLeftDots && !shouldShowRightDots) {
        return Array.from({ length: totalPageCount }, (_, index) => index + 1);
      }

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftRange = Array.from(
          { length: 3 + 2 * siblingCount },
          (_, index) => index + 1
        );
        return [...leftRange, "...", totalPageCount];
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightRangeLength = 3 + 2 * siblingCount;
        const rightRange = Array.from(
          { length: rightRangeLength },
          (_, index) => totalPageCount - rightRangeLength + index + 1
        );
        return [firstPageIndex, "...", ...rightRange];
      }

      if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, index) => leftSiblingIndex + index
        );
        return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
      }
    }, [totalCount, pageSize, siblingCount, currentPage]);

    return paginationRange;
  };

  const paginationRange = usePagination({
    totalCount,
    pageSize,
    siblingCount: 3,
    currentPage: page,
  });

  const fetchDeleteOrder = async () => {
    setFetchingMonitor(true);
    setOrdersArr([]);

    try {
      const searchParams = new URLSearchParams();

      searchParams.append("id", (confirmOrderDelete as Order)._id!);

      const res = await fetch(`/api/order?${searchParams.toString()}`, {
        method: "DELETE",
      });

      const resData = await res.json();
      fetchOrders();
    } catch (error) {
      fetchOrders();
    }
  };

  const updateOrderState = (
    orderId?: string,
    newState?:
      | "Asignada"
      | "Revisión"
      | "Reparada"
      | "Rechazada"
      | "Sin Solución"
      | "Entregado"
      | undefined
  ) => {
    if (orderId)
      setOrdersArr((prevOrders) =>
        prevOrders.map((order) => {
          const result =
            order._id === orderId ? { ...order, estado: newState } : order;
          return result;
        })
      );
  };

  return (
    <main className={styles.main}>
      {confirmOrderDelete && (
        <DeleteOrder
          handleSubmit={() => {
            setConfirmOrderDelete(false);
            fetchDeleteOrder();
          }}
          orderData={confirmOrderDelete}
          cancel={() => setConfirmOrderDelete(false)}
        />
      )}
      <div className={styles.top}>
        <h3>Órdenes</h3>
        <Link className={styles.addOrderBtn} href={"/orders/create"}>
          <button>Crear Orden</button>
        </Link>
      </div>
      <div className={styles.tableOutside}>
        <SearchInput
          input={keyword}
          setInput={setKeyword}
          action={() => {
            if (page === 1) fetchOrders();
            else {
              setPage(1);
              setPageCount(1);
            }
          }}
          placeholder="Orden, Cliente, Modelo, Marca"
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
                  <div>Orden</div>
                </th>
                <th>
                  <div>Estado</div>
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
                      <path
                        d="M4 8H13"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                      <path
                        d="M6 13H13"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                      <path
                        d="M8 18H13"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                      <path
                        d="M17 20V4L20 8"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                </th>
                <th>
                  <div>Cliente</div>
                </th>
                <th>
                  <div>Equipo</div>
                </th>
              </tr>
            </thead>
            <tbody id="evaluationListBody" className={styles.tbody}>
              {fetchingMonitor
                ? null
                : ordersArr.length > 0 &&
                  ordersArr.map((item, i) => (
                    <tr key={`${item._id}`} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.td1}>
                          <DropdownMenu
                            dropdownHeight={120}
                            options={[
                              {
                                text: "Borrar",
                                function: () => {
                                  setConfirmOrderDelete(item);
                                },
                              },
                              {
                                text: "Editar",
                                function: () => {},
                                element: (
                                  <Link
                                    style={{
                                      height: "40px",
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                      padding: "0 16px",
                                    }}
                                    href={`/orders/edit/${item._id}`}
                                  >
                                    Editar
                                  </Link>
                                ),
                              },
                              {
                                text: "Imprimir",
                                function: () => {},
                              },
                            ]}
                          />
                          <p>{item._id}</p>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div>
                          <DropdownState
                            options={[
                              {
                                text: "Asignada",
                                function: () =>
                                  updateOrderState(item._id, "Asignada"),
                                element: (
                                  <>
                                    <div
                                      className={styles.stateColorBox}
                                      style={{
                                        backgroundColor:
                                          "var(--color-asignada)",
                                      }}
                                    ></div>
                                    Asignada
                                  </>
                                ),
                              },
                              {
                                text: "Revisión",
                                function: () =>
                                  updateOrderState(item._id, "Revisión"),
                                element: (
                                  <>
                                    <div
                                      className={styles.stateColorBox}
                                      style={{
                                        backgroundColor:
                                          "var(--color-revision)",
                                      }}
                                    ></div>
                                    Revisión
                                  </>
                                ),
                              },
                              {
                                text: "Reparada",
                                function: () =>
                                  updateOrderState(item._id, "Reparada"),
                                element: (
                                  <>
                                    <div
                                      className={styles.stateColorBox}
                                      style={{
                                        backgroundColor:
                                          "var(--color-reparada)",
                                      }}
                                    ></div>
                                    Reparada
                                  </>
                                ),
                              },
                              {
                                text: "Rechazada",
                                function: () =>
                                  updateOrderState(item._id, "Rechazada"),
                                element: (
                                  <>
                                    <div
                                      className={styles.stateColorBox}
                                      style={{
                                        backgroundColor:
                                          "var(--color-rechazada)",
                                      }}
                                    ></div>
                                    Rechazada
                                  </>
                                ),
                              },
                              {
                                text: "Sin Solución",
                                function: () =>
                                  updateOrderState(item._id, "Sin Solución"),
                                element: (
                                  <>
                                    <div
                                      className={styles.stateColorBox}
                                      style={{
                                        backgroundColor:
                                          "var(--color-sin-solucion)",
                                      }}
                                    ></div>
                                    Sin Solución
                                  </>
                                ),
                              },
                              {
                                text: "Entregado",
                                function: () =>
                                  updateOrderState(item._id, "Entregado"),
                                element: (
                                  <>
                                    <div
                                      className={styles.stateColorBox}
                                      style={{
                                        backgroundColor:
                                          "var(--color-entregado)",
                                      }}
                                    ></div>
                                    Entregado
                                  </>
                                ),
                              },
                            ]}
                            stateSelected={
                              <>
                                <div
                                  className={`${styles.stateColorBox} ${styles.stateSelectedColorBox}`}
                                  style={{
                                    backgroundColor:
                                      item.estado === "Asignada"
                                        ? "var(--color-asignada)"
                                        : item.estado === "Revisión"
                                        ? "var(--color-revision)"
                                        : item.estado === "Reparada"
                                        ? "var(--color-reparada)"
                                        : item.estado === "Rechazada"
                                        ? "var(--color-rechazada)"
                                        : item.estado === "Sin Solución"
                                        ? "var(--color-sin-solucion)"
                                        : item.estado === undefined
                                        ? "var(--color-sin-asignar)" // Color para Sin Asignar
                                        : "var(--color-entregado)",
                                  }}
                                ></div>
                                {item.estado || "Sin asignar"}
                              </>
                            }
                          />
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div>
                          <p>{formatDate(item.createdAt)}</p>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div>
                          <p>{item.cliente?.fullName || "Sin Cliente"}</p>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div>
                          <p>{`${item.modelo} ${item.marca}`}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
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

        {paginationRange &&
          paginationRange.map((pageNumber, index) => {
            if (pageNumber === "...") {
              return (
                <div
                  key={index}
                  className={`${styles.page} ${styles.ellipsis}`}
                >
                  ...
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`${styles.page} ${
                  page === pageNumber ? styles.selected : ""
                }`}
                onClick={() => setPage(Number(pageNumber))}
              >
                {pageNumber}
              </div>
            );
          })}
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
