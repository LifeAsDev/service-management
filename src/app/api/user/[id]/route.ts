import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/schemas/user"; // Importa el esquema de usuario
import bcrypt from "bcrypt";

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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  const { id } = params;

  try {
    const formData = await req.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const role = formData.get("role");

    if (!username) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Actualiza los campos del usuario
    user.username = username.toString();
    if (role) user.role = role.toString();

    // Si se proporciona una contraseña, la actualizamos
    if (password) {
      const hashedPassword = await bcrypt.hash(password.toString(), 10);
      user.password = hashedPassword;
    }

    await user.save();

    return NextResponse.json(
      { user, message: "Usuario actualizado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return NextResponse.json(
      { message: "Error al actualizar el usuario" },
      { status: 500 }
    );
  }
}
