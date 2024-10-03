import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order, { getNextCustomId } from "@/schemas/order";

export async function GET(req: Request) {
  await connectMongoDB();

  try {
    // Encuentra órdenes que no tienen customId
    const ordersWithoutCustomId = await Order.find({
      customId: { $exists: false },
    });

    // Iterar sobre las órdenes sin customId
    for (const order of ordersWithoutCustomId) {
      // Generar customId atómicamente
      order.customId = await getNextCustomId();
      await order.save(); // Guardar el documento actualizado
    }

    return NextResponse.json(
      { message: "Custom IDs assigned successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return NextResponse.json(
      { message: "Error retrieving orders" },
      { status: 500 }
    );
  }
}
