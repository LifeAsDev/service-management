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
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  const { id } = params; // Obtenemos el id de los parámetros

  try {
    const formData = await req.formData();
    const clientData = {
      fullName: (formData.get("fullName") as string).trim(),
      numero: (formData.get("numero") as string).trim(),
      correo: (formData.get("correo") as string).trim(),
      direccion: (formData.get("direccion") as string).trim(),
      notas: (formData.get("notas") as string).trim(),
      id: (formData.get("id") as string).trim(),
    };

    // Buscar el cliente por su id y actualizarlo
    const updatedClient = await Client.findByIdAndUpdate(id, clientData, {
      new: true, // Devolver el documento actualizado
      runValidators: true, // Validar los datos antes de la actualización
    });

    // Si no se encuentra el cliente, devolver un error 404
    if (!updatedClient) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      client: updatedClient,
      message: "Client updated successfully",
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { message: "Error updating client" },
      { status: 500 }
    );
  }
}
