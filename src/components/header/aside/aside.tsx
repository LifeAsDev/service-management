"use client";
import Link from "next/link";
import styles from "./styles.module.css";
import { usePathname } from "next/navigation";
import { useOnboardingContext } from "@/lib/context";

export default function Aside() {
  const { asideOpen } = useOnboardingContext();
  const currentPage = usePathname();
  if (currentPage !== "/login" && !currentPage.startsWith("/api"))
    return (
      <aside className={`${styles.aside} ${asideOpen && styles.close}`}>
        <Link
          href={"/"}
          className={`${styles.asideItem} ${
            currentPage === "/" && styles.asideSelected
          }`}
        >
          <svg
            className={styles.stroke}
            width={"28px"}
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
              {" "}
              <path
                d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z"
                stroke="#323232"
                strokeWidth="2"
              ></path>{" "}
              <path
                d="M21 9L3 9"
                stroke="#323232"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
              <path
                d="M9 21L9 9"
                stroke="#323232"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>
          <p>Inicio</p>
        </Link>
        <Link
          href={"/orders"}
          className={`${styles.asideItem} ${
            currentPage.startsWith("/orders") && styles.asideSelected
          }`}
        >
          <svg
            className={styles.nada}
            width={"28px"}
            fill="var(--light-grayish-blue)"
            viewBox="0 0 24 24"
            id="Layer_1"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M5,22h13c0.55,0,1-0.45,1-1v-1c0-0.55-0.45-1-1-1s-1,0.45-1,1H6V4h6v5c0,0.55,0.45,1,1,1h4c0,0.55,0.45,1,1,1s1-0.45,1-1V9 c0-0.13-0.03-0.25-0.07-0.36c-0.02-0.04-0.04-0.08-0.07-0.12c-0.03-0.05-0.05-0.11-0.09-0.16l-5-6c-0.01-0.01-0.02-0.02-0.03-0.03 c-0.07-0.07-0.15-0.13-0.23-0.18c-0.03-0.02-0.06-0.05-0.1-0.06C13.28,2.03,13.15,2,13,2H5C4.45,2,4,2.45,4,3v18 C4,21.55,4.45,22,5,22z M14,5.76L15.87,8H14V5.76z"></path>
              <path d="M8,10h2c0.55,0,1-0.45,1-1s-0.45-1-1-1H8C7.45,8,7,8.45,7,9S7.45,10,8,10z"></path>
              <path d="M14,11H8c-0.55,0-1,0.45-1,1s0.45,1,1,1h6c0.55,0,1-0.45,1-1S14.55,11,14,11z"></path>
              <path d="M8,16h4c0.55,0,1-0.45,1-1s-0.45-1-1-1H8c-0.55,0-1,0.45-1,1S7.45,16,8,16z"></path>
              <path d="M8,19h6c0.55,0,1-0.45,1-1s-0.45-1-1-1H8c-0.55,0-1,0.45-1,1S7.45,19,8,19z"></path>
              <path d="M20.71,16.29C20.7,16.29,20.7,16.29,20.71,16.29C20.89,15.9,21,15.46,21,15c0-1.66-1.34-3-3-3s-3,1.34-3,3s1.34,3,3,3 c0.46,0,0.9-0.11,1.29-0.3c0,0,0,0.01,0.01,0.01l1,1C20.49,18.9,20.74,19,21,19s0.51-0.1,0.71-0.29c0.39-0.39,0.39-1.02,0-1.41 L20.71,16.29z M18,16c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S18.55,16,18,16z"></path>
            </g>
          </svg>
          <p>Ordenes</p>
        </Link>
        <Link
          href={"/clients"}
          className={`${styles.asideItem} ${
            currentPage.startsWith("/clients") && styles.asideSelected
          }`}
        >
          <svg
            width={"28px"}
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
              {" "}
              <path
                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="var(--light-grayish-blue)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
              <path
                d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                stroke="var(--light-grayish-blue)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>
          <p>Clientes</p>
        </Link>
      </aside>
    );
  return <></>;
}
