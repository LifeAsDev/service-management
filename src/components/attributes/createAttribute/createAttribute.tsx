"use client";

import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Attribute from "@/models/attribute";
import AttributeForm from "@/components/attributes/createAttribute/attributeForm/attributeForm";

export default function CreateAttribute({ id }: { id?: string }) {
  const [attributeFetch, setAttributeFetch] = useState<Attribute | null>(null);
  const router = useRouter();

  const fetchDeleteClient = async () => {
    try {
      const searchParams = new URLSearchParams();

      searchParams.append("id", id!);

      const res = await fetch(`/api/attribute?${searchParams.toString()}`, {
        method: "DELETE",
      });

      const resData = await res.json();
      router.push(`/attributes`);
    } catch (error) {
      router.push(`/attributes`);
    }
  };
  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return; // Asegúrate de que exista el id

      try {
        // Realiza la petición a la API con el id
        const res = await fetch(`/api/attribute/${id}`, {
          method: "GET",
        });

        const resData = await res.json();

        // Asegúrate de que se reciban datos válidos antes de actualizar el estado
        if (res.ok) {
          setAttributeFetch(resData.client);
        } else {
          router.push(`/attributes`);
        }
      } catch (error) {
        router.push(`/attributes`);
        setAttributeFetch(null);
      }
    };

    fetchClient();
  }, [id]);

  if (id && !attributeFetch) {
    return <main className={styles.main}></main>;
  }

  return (
    <main className={styles.main}>
      {id && (
        <button
          onClick={fetchDeleteClient}
          className={`${styles.button} ${styles.deleteBtn}`}
        >
          Borrar
        </button>
      )}
      <h2>{id ? "Editar Entrada" : "Crear Entrada"}</h2>
      <AttributeForm
        attributeFetch={id && attributeFetch ? attributeFetch : undefined}
      />
    </main>
  );
}
