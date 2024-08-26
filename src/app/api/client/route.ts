import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Client from "@/schemas/client"; // Import the Client model

export async function POST(req: Request) {
  await connectMongoDB();

  try {
    const formData = await req.formData();
    const clientData = {
      fullName: formData.get("fullName") as string,
      numero: formData.get("numero") as string,
      correo: formData.get("correo") as string,
      direccion: formData.get("direccion") as string,
      notas: formData.get("notas") as string,
      id: formData.get("id") as string,
    };

    const client = await Client.create(clientData);

    return NextResponse.json({
      client,
      message: "Client created successfully",
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { message: "Error creating client" },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") as string;

    const filter = keyword
      ? { fullName: { $regex: keyword, $options: "i" } } // Filtrado por nombre completo
      : {}; // Si no hay keyword, busca todos los clientes

    const clients = await Client.find(filter);

    return NextResponse.json({
      clients,
      keyword,
      message: "Clients",
    });
  } catch (error) {
    console.error("Error client:", error);
    return NextResponse.json({ message: "Error client" }, { status: 500 });
  }
}
