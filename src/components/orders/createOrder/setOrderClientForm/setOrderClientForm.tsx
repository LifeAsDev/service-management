"use client";
import Client from "@/models/client";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export default function SetOrderClientForm() {
  const [isHidden, setIsHidden] = useState(false); // Estado para controlar la visibilidad
  const collapsibleRef = useRef<HTMLDivElement>(null);
  const [clientData, setClientData] = useState<Client>({
    fullName: "",
    numero: "",
    correo: "",
    direccion: "",
    id: "",
    notas: "",
  });
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof Client, string>>
  >({});
  const [fetchingMonitor, setFetchingMonitor] = useState(true);
  const [clientsArr, setClientsArr] = useState<Client[]>([]);

  const [creatingOrder, setCreatingOrder] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (Object.keys(clientData).includes(name)) {
      setClientData({
        ...clientData,
        [name]: value,
      });

      if (value.trim() !== "") {
        setClientErrors({ ...clientErrors, [name]: undefined });
      }
    }
  };
  useEffect(() => {
    const container = document.getElementById("setOrderClientForm");
    if (container) {
      // Si está oculto, colapsa la altura a 0, si no, ajusta la altura a "auto"
      container.style.height = isHidden
        ? "200px"
        : `${container.scrollHeight}px`;
    }
  }, [isHidden]);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const searchParams = new URLSearchParams();

        searchParams.append("keyword", clientData.fullName);
        const res = await fetch(
          `/api/client/search?${searchParams.toString()}`,
          {
            method: "GET",
          }
        );

        const resData = await res.json();
        if (res.ok) {
          if (clientData.fullName === resData.keyword) {
            setFetchingMonitor(false);
            setClientsArr(resData.clients);
          }
        }
      } catch (error) {}
    };
    setFetchingMonitor(true);
    fetchClients();
  }, [clientData.fullName]);

  return (
    <div id="setOrderClientForm" className={styles.setOrderClientForm}>
      <h3>Cliente</h3>
      <div className={styles.inputGroup}>
        <label htmlFor="fullName" className={styles.label}>
          Nombre completo:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="fullName"
          name="fullName"
          value={clientData.fullName}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.fullName ? styles.errorInput : ""
          }`}
          onFocus={() => {
            setClientErrors({});
          }}
        />
        {clientErrors.fullName && (
          <p className={styles.errorText}>{clientErrors.fullName}</p>
        )}
        <ul className={styles.clientsList}>
          {fetchingMonitor ? (
            <li className={styles.infoSearchFetch}>Buscando...</li>
          ) : (
            <>
              {clientsArr.length > 0 ? (
                <>
                  {clientsArr.map((item) => {
                    return (
                      <li
                        onMouseDown={() => {
                          setClientData(item);
                        }}
                        key={item._id}
                      >
                        {item.fullName} {item.id}
                      </li>
                    );
                  })}
                </>
              ) : (
                <li className={styles.infoSearchFetch}>
                  No se encontraron clientes.
                </li>
              )}
            </>
          )}
        </ul>
      </div>
      <p
        onClick={() => setIsHidden(!isHidden)}
        className={styles.toggleClientFields}
      >
        {isHidden ? "Crear nuevo cliente" : "Ocultar"}
        <svg
          className={`${isHidden && styles.rotate180}`}
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
              d="M7 10L12 15L17 10"
              stroke="#cacde8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
      </p>
      <div className={styles.inputGroup}>
        <label htmlFor="id" className={styles.label}>
          ID:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="id"
          name="id"
          value={clientData.id}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.id ? styles.errorInput : ""
          }`}
          onFocus={() => setClientErrors({})}
        />
        {clientErrors.id && (
          <p className={styles.errorText}>{clientErrors.id}</p>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="numero" className={styles.label}>
          Número:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="numero"
          name="numero"
          value={clientData.numero}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.numero ? styles.errorInput : ""
          }`}
          onFocus={() => setClientErrors({})}
        />
        {clientErrors.numero && (
          <p className={styles.errorText}>{clientErrors.numero}</p>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="correo" className={styles.label}>
          Correo:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="correo"
          name="correo"
          value={clientData.correo}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.correo ? styles.errorInput : ""
          }`}
          onFocus={() => setClientErrors({})}
        />
        {clientErrors.correo && (
          <p className={styles.errorText}>{clientErrors.correo}</p>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="direccion" className={styles.label}>
          Dirección:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="direccion"
          name="direccion"
          value={clientData.direccion}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.direccion ? styles.errorInput : ""
          }`}
          onFocus={() => setClientErrors({})}
        />
        {clientErrors.direccion && (
          <p className={styles.errorText}>{clientErrors.direccion}</p>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="notas" className={styles.label}>
          Notas:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="notas"
          name="notas"
          value={clientData.notas}
          onChange={handleChange}
          className={`${styles.input} ${
            clientErrors.notas ? styles.errorInput : ""
          }`}
          onFocus={() => setClientErrors({})}
        />
        {clientErrors.notas && (
          <p className={styles.errorText}>{clientErrors.notas}</p>
        )}
      </div>
      <button
        disabled={creatingOrder}
        onClick={() => {}}
        className={`${styles.button} ${creatingOrder && styles.creatingClient}`}
      >
        {!creatingOrder ? "Crear" : <div className="loader"></div>}
      </button>
    </div>
  );
}
