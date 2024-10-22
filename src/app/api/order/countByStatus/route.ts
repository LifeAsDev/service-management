import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order from "@/schemas/order";

export async function GET(req: Request) {
  await connectMongoDB();

  try {
    // Obtener conteo de órdenes por estado
    const countByState = await Order.aggregate([
      {
        $group: {
          _id: "$estado", // Agrupar por el campo "estado"
          count: { $sum: 1 }, // Contar el número de órdenes en cada estado
        },
      },
      {
        $sort: { count: -1 }, // Ordenar por el número de órdenes, de mayor a menor
      },
    ]);
    const result = countByState.reduce((acc: any, curr: any) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Devolvemos un objeto con todas las posibles categorías de estado
    return NextResponse.json({
      asignadas: result["Asignada"] || 0,
      revisiones: result["Revisión"] || 0,
      rechazadas: result["Rechazada"] || 0,
      reparadas: result["Reparada"] || 0,
      sinSolucion: result["Sin Solución"] || 0,
      entregadas: result["Entregado"] || 0,
      message: "Count by status fetched successfully",
    });
  } catch (error) {
    console.error("Error retrieving count by status:", error);
    return NextResponse.json(
      { message: "Error retrieving count by status" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
