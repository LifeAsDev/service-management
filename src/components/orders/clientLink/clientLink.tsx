import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css"; // Asegúrate de crear este archivo CSS
import Client from "@/models/client";
import { comma } from "postcss/lib/list";

const ClientLink = ({ cliente }: { cliente: Client }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showAbove, setShowAbove] = useState(false);
  const clientLinkRef = useRef<HTMLDivElement>(null);
  const clientBoxRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = clientLinkRef.current?.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect) {
      const newPosition = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      };

      setPosition(newPosition);
      // Comprobar si clientBox se sale del viewport
      const clientBoxHeight = 150;
      console.log(clientBoxHeight);

      if (rect.bottom + clientBoxHeight > viewportHeight) {
        // Si se sale del viewport, mostrar hacia arriba
        setShowAbove(true);
        setPosition({
          top: rect.top + window.scrollY - clientBoxHeight,
          left: rect.left + window.scrollX,
        });
      } else {
        // Si no se sale, mostrar hacia abajo
        setShowAbove(false);
      }
    }
    setIsHovering(true);
  };

  // Manejar el evento de mouse leave para ocultar el portal
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Renderizar el portal cuando el usuario hace hover
  const clientPortal =
    isHovering && cliente
      ? createPortal(
          <div
            className={styles.clientBox}
            ref={clientBoxRef}
            style={{ top: position.top, left: position.left }}
          >
            <p>
              <strong>Nombre:</strong> {cliente.fullName}
            </p>
            <p>
              <strong>Número de telefono:</strong> {cliente.numero}
            </p>
            <p>
              <strong>Correo:</strong> {cliente.correo}
            </p>
            <p>
              <strong>Dirección:</strong> {cliente.direccion}
            </p>
            <p>
              <strong>Notas:</strong> {cliente.notas}
            </p>
          </div>,
          document.body
        )
      : null;

  return (
    <div
      className={styles.clientLink}
      ref={clientLinkRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p>{cliente?.fullName || "Sin Cliente"}</p>
      {clientPortal}
    </div>
  );
};

export default ClientLink;
