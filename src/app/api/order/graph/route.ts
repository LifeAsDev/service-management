import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order from "@/schemas/order";
import Client from "@/schemas/client";
import mongoose, { SortOrder } from "mongoose";
import OrderModel from "@/models/order";

export async function GET(req: Request) {
  await connectMongoDB();

  try {
    // Obtener todas las órdenes
    const orders = await Order.find({
      createdAt: { $exists: true },
      costos: { $exists: true },
      estado: "Entregado", // Filtrar solo las órdenes con estado "Entregado"
    });

    // Inicializar el array de ganancias por mes (12 meses)
    const gananciasMensuales = Array(12).fill(0);

    // Agrupar las ganancias por mes
    orders.forEach((order: OrderModel) => {
      if (!order.createdAt || !order.costos) return;

      const mes = order.createdAt.getMonth(); // Mes de 0 (enero) a 11 (diciembre)

      // Sumar las ganancias de esta orden a su respectivo mes
      const costoTotal = order.costos.reduce((total, costo) => {
        return total + parseFloat(costo.costo);
      }, 0);

      gananciasMensuales[mes] += costoTotal;
    });

    return NextResponse.json({
      gananciasMensuales, // Array de números con las ganancias de enero a diciembre
      message: "Ganancias mensuales calculadas exitosamente",
    });
  } catch (error) {
    console.error("Error al calcular las ganancias mensuales:", error);
    return NextResponse.json(
      { message: "Error al calcular las ganancias mensuales" },
      { status: 500 }
    );
  }
}
