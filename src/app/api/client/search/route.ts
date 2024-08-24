import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Client from "@/schemas/client"; // Import the Client model

export async function GET(req: Request) {
  await connectMongoDB();
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") as string;

  try {
    // Filtra los clientes usando el término de búsqueda y limita el resultado a 5
    const clients = await Client.find({
      fullName: { $regex: keyword, $options: "i" }, // Filtrado por nombre completo (ignora mayúsculas/minúsculas)
    }).limit(5); // Limita el resultado a 5 clientes

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
