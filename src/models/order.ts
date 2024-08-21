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
}
export default Order;
