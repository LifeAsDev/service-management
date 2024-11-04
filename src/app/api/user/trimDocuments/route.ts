import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/schemas/order";
import Client from "@/schemas/client";
export function formatRut(value: string): string {
  // Elimina cualquier carácter que no sea un número o letra (para el último dígito)
  const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "");

  // Extrae el último carácter (que puede ser un número o una letra)
  const verifierDigit = cleanValue.slice(-1);
  // Extrae el resto de los caracteres
  const mainNumbers = cleanValue.slice(0, -1);

  // Agrega los puntos en los lugares correctos
  const formatted = mainNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Retorna el RUT formateado
  return `${formatted}-${verifierDigit}`;
}

export function formatPhone(input: string): string {
  // Remueve cualquier carácter que no sea un número
  const cleaned = input.replace(/\D/g, "");

  // Si el número está vacío, devuelve una cadena vacía
  if (cleaned.length === 0) {
    return "";
  }

  // Determina el código de país y el número
  let formatted = "";
  if (cleaned.length >= 9) {
    // Extrae el código de país (los primeros dos dígitos)
    const countryCode = cleaned.slice(0, 2); // Por ejemplo, "56"
    const firstDigit = cleaned[2]; // Primer dígito del número (por ejemplo, "9")
    const number = cleaned.slice(3); // Los restantes dígitos del número

    // Construye el formato
    formatted = `+${countryCode} ${firstDigit} `;

    // Formatea el número en dos partes
    if (number.length > 0) {
      formatted += number.slice(0, 4); // Primer segmento (XXXX)
    }
    if (number.length > 4) {
      formatted += " " + number.slice(4); // Segundo segmento (XXXX)
    }
  } else {
    // Si el número es demasiado corto, puedes manejarlo según necesites
    formatted = `+${cleaned}`; // Solo devuelve el número limpio
  }

  return formatted.trim();
}
export async function GET(req: Request) {
  await connectMongoDB();
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret != process.env.NEXTAUTH_SECRET) {
    return NextResponse.json(
      {
        message: "Incorrect secret",
      },
      { status: 400 }
    );
  }
  // Obtener y formatear todos los documentos de Order y Client
  const orders = await Order.find();
  const clients = await Client.find();

  // Función para recortar espacios en blanco de todas las propiedades de tipo String
  const trimDocument = (doc: any) => {
    Object.keys(doc.toObject()).forEach((key) => {
      if (typeof doc[key] === "string") {
        doc.set(key, doc[key].trim()); // Usa set para modificar el valor
      }
    });
  };

  // Aplicar trim a todos los documentos de Order y Client
  orders.forEach(trimDocument);
  clients.forEach(trimDocument);

  clients.forEach((client) => {
    if (client.id) {
      client.id = formatRut(client.id);
    }
    if (client.numero) {
      client.numero = formatPhone(client.numero);
    }
  });

  await Promise.all(orders.map((order) => order.save()));
  await Promise.all(clients.map((client) => client.save()));

  /*   const clientFound = clients.find(
    (client) => client._id.toString() === "67268eb2bc95c0adf055e506"
  );
  console.log({ notas: clientFound.notas });

  clientFound.notas = clientFound.notas.trim();
  console.log({ notas: clientFound.notas });
  // Guardar los documentos actualizados en la base de datos
 */
  return NextResponse.json({ message: "Trimming completed" }, { status: 200 });
}
