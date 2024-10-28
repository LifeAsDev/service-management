"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import Attribute, { InputTypeOptions } from "@/models/attribute";

export default function AttributeForm({
  attributeFetch,
}: {
  attributeFetch?: Attribute;
}) {
  const [attributeData, setAttributeData] = useState<Attribute>(
    attributeFetch || {
      name: "",
      inputType: undefined,
    }
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof Omit<Attribute, "_id">, string>>
  >({});
  const [creatingAttribute, setCreatingAttribute] = useState(false);
  const router = useRouter();

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAttributeData({
      ...attributeData,
      [name]: value,
    });

    // Limpiar errores cuando el usuario escribe
    if (value.trim() !== "") {
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log({ attributeData });
    e.preventDefault();
    const newErrors: Partial<Record<keyof Omit<Attribute, "_id">, string>> = {};
    Object.entries(attributeData).forEach(([key, value]) => {
      if (
        ["name", "inputType"].includes(key) &&
        (!value || value.trim() === "")
      ) {
        newErrors[key as keyof Omit<Attribute, "_id">] =
          "Este campo es obligatorio.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setCreatingAttribute(true);

    // Definir el método (POST o PATCH) según si attributeFetch es falsy o truthy
    const method = attributeFetch ? "PATCH" : "POST";
    const endpoint = attributeFetch
      ? `/api/attribute/${attributeFetch._id}`
      : "/api/attribute";

    try {
      const data = new FormData();
      Object.entries(attributeData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Hacer la solicitud con POST o PATCH
      const response = await fetch(endpoint, {
        method,
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/attributes`);
      } else {
        console.error("Error:", result.message);
        setCreatingAttribute(false);
        setErrors(result.errors);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <button
        disabled={creatingAttribute}
        onClick={handleSubmit}
        type="submit"
        className={`${styles.button} ${
          creatingAttribute && styles.creatingAttribute
        }`}
      >
        {!creatingAttribute ? (
          <>{attributeFetch ? "Guardar" : "Crear"}</>
        ) : (
          <div className="loader"></div>
        )}
      </button>
      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>
            Nombre:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={attributeData.name}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.name ? styles.errorInput : ""
            }`}
            onFocus={() => setErrors({})}
          />
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="inputType" className={styles.label}>
            Entrada:
          </label>
          <select
            className={`${errors.inputType && styles.errorSelect}`}
            name="inputType"
            value={attributeData.inputType}
            onChange={(e) => handleChange(e)}
            onFocus={() => setErrors({})}
          >
            <option value="">Seleccione una opción</option>
            {InputTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.inputType && (
            <p className={styles.errorText}>{errors.inputType}</p>
          )}
        </div>
      </form>
    </>
  );
}
