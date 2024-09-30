import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./styles.module.css";
import Image from "next/image";
export default function PrintOrder() {
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  return (
    <>
      <button
        onClick={() => {
          handlePrint();
        }}
        className={styles.printBtn}
      >
        Imprimir
      </button>
      <div className={styles.printOrderMainBox} ref={contentRef}>
        <section>
          <div className={styles.business}>
            <Image
              width={100}
              height={100}
              alt="Heat Electronics logo"
              src={"/print logo.png"}
            />
            <h2>Heat Electronics</h2>
          </div>
          <div className={styles.dataBox}>
            <div className={styles.dataHeader}>
              <span>#Orden</span>
            </div>
            <ul className={styles.ul}>
              <li>
                <span>ORD-0000183</span>
              </li>
              <li>
                <span>29/09/2024 11:45:53 AM</span>
              </li>
            </ul>
          </div>
        </section>
        <section className={styles.section2}>
          <div className={styles.dataBox}>
            <div className={styles.dataHeader}>Negocio</div>
            <ul className={styles.ul}>
              <li>
                <span>Nombre:</span> Heat Electronics
              </li>
              <li>
                <span>Teléfono:</span> +56 922102147
              </li>
              <li>
                <span>Dirección:</span> Quilpue, Region de Valparaiso
              </li>
            </ul>
          </div>
          <div className={styles.dataBox}>
            <div className={styles.dataHeader}>Cliente</div>
            <ul className={styles.ul}>
              <li>
                <span>Nombre:</span> Christian Calisto
              </li>
              <li>
                <span>Teléfono:</span> 950188602
              </li>
              <li>
                <span>Correo:</span> inversionescalisto@gmail.com
              </li>
              <li>
                <span>Numero de Identificación:</span> 12.222.749-9
              </li>
              <li>
                <span>Dirección:</span> Av Los Carrera 721 , Galería el sol,
                local 42
              </li>
            </ul>
          </div>
        </section>
        <section className={styles.section3}>
          <div className={styles.dataBox}>
            <div className={styles.dataHeader}>Datos del equipo</div>
            <ul className={styles.ul}>
              <li>
                <span>Marca:</span> Christian Calisto
              </li>
              <li>
                <span>Modelo:</span> 950188602
              </li>
              <li>
                <span>Tipo:</span> inversionescalisto@gmail.com
              </li>
              <li>
                <span>Numero de serie:</span> 12.222.749-9
              </li>
            </ul>
          </div>
          <div className={styles.dataBox}>
            <div className={styles.dataHeader}>Costos</div>
            <table>
              <thead>
                <tr>
                  <th>Nota</th>
                  <th>Costo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Reparacion</td>
                  <td>$ 200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <div className={styles.totalCostBox}>
            <div className={styles.costBox}>
              <div className={styles.costBoxLeft}>Subtotal</div>
              <div className={styles.costBoxRight}>$ 230,121</div>
            </div>
            <div className={styles.costBox}>
              <div className={styles.costBoxLeft}>Impuesto%</div>
              <div className={styles.costBoxRight}>$ 30,321</div>
            </div>
            <div className={styles.costBox}>
              <div className={styles.costBoxLeft}>TOTAL</div>
              <div className={styles.costBoxRight}>$ 260,000</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
