import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order from "@/schemas/order";
import Client from "@/schemas/client";
import mongoose, { SortOrder } from "mongoose";

export async function POST(req: Request) {
  await connectMongoDB();

  try {
    const formData = await req.formData();

    const client = await Client.findById(formData.get("clientId"));
    const costosRaw = formData.get("costos") as string | null;

    // Si `costos` viene como un string JSON, lo parseamos.
    const costos = costosRaw ? JSON.parse(costosRaw) : [];
    const orderData = {
      marca: formData.get("marca") as string,
      modelo: formData.get("modelo") as string,
      tipo: formData.get("tipo") as string,
      cliente: client._id, // Relación con el cliente
      numeroDeSerie: formData.get("numeroDeSerie") as string,
      contraseña: formData.get("contraseña") as string,
      clienteFullName: client.fullName,
      costos,
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
            { marca: { $regex: keyword, $options: "i" } },
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

export async function DELETE(req: Request) {
  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { message: "Error deleting order" },
      { status: 500 }
    );
  }
}
