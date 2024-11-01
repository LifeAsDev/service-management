import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import Order from "@/models/order";

export default function OrderForm({
  creatingOrder,
  handleChange,
  orderData,
  setErrors,
  errors,
}: {
  creatingOrder: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  orderData: Order;
  setErrors: Dispatch<
    SetStateAction<{
      [K in keyof Omit<Order, "_id" | "createdAt" | "cliente">]?: string;
    }>
  >;
  errors: {
    [K in keyof Omit<Order, "_id" | "createdAt" | "cliente">]?: string;
  };
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const activeFieldRef = useRef<string | null>(null); // Use useRef to track activeField

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] =
    useState<number>(-1);
  const [activeField, setActiveField] = useState<
    "marca" | "modelo" | "tipo" | null
  >(null);

  const fetchSuggestions = async (
    field: "marca" | "modelo" | "tipo",
    keyword: string
  ) => {
    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);

    const response = await fetch(
      `/api/attribute?inputType=${capitalizedField}&pageSize=5&keyword=${keyword}`
    );
    const suggestions = await response.json();
    setFilteredSuggestions(
      suggestions.attributes.map((item: { name: string }) => item.name)
    );
  };

  const handleAutocomplete = (
    field: "marca" | "modelo" | "tipo",
    value: string
  ) => {
    fetchSuggestions(field, value);
    setActiveField(field);
  };

  const handleSuggestionClick = (
    field: "marca" | "modelo" | "tipo",
    suggestion: string
  ) => {
    handleChange({
      target: { name: field, value: suggestion },
    } as React.ChangeEvent<HTMLInputElement>);
    setFilteredSuggestions([]);
    setActiveField(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredSuggestions.length) {
      if (event.key === "ArrowDown") {
        setActiveSuggestionIndex(
          (prevIndex) => (prevIndex + 1) % filteredSuggestions.length
        );
      } else if (event.key === "ArrowUp") {
        setActiveSuggestionIndex((prevIndex) =>
          prevIndex === 0 ? filteredSuggestions.length - 1 : prevIndex - 1
        );
      } else if (event.key === "Enter" && activeSuggestionIndex >= 0) {
        handleSuggestionClick(
          activeField as "marca" | "modelo" | "tipo",
          filteredSuggestions[activeSuggestionIndex]
        );
        setActiveSuggestionIndex(-1);
      }
    }
  };

  return (
    <form className={styles.form} ref={formRef}>
      <h3>Servicio</h3>
      {(["marca", "modelo", "tipo"] as const).map((field) => (
        <div className={styles.inputGroup} key={field}>
          <label htmlFor={field} className={styles.label}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
          </label>
          <input
            disabled={creatingOrder}
            type="text"
            id={field}
            name={field}
            value={orderData[field]}
            onChange={(e) => {
              handleChange(e);
              handleAutocomplete(field, e.target.value);
            }}
            className={`${styles.input} ${
              errors[field] ? styles.errorInput : ""
            }`}
            onFocus={() => {
              setErrors({});
              setActiveField(field);
              handleAutocomplete(field, orderData[field]);
              setFilteredSuggestions([]);
              activeFieldRef.current = field; // Set the activeField in the ref
            }}
            onBlur={() => {
              setTimeout(() => {
                // Use the ref value to determine if the suggestions should close
                if (activeFieldRef.current === field) {
                  setFilteredSuggestions([]);
                  setActiveField(null);
                  activeFieldRef.current = null; // Reset the activeField
                }
              }, 100);
            }}
            onKeyDown={handleKeyDown}
          />
          {errors[field] && <p className={styles.errorText}>{errors[field]}</p>}
          {/* Renderizar las sugerencias si el campo está activo */}
          {activeField === field && filteredSuggestions.length > -1 && (
            <ul className={styles.suggestions}>
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  onClick={() => handleSuggestionClick(field, suggestion)}
                  className={`${styles.suggestionItem} ${
                    index === activeSuggestionIndex
                      ? styles.activeSuggestion
                      : ""
                  }`}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <div className={styles.inputGroup}>
        <label htmlFor="numeroDeSerie" className={styles.label}>
          Número de Serie:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="numeroDeSerie"
          name="numeroDeSerie"
          value={orderData.numeroDeSerie}
          onChange={handleChange}
          className={`${styles.input} ${
            errors.numeroDeSerie ? styles.errorInput : ""
          }`}
          onFocus={() => setErrors({})}
        />
        {errors.numeroDeSerie && (
          <p className={styles.errorText}>{errors.numeroDeSerie}</p>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="contraseña" className={styles.label}>
          Contraseña:
        </label>
        <input
          disabled={creatingOrder}
          type="text"
          id="contraseña"
          name="contraseña"
          value={orderData.contraseña}
          onChange={handleChange}
          className={`${styles.input} ${
            errors.contraseña ? styles.errorInput : ""
          }`}
          onFocus={() => setErrors({})}
        />
        {errors.contraseña && (
          <p className={styles.errorText}>{errors.contraseña}</p>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="observacion" className={styles.label}>
          Observacion:
        </label>
        <textarea
          disabled={creatingOrder}
          id="observacion"
          name="observacion"
          value={orderData.observacion}
          onChange={handleChange}
          className={`${styles.input} ${
            errors.observacion ? styles.errorInput : ""
          }`}
          onFocus={() => setErrors({})}
        />
        {errors.observacion && (
          <p className={styles.errorText}>{errors.observacion}</p>
        )}
      </div>
    </form>
  );
}
