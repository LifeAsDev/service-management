"use client";

import ClientForm from "@/components/clients/createClient/clientForm/clientForm";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Client from "@/models/client";
import { useRouter } from "next/navigation";

export default function CreateClient({ id }: { id?: string }) {
  const [clientFetch, setClientFetch] = useState<Omit<Client, "_id"> | null>(
    null
  );
  const router = useRouter();

  const fetchDeleteClient = async () => {
    try {
      const searchParams = new URLSearchParams();

      searchParams.append("id", id!);

      const res = await fetch(`/api/client?${searchParams.toString()}`, {
        method: "DELETE",
      });

      const resData = await res.json();
      router.push(`/clients`);
    } catch (error) {
      router.push(`/clients`);
    }
  };
  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return; // Asegúrate de que exista el id

      try {
        // Realiza la petición a la API con el id
        const res = await fetch(`/api/client/${id}`, {
          method: "GET",
        });

        const resData = await res.json();

        // Asegúrate de que se reciban datos válidos antes de actualizar el estado
        if (res.ok) {
          setClientFetch(resData.client);
        } else {
          router.push(`/clients`);
        }
      } catch (error) {
        router.push(`/clients`);
        setClientFetch(null);
      }
    };

    fetchClient();
  }, [id]);

  if (id && !clientFetch) {
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
      <h2>{id ? "Editar Cliente" : "Crear Cliente"}</h2>
      <ClientForm clientFetch={id && clientFetch ? clientFetch : undefined} />
    </main>
  );
}
