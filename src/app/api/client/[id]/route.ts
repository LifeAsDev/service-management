import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Client from "@/schemas/client"; // Import the Client model

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  const { id } = params; // Obtenemos el id de los parámetros

  try {
    // Buscamos el cliente por su id
    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json(
        { message: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      client,
      message: "Cliente encontrado",
    });
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    return NextResponse.json(
      { message: "Error al obtener el cliente" },
      { status: 500 }
    );
  }
}
