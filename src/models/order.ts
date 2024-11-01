import Client from "@/models/client";

interface Order {
  marca: string;
  modelo: string;
  tipo: string;
  cliente: Client;
  numeroDeSerie: string;
  contraseña: string;
  _id?: string;
  createdAt?: Date;
  estado?:
    | "Asignada"
    | "Revisión"
    | "Reparada"
    | "Rechazada"
    | "Sin Solución"
    | "Entregado";
  costos?: { nombre: string; costo: string; key?: string }[];
  clienteFullName?: string;
  customId?: string;
  observacion?: string;
}
export default Order;
