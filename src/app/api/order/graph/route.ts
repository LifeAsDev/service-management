import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order from "@/schemas/order";
import OrderModel from "@/models/order";

export async function GET(req: Request) {
  await connectMongoDB();

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") || "", 10);
  const month = searchParams.get("month")
    ? parseInt(searchParams.get("month") || "", 10)
    : null;

  if (isNaN(year)) {
    return NextResponse.json(
      {
        message:
          "El parámetro 'year' es obligatorio y debe ser un número válido",
      },
      { status: 400 }
    );
  }

  try {
    // Determinar el rango de fechas
    const startDate = new Date(year, month !== null ? month - 1 : 0, 1);
    const endDate = new Date(year, month !== null ? month : 12, 0);

    // Consulta para órdenes en estado "Entregado"
    const deliveredOrders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      costos: { $exists: true },
      estado: "Entregado",
    });

    // Consulta para órdenes en cualquier estado excepto "Rechazada" y "Entregado"
    const otherOrders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      costos: { $exists: true },
      estado: { $nin: ["Rechazada", "Entregado"] },
    });

    // Si se solicita el total anual
    if (month === null) {
      const gananciasMensualesEntregado = Array(12).fill(0);
      const gananciasMensualesOtros = Array(12).fill(0);

      // Procesar órdenes "Entregado"
      deliveredOrders.forEach((order: OrderModel) => {
        if (!order.createdAt || !order.costos) return;

        const mes = order.createdAt.getMonth();
        const costoTotal = order.costos.reduce((total, costo) => {
          return total + parseFloat(costo.costo);
        }, 0);

        gananciasMensualesEntregado[mes] += costoTotal;
      });

      // Procesar otras órdenes
      otherOrders.forEach((order: OrderModel) => {
        if (!order.createdAt || !order.costos) return;

        const mes = order.createdAt.getMonth();
        const costoTotal = order.costos.reduce((total, costo) => {
          return total + parseFloat(costo.costo);
        }, 0);

        gananciasMensualesOtros[mes] += costoTotal;
      });

      return NextResponse.json({
        gananciasMensualesEntregado,
        gananciasMensualesOtros,
        message: "Ganancias anuales calculadas exitosamente",
      });
    } else {
      // Si se solicita el total mensual
      const gananciasDiariasEntregado = Array.from(
        { length: endDate.getDate() },
        () => 0
      );
      const gananciasDiariasOtros = Array.from(
        { length: endDate.getDate() },
        () => 0
      );

      // Procesar órdenes "Entregado"
      deliveredOrders.forEach((order: OrderModel) => {
        if (!order.createdAt || !order.costos) return;

        const dia = order.createdAt.getDate();
        const costoTotal = order.costos.reduce((total, costo) => {
          return total + parseFloat(costo.costo);
        }, 0);

        gananciasDiariasEntregado[dia - 1] += costoTotal;
      });

      // Procesar otras órdenes
      otherOrders.forEach((order: OrderModel) => {
        if (!order.createdAt || !order.costos) return;

        const dia = order.createdAt.getDate();
        const costoTotal = order.costos.reduce((total, costo) => {
          return total + parseFloat(costo.costo);
        }, 0);

        gananciasDiariasOtros[dia - 1] += costoTotal;
      });

      return NextResponse.json({
        gananciasMensualesEntregado: gananciasDiariasEntregado,
        gananciasMensualesOtros: gananciasDiariasOtros,
        message: "Ganancias mensuales calculadas exitosamente",
      });
    }
  } catch (error) {
    console.error("Error al calcular las ganancias:", error);
    return NextResponse.json(
      { message: "Error al calcular las ganancias" },
      { status: 500 }
    );
  }
}
