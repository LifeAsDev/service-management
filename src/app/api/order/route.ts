import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order from "@/schemas/order";
import Client from "@/schemas/client";
import { SortOrder } from "mongoose";

export async function POST(req: Request) {
  await connectMongoDB();

  try {
    const formData = await req.formData();

    const confirmNewClient = formData.get("confirmNewClient") === "true";
    const clientData = {
      fullName: formData.get("fullName") as string,
      numero: formData.get("numero") as string,
      correo: formData.get("correo") as string,
      direccion: formData.get("direccion") as string,
      notas: formData.get("notas") as string,
      id: formData.get("id") as string,
    };

    let client = await Client.findOne({ id: clientData.id });

    if (!client) {
      if (confirmNewClient) {
        client = await Client.create(clientData);
      } else {
        return NextResponse.json({
          clientNew: true,
          message: "Client new",
        });
      }
    }

    const orderData = {
      marca: formData.get("marca") as string,
      modelo: formData.get("modelo") as string,
      tipo: formData.get("tipo") as string,
      cliente: client._id, // Relación con el cliente
      numeroDeSerie: formData.get("numeroDeSerie") as string,
      contraseña: formData.get("contraseña") as string,
    };

    const order = await Order.create(orderData);

    return NextResponse.json({
      order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Error creating order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || ""; // Obtener el keyword de los parámetros de búsqueda
    let page: number = parseInt(searchParams.get("page") || "1", 10);
    let pageSize: number = parseInt(searchParams.get("pageSize") || "10", 10);
    let sortByLastDate: SortOrder =
      searchParams.get("sortByLastDate") === "true" ? -1 : 1;

    // Validaciones de los parámetros de paginación
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) pageSize = 10;

    // Construir el filtro de búsqueda
    const searchFilter = keyword
      ? {
          $or: [
            { "cliente.fullName": { $regex: keyword, $options: "i" } },
            { modelo: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    // Calcular el número total de órdenes que coinciden con el filtro
    const totalCount = await Order.countDocuments(searchFilter);

    // Obtener las órdenes con paginación y filtro
    const orders = await Order.find(searchFilter)
      .populate("cliente") // Asegúrate de que este campo está correctamente relacionado en el esquema
      .sort({ createdAt: sortByLastDate }) // Ordenar por fecha de creación basado en sortByLastDate
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return NextResponse.json({
      orders,
      totalCount,
      page,
      pageSize,
      message: "Orders fetched successfully",
      sortByLastDate: sortByLastDate === -1,
      keyword,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return NextResponse.json(
      { message: "Error retrieving orders" },
      { status: 500 }
    );
  }
}
