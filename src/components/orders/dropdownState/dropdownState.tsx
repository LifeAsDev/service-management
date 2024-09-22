import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

export default function DropdownState({
  options,
  stateSelected,
}: {
  options: { text: string; function?: () => void; element?: JSX.Element }[];
  stateSelected: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [openDirection, setOpenDirection] = useState<"down" | "up">("down");

  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (!isMenuOpen && containerRef.current && options) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const menuHeight = 120; // Aproximadamente la altura que ocupará el menú desplegable

      // Determinar si el menú debería abrirse hacia arriba o hacia abajo
      if (rect.bottom + menuHeight > viewportHeight) {
        setOpenDirection("up");
        setMenuPosition({
          top: rect.top + window.scrollY - menuHeight / 1.5, // Posicionarlo arriba del contenedor
          left: rect.left + window.scrollX,
        });
      } else {
        setOpenDirection("down");
        setMenuPosition({
          top: rect.bottom + window.scrollY, // Posicionarlo abajo del contenedor
          left: rect.left + window.scrollX,
        });
      }
    }
    setIsMenuOpen((prev) => !prev);
  };

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const div = document.getElementById("evaluationList");

    const handleScroll = () => {
      setIsMenuOpen(false);
    };

    if (div) {
      div.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (div) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className={styles.optionsBox} ref={containerRef} onClick={toggleMenu}>
      <span className={styles.dropdownLabel}>{stateSelected}</span>

      {isMenuOpen &&
        options &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.dropdownMenu}
            style={{
              position: "absolute",
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
            <ul>
              {options.map((item) => (
                <li
                  key={item.text}
                  onClick={() => {
                    if (item.function) item.function();
                    toggleMenu();
                  }}
                >
                  {item.element ? item.element : item.text}
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
