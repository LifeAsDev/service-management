import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order from "@/schemas/order";
import Client from "@/schemas/client";
import mongoose, { SortOrder } from "mongoose";

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
      clienteFullName: client.fullName,
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
    const keyword = searchParams.get("keyword") as string;
    let page: number = parseInt(searchParams.get("page") || "1", 10);
    let pageSize: number = parseInt(searchParams.get("pageSize") || "10", 10);
    let sortByLastDate: SortOrder =
      searchParams.get("sortByLastDate") === "true" ? -1 : 1;

    // Validaciones de los parámetros de paginación
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) pageSize = 10;

    const searchFilter: any[] = [
      {
        $addFields: {
          tempOrderId: { $toString: "$_id" },
        },
      },
      {
        $match: {
          $or: [
            { modelo: { $regex: keyword, $options: "i" } },
            { clienteFullName: { $regex: keyword, $options: "i" } },
            { tempOrderId: { $regex: keyword, $options: "i" } },
          ],
        },
      },
    ];

    // Calcular el número total de órdenes con el filtro aplicado usando agregación
    const totalCountResult = await Order.aggregate([
      ...searchFilter,
      { $count: "totalCount" },
    ]);

    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

    // Obtener las órdenes con paginación, populate y filtro aplicado usando agregación
    const orders = await Order.aggregate([
      ...searchFilter,
      { $sort: { createdAt: sortByLastDate } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
    ]);
    const populatedOrders = await Order.populate(orders, { path: "cliente" });

    return NextResponse.json({
      orders: populatedOrders,
      totalCount,
      page,
      pageSize,
      message: "Orders fetched successfully",
      keyword,
      sortByLastDate: sortByLastDate === -1,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return NextResponse.json(
      { message: "Error retrieving orders" },
      { status: 500 }
    );
  }
}
