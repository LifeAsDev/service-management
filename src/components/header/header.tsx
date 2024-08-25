"use client";
import SearchInput from "@/components/searchInput/searchInput";
import styles from "./styles.module.css";
import { useOnboardingContext } from "@/lib/context";
export default function Header() {
  const { setAsideOpen } = useOnboardingContext();

  return (
    <header className={styles.header}>
      <div className={styles.headerItem}>
        <div
          onClick={() => {
            setAsideOpen((prev: boolean) => !prev);
          }}
          className={styles.menuBtn}
        >
          <svg
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
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      {/* <div className={styles.headerItem}>
        <SearchInput />
      </div> */}
      <div className={`${styles.userBox} ${styles.headerItem}`}>
        Alan Rodriguez
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M7 10L12 15L17 10"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
        <ul className={styles.userOptions}>
          <li className={styles.userOption}>Perfil</li>
          <li className={styles.userOption}>Salir</li>
        </ul>
      </div>
    </header>
  );
}
