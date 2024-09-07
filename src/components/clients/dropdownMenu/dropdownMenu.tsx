import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

export default function DropdownMenu({
  options,
}: {
  options: { text: string; function: () => void }[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [openDirection, setOpenDirection] = useState<"down" | "up">("down");

  const menuRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const toggleMenu = () => {
    if (!isMenuOpen && svgRef.current && options) {
      const rect = svgRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const menuHeight = 120; // Aproximadamente la altura que ocupará el menú desplegable

      // Determinar si el menú debería abrirse hacia arriba o hacia abajo
      if (rect.bottom + menuHeight > viewportHeight) {
        setOpenDirection("up");
        setMenuPosition({
          top: rect.top + window.scrollY - menuHeight, // Posicionarlo arriba del SVG
          left: rect.left + window.scrollX,
        });
      } else {
        setOpenDirection("down");
        setMenuPosition({
          top: rect.bottom + window.scrollY, // Posicionarlo abajo del SVG
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

  return (
    <div className={styles.optionsBox}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={toggleMenu}
        className={styles.svgIcon}
        ref={svgRef}
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <circle
            cx="5"
            cy="12"
            r="2"
            stroke="#cacde8"
            strokeWidth="1.5"
          ></circle>
          <circle
            cx="12"
            cy="12"
            r="2"
            stroke="#cacde8"
            strokeWidth="1.5"
          ></circle>
          <circle
            cx="19"
            cy="12"
            r="2"
            stroke="#cacde8"
            strokeWidth="1.5"
          ></circle>
        </g>
      </svg>

      {/* Renderiza el menú usando un portal */}
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
                    item.function();
                    toggleMenu();
                  }}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </div>,
          document.body // Renderiza en el cuerpo del documento
        )}
    </div>
  );
}
