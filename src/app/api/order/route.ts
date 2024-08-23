import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Order from "@/schemas/order";
import Client from "@/schemas/client";

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
    const orders = await Order.find().populate("cliente");

    return NextResponse.json({
      orders,
      message: "Orders",
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return NextResponse.json(
      { message: "Error retrieving orders" },
      { status: 500 }
    );
  }
}
