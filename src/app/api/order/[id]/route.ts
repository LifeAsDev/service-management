import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order from "@/schemas/order";
import Client from "@/schemas/client";
import { addAttribute } from "@/lib/mongooseFunctions";

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
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  const { id } = params;

  try {
    const formData = await req.formData();
    const orderId = id;
    const client = await Client.findById(formData.get("clientId"));
    const costosRaw = formData.get("costos") as string | null;

    // Si `costos` viene como un string JSON, lo parseamos.
    const costos = costosRaw ? JSON.parse(costosRaw) : [];

    // Buscar la orden existente por ID
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const marca = formData.get("marca") as string;
    const modelo = formData.get("modelo") as string;
    const tipo = formData.get("tipo") as string;
    addAttribute(marca, "Marca");
    addAttribute(modelo, "Modelo");
    addAttribute(tipo, "Tipo");
    // Actualizar los campos de la orden con los datos proporcionados
    order.marca = (formData.get("marca") as string) || order.marca;
    order.modelo = (formData.get("modelo") as string) || order.modelo;
    order.tipo = (formData.get("tipo") as string) || order.tipo;
    order.cliente = client._id || order.cliente; // Actualiza el cliente si se proporciona
    order.numeroDeSerie =
      (formData.get("numeroDeSerie") as string) || order.numeroDeSerie;
    order.contraseña =
      (formData.get("contraseña") as string) || order.contraseña;
    order.clienteFullName = client.fullName || order.clienteFullName;
    order.costos = costos.length ? costos : order.costos;
    order.observacion = formData.get("observacion");
    order.garantia = Number(formData.get("garantia"));
    // Guardar los cambios
    await order.save();

    return NextResponse.json({
      order,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Error updating order" },
      { status: 500 }
    );
  }
}
