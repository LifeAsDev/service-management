"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useOnboardingContext } from "@/lib/context";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userFetch, setUserFetch] = useState(false);
  const [role, setRole] = useState<string>("Admin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session } = useOnboardingContext();
  const [disableAdmin, setDisableAdmin] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const searchParams = new URLSearchParams();

        const res = await fetch(
          `/api/user/${session._id}?${searchParams.toString()}`,
          {
            method: "GET",
          }
        );

        const resData = await res.json();
        setUsername(resData.user.username);
        if (resData.user.role) {
          setRole(resData.user.role);
          if (resData.user.role === "Admin") {
            setDisableAdmin(false);
          }
        }
        console.log(resData.user.role);
        setUserFetch(true);
      } catch (error) {
        router.push(`/`);
      }
    };
    if (!userFetch && session && session._id) {
      fetchUser();
    }
  }, [userFetch, session]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    data.append("role", role);

    try {
      const res = await fetch(`/api/user/${session._id}`, {
        method: "PATCH",
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar el perfil");
      }

      const updatedUser = await res.json();
      setError("Ok");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (userFetch)
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Editar Perfil</h1>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="update-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              autoComplete="new-password"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="update-password">Contraseña</label>
            <input
              type="password"
              id="update-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="contraseña"
              autoComplete="new-password"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Rol</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  disabled={disableAdmin}
                  type="radio"
                  name="role"
                  value="Admin"
                  checked={role === "Admin"}
                  onChange={handleRoleChange}
                />
                Admin
              </label>
              <label>
                <input
                  disabled={disableAdmin}
                  type="radio"
                  name="role"
                  value="Empleado"
                  checked={role === "Empleado"}
                  onChange={handleRoleChange}
                />
                Empleado
              </label>
            </div>
          </div>
          <button
            className={styles.loginButton}
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? <div className={`loader`}></div> : "Actualizar"}
          </button>
          {error && error !== "Ok" && <p className={styles.error}>{error}</p>}{" "}
          {error === "Ok" && (
            <p className={styles.good}>Actualizado correctamente</p>
          )}
        </div>
      </main>
    );
  return <main className={styles.main}></main>;
}
