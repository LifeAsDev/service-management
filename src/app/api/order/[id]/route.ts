import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order from "@/schemas/order";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  const { id } = params;

  try {
    const order = await Order.findById(id);
    await Order.populate(order, { path: "cliente" });

    if (!order) {
      return NextResponse.json(
        { message: "Orden no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { order, message: "Orden encontrada" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return NextResponse.json(
      { message: "Error al obtener la orden" },
      { status: 500 }
    );
  }
}
