import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/schemas/user"; // Importa el esquema de usuario

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  const { id } = params;

  try {
    const user = await User.findById(id); // Busca el usuario por ID

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user, message: "Usuario encontrado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return NextResponse.json(
      { message: "Error al obtener el usuario" },
      { status: 500 }
    );
  }
}
