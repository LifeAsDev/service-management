"use client";
import Client from "@/models/client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import Order from "@/models/order";
import {
  formatPhone,
  formatRut,
} from "@/components/clients/createClient/clientForm/clientForm";

export default function SetOrderClientForm({
  setClientErrors,
  clientErrors,
  setClientSelected,
  clientSelected,
  errors,
}: {
  setClientErrors: Dispatch<
    SetStateAction<Partial<Record<keyof Client | "cliente", string>>>
  >;
  clientErrors: Partial<Record<keyof Client | "cliente", string>>;
  setClientSelected: Dispatch<SetStateAction<Client | false>>;
  clientSelected: Client | false;
  errors: {
    [K in keyof Omit<Order, "_id" | "createdAt" | "cliente">]?: string;
  };
}) {
  const [clientData, setClientData] = useState<Client>(
    clientSelected || {
      fullName: "",
      numero: "",
      correo: "",
      direccion: "",
      id: "",
      notas: "",
    }
  );
  const [isHidden, setIsHidden] = useState(true); // Estado para controlar la visibilidad

  const [fetchingMonitor, setFetchingMonitor] = useState(true);
  const [clientsArr, setClientsArr] = useState<Client[]>([]);

  const [creatingClient, setCreatingClient] = useState(false);

  useEffect(() => {
    const container = document.getElementById("setOrderClientForm");
    if (container) {
      // Si está oculto, colapsa la altura a 0, si no, ajusta la altura a "auto"
      container.style.height = isHidden ? "0" : `417px`;
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

  const handleSetClient = (item: Client) => {
    setIsHidden(true);
    setClientData(item);
    setClientSelected(item);
  };
  const handleClearClient = () => {
    setClientSelected(false);
    setClientData({
      fullName: "",
      numero: "",
      correo: "",
      direccion: "",
      id: "",
      notas: "",
    });
  };

  const handleSubmit = async () => {
    setClientErrors({});

    const newErrors: Partial<Record<keyof Omit<Client, "_id">, string>> = {};
    Object.entries(clientData).forEach(([key, value]) => {
      if (["fullName"].includes(key) && value.trim() === "") {
        newErrors[key as keyof Omit<Client, "_id">] =
          "Este campo es obligatorio.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      return;
    }
    setCreatingClient(true);

    // Definir el método (POST o PATCH) según si clientFetch es falsy o truthy
    const method = "POST";
    const endpoint = "/api/client";

    try {
      const data = new FormData();
      Object.entries(clientData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Hacer la solicitud con POST o PATCH
      const response = await fetch(endpoint, {
        method,
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`"Client created":`, result.client);
        setClientData(result.client);
        setClientSelected(result.client);
        setCreatingClient(false);
        setIsHidden(true);
      } else {
        console.error("Error:", result.message);
        setCreatingClient(false);
        setClientErrors(result.errors);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setCreatingClient(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === "id") {
      value = formatRut(value);
    }
    if (name === "numero") {
      value = formatPhone(value);
    }
    setClientData((prevClientData) => ({
      ...prevClientData,
      [name]: value, // Actualiza el campo correspondiente con el valor del input
    }));
  };
  return (
    <div className={styles.setOrderClientForm}>
      <h3>Cliente</h3>
      {clientSelected ? (
        <>
          <ul className={styles.clientSelectedUl}>
            <li>
              <p className={styles.clientLabel}>Nombre</p>
              <p className={styles.clientData}>{clientData.fullName}</p>
            </li>
            <li>
              <p className={styles.clientLabel}>RUT</p>
              <p className={styles.clientData}>{clientData.id}</p>
            </li>
            <li>
              <p className={styles.clientLabel}>Correo</p>
              <p className={styles.clientData}>{clientData.correo}</p>
            </li>
            <li>
              <p className={styles.clientLabel}>Direccion</p>
              <p className={styles.clientData}>{clientData.direccion}</p>
            </li>
          </ul>
          <svg
            onClick={handleClearClient}
            className={styles.closeBtn}
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            fill="var(--light-grayish-blue)"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fill="var(--light-grayish-blue)"
                d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
              ></path>
            </g>
          </svg>
        </>
      ) : (
        <div className={styles.inputGroup}>
          {clientErrors.cliente && (
            <p className={styles.errorText}>{clientErrors.cliente}</p>
          )}
          <label htmlFor="fullName" className={styles.label}>
            Nombre completo:
          </label>
          <input
            onBlur={() => {
              setClientErrors({});
            }}
            disabled={creatingClient}
            type="text"
            id="fullName"
            name="fullName"
            value={clientData.fullName}
            onChange={handleChange}
            className={`${styles.input} ${
              clientErrors.fullName || clientErrors.cliente
                ? styles.errorInput
                : ""
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
                            handleSetClient(item);
                          }}
                          key={item._id}
                        >
                          {item.fullName}
                          <span className={styles.clientId}>{item.id}</span>
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
      )}
      <p
        onClick={() => {
          setIsHidden(!isHidden);
          setClientSelected(false);
        }}
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
      <div
        style={{ height: 0 }}
        id="setOrderClientForm"
        className={styles.collapsibleContent}
      >
        <div className={styles.inputGroup}>
          <label htmlFor="id" className={styles.label}>
            RUT:
          </label>
          <input
            onBlur={() => {
              setClientErrors({});
            }}
            disabled={creatingClient}
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
            Número de telefono:
          </label>
          <input
            onBlur={() => {
              setClientErrors({});
            }}
            disabled={creatingClient}
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
            onBlur={() => {
              setClientErrors({});
            }}
            disabled={creatingClient}
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
            onBlur={() => {
              setClientErrors({});
            }}
            disabled={creatingClient}
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
            onBlur={() => {
              setClientErrors({});
            }}
            disabled={creatingClient}
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
          disabled={creatingClient}
          onClick={handleSubmit}
          className={`${styles.button} ${
            creatingClient && styles.creatingClient
          }`}
        >
          {!creatingClient ? "Crear" : <div className="loader"></div>}
        </button>
      </div>
    </div>
  );
}
