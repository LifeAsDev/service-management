import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/schemas/user";
import bcrypt from "bcrypt";
function generateRandomPassword(length: number = 6): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

async function generateUniqueUsername(): Promise<string> {
  let username: string = "";
  let isUnique = false;

  while (!isUnique) {
    username = `Usuario${Math.floor(Math.random() * 1000)}`;
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      isUnique = true;
    }
  }

  return username;
}

export async function GET(req: Request) {
  await connectMongoDB();
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  // Generar una contraseña aleatoria con hash
  const randomPassword = generateRandomPassword();

  const password = await bcrypt.hash(randomPassword, 10);

  let username = await generateUniqueUsername();

  // Crear el nuevo usuario una vez que se encuentra un nombre de usuario único
  const user = await User.create({
    username,
    password,
  });

  return NextResponse.json(
    { message: "User Created", usuario: username, contraseña: randomPassword },
    { status: 201 }
  );
}
