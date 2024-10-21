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

    // Obtener todas las órdenes filtradas por fecha y estado "Entregado"
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      costos: { $exists: true },
      estado: "Entregado",
    });

    if (month === null) {
      // Si se solicita el total anual
      const gananciasMensuales = Array(12).fill(0);

      // Agrupar las ganancias por mes
      orders.forEach((order: OrderModel) => {
        if (!order.createdAt || !order.costos) return;

        const mes = order.createdAt.getMonth(); // Mes de 0 (enero) a 11 (diciembre)

        // Sumar las ganancias de esta orden
        const costoTotal = order.costos.reduce((total, costo) => {
          return total + parseFloat(costo.costo);
        }, 0);

        // Agregar al mes correspondiente
        gananciasMensuales[mes] += costoTotal;
      });

      return NextResponse.json({
        gananciasMensuales, // Retorna las ganancias mensuales
        message: "Ganancias anuales calculadas exitosamente",
      });
    } else {
      // Si se solicita el total mensual
      const gananciasDiarias = Array.from(
        { length: endDate.getDate() },
        () => 0
      );

      // Agrupar las ganancias por día
      orders.forEach((order: OrderModel) => {
        if (!order.createdAt || !order.costos) return;

        const dia = order.createdAt.getDate(); // Día del mes (1-31)

        // Sumar las ganancias de esta orden
        const costoTotal = order.costos.reduce((total, costo) => {
          return total + parseFloat(costo.costo);
        }, 0);

        // Sumar al día correspondiente
        gananciasDiarias[dia - 1] += costoTotal; // Restamos 1 para indexar correctamente
      });

      return NextResponse.json({
        gananciasMensuales: gananciasDiarias, // Retorna las ganancias diarias
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
