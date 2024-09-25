import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order from "@/schemas/order";
import Client from "@/schemas/client";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  const { id } = params;

  try {
    const formData = await req.formData();
    const newState = formData.get("state") as string;

    // Buscar la orden existente por ID
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Actualizar solo el estado de la orden
    order.estado = newState;

    // Guardar los cambios
    await order.save();
    console.log(order);
    return NextResponse.json({
      order,
      message: "Order state updated successfully",
    });
  } catch (error) {
    console.error("Error updating order state:", error);
    return NextResponse.json(
      { message: "Error updating order state" },
      { status: 500 }
    );
  }
}
