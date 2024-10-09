"use client";
import { useState } from "react";
import styles from "./styles.module.css";
export default function Profile() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Editar Perfil</h1>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              /*               setErrorSignIn(false);
               */
            }}
            placeholder="Enter your username"
            /*             disabled={loadingSignIn} // Deshabilita el input mientras carga
             */ onFocus={() => {
              /*               setErrorSignIn(false);
               */
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
              /*               setErrorSignIn(false);
               */
            }}
            placeholder="Enter your password"
            /*             disabled={loadingSignIn} // Deshabilita el input mientras carga
             */ onFocus={() => {
              /*               setErrorSignIn(false);
               */
            }}
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
}
