"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useOnboardingContext } from "@/lib/context";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userFetch, setUserFetch] = useState(false);
  const router = useRouter();
  const { session } = useOnboardingContext();

  useEffect(() => {
    const fetchOrders = async () => {
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
        setUserFetch(true);
      } catch (error) {
        router.push(`/`);
      }
    };
    if (!userFetch && session && session._id) {
      fetchOrders();
    }
  }, [userFetch, session]);

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
              onChange={(e) => {
                setUsername(e.target.value);
                /*               setErrorSignIn(false);
                 */
              }}
              placeholder="username"
              /*             disabled={loadingSignIn} // Deshabilita el input mientras carga
               */ onFocus={() => {
                /*               setErrorSignIn(false);
                 */
              }}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="update-password">Contraseña</label>
            <input
              type="password"
              id="update-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                /*               setErrorSignIn(false);
                 */
              }}
              placeholder="contraseña"
              /*             disabled={loadingSignIn} // Deshabilita el input mientras carga
               */ onFocus={() => {
                /*               setErrorSignIn(false);
                 */
              }}
              autoComplete="new-password"
            />
          </div>
          {/*  {errorSignIn && (
          <p className={styles.error}>Username/Contraseña incorrecto.</p>
        )} */}
          <button
            className={styles.loginButton}
            /*     onClick={handleLogin}
          disabled={loadingSignIn} // Deshabilita el botón mientras carga */
          >
            {/*           {loadingSignIn ? <div className={`loader`}></div> : "Iniciar Sesión"}
             */}
            Actualizar
          </button>
        </div>
      </main>
    );
  return <main className={styles.main}></main>;
}
