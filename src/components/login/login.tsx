"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import { signIn } from "next-auth/react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [errorSignIn, setErrorSignIn] = useState(false);

  const handleLogin = () => {
    setErrorSignIn(false);
    setLoadingSignIn(true);

    const fetchLogin = async () => {
      try {
        const res = await signIn("credentials", {
          password: password,
          username: username,
          redirect: false,
        });

        if (res?.ok) {
          console.log("yo");
          window.location.reload(); // Recarga la página en caso de éxito
        } else {
          setErrorSignIn(true); // Muestra error en caso de fallo
          setLoadingSignIn(false);
        }
      } catch (error) {
        setErrorSignIn(true); // Muestra error en caso de fallo
        setLoadingSignIn(false);
      }
    };
    fetchLogin();
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Iniciar Sesión</h1>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrorSignIn(false);
            }}
            placeholder="username"
            disabled={loadingSignIn} // Deshabilita el input mientras carga
            onFocus={() => {
              setErrorSignIn(false);
            }}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorSignIn(false);
            }}
            placeholder="contraseña"
            disabled={loadingSignIn} // Deshabilita el input mientras carga
            onFocus={() => {
              setErrorSignIn(false);
            }}
          />
        </div>
        {errorSignIn && (
          <p className={styles.error}>Username/Contraseña incorrecto.</p>
        )}
        <button
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={loadingSignIn} // Deshabilita el botón mientras carga
        >
          {loadingSignIn ? <div className={`loader`}></div> : "Iniciar Sesión"}
        </button>
      </div>
    </main>
  );
}
