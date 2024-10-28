"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import SearchInput from "@/components/searchInput/searchInput";
import { useMemo } from "react";
import DropdownMenu from "@/components/clients/dropdownMenu/dropdownMenu";
import { useRouter } from "next/navigation";
import Attribute, {
  InputTypeOptions,
  InputTypeOptionsType,
} from "@/models/attribute";
import DeleteAttribute from "@/components/attributes/deleteAttribute/deleteAttribute";
import { formatDate } from "@/lib/calculationFunctions";

export default function Attributes() {
  const [fetchingMonitor, setFetchingMonitor] = useState(true);
  const [attributesArr, setAttributesArr] = useState<Attribute[]>([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [confirmAttributeDelete, setConfirmAttributeDelete] = useState<
    Attribute | false
  >(false);
  const router = useRouter();
  const [sortByLastDate, setSortByLastDate] = useState(true);
  const [filterByInputType, setFilterByInputType] = useState<
    InputTypeOptionsType | "Todos"
  >("Todos");

  const fetchClients = async () => {
    setFetchingMonitor(true);

    try {
      const searchParams = new URLSearchParams();

      searchParams.append("keyword", keyword);
      searchParams.append("page", page.toString());
      searchParams.append("pageSize", pageSize.toString());
      searchParams.append("sortByLastDate", sortByLastDate.toString());
      searchParams.append("inputType", filterByInputType);

      const res = await fetch(`/api/attribute?${searchParams.toString()}`, {
        method: "GET",
      });

      const resData = await res.json();
      if (
        resData.keyword === keyword &&
        resData.page === page &&
        resData.sortByLastDate === sortByLastDate &&
        resData.inputType === filterByInputType
      ) {
        setPageCount(Math.ceil(resData.totalCount / pageSize));
        setTotalCount(resData.totalCount);

        setFetchingMonitor(false);
        setAttributesArr(resData.attributes);
      }
    } catch (error) {
      setFetchingMonitor(false);
      setAttributesArr([]);
    }
  };
  useEffect(() => {
    fetchClients();
  }, [page, sortByLastDate, filterByInputType]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchDeleteClient = async () => {
    setFetchingMonitor(true);
    setAttributesArr([]);

    try {
      const searchParams = new URLSearchParams();

      searchParams.append("id", (confirmAttributeDelete as Attribute)._id!);

      const res = await fetch(`/api/attribute?${searchParams.toString()}`, {
        method: "DELETE",
      });

      const resData = await res.json();
      fetchClients();
    } catch (error) {
      fetchClients();
    }
  };

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

      // Definir el rango de los números de página
      const totalPageNumbers = siblingCount + 5;

      /*
      Caso 1:
      Si el número de páginas es menor que el rango definido, devolvemos un array con todas las páginas.
    */
      if (totalPageNumbers >= totalPageCount) {
        return Array.from({ length: totalPageCount }, (_, index) => index + 1);
      }

      /*
      Calcular las posiciones de las páginas inicial y final
    */
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(
        currentPage + siblingCount,
        totalPageCount
      );

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

      const firstPageIndex = 1;
      const lastPageIndex = totalPageCount;

      /*
      Caso 2:
      No mostrar puntos a la izquierda ni a la derecha del rango
    */
      if (!shouldShowLeftDots && !shouldShowRightDots) {
        const middleRange = Array.from(
          { length: totalPageCount },
          (_, index) => index + 1
        );
        return middleRange;
      }

      /*
      Caso 3:
      Mostrar puntos en el lado derecho
    */
      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftRange = Array.from(
          { length: 3 + 2 * siblingCount },
          (_, index) => index + 1
        );
        return [...leftRange, "...", totalPageCount];
      }

      /*
      Caso 4:
      Mostrar puntos en el lado izquierdo
    */
      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightRangeLength = 3 + 2 * siblingCount;
        const rightRange = Array.from(
          { length: rightRangeLength },
          (_, index) => totalPageCount - rightRangeLength + index + 1
        );
        return [firstPageIndex, "...", ...rightRange];
      }
      /*
      Caso 5:
      Mostrar puntos en ambos lados
    */
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

  return (
    <main className={styles.main}>
      {confirmAttributeDelete && (
        <DeleteAttribute
          handleSubmit={() => {
            setConfirmAttributeDelete(false);
            fetchDeleteClient();
          }}
          attributeData={confirmAttributeDelete}
          cancel={() => setConfirmAttributeDelete(false)}
        />
      )}
      <div className={styles.top}>
        <h3>Entradas</h3>
        <Link className={styles.addOrderBtn} href={"/attributes/create"}>
          <button>Crear Entrada</button>
        </Link>
      </div>
      <div className={styles.tableOutside}>
        <div className={styles.searchFilters}>
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
            placeholder="Nombre"
          />
          <select
            name="inputType"
            value={filterByInputType}
            onChange={(e) =>
              setFilterByInputType(
                e.target.value as InputTypeOptionsType | "Todos"
              )
            }
          >
            <option value="Todos">Todos</option>
            {InputTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

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
                  <div>Nombre</div>
                </th>
                <th>
                  <div>Entrada</div>
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
              </tr>
            </thead>
            <tbody id="evaluationListBody" className={styles.tbody}>
              {fetchingMonitor
                ? null
                : attributesArr.map((item, i) => (
                    <tr key={`${item._id}`} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.fullNameBox}>
                          <DropdownMenu
                            dropdownHeight={80}
                            options={[
                              {
                                text: "Borrar",
                                function: () => {
                                  setConfirmAttributeDelete(item);
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
                                    href={`/attributes/edit/${item._id}`}
                                  >
                                    Editar
                                  </Link>
                                ),
                              },
                            ]}
                          />
                          <p>{item.name}</p>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div>
                          <p>{item.inputType}</p>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div>
                          <p>{formatDate(item.createdAt)}</p>
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
