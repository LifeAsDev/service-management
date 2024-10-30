import { connectMongoDB } from "@/lib/mongodb";
import Attribute from "@/schemas/attribute";

export async function addAttribute(name: string, inputType?: string) {
  await connectMongoDB();

  try {
    // Verificar si el atributo ya existe
    const existingAttribute = await Attribute.findOne({ name, inputType });
    if (existingAttribute) {
      return { message: "El atributo ya existe", status: 409 };
    }

    // Si no existe, creamos el atributo
    const newAttribute = new Attribute({ name, inputType });
    await newAttribute.save();

    return { newAttribute, message: "Atributo creado exitosamente" };
  } catch (error) {
    console.error("Error creando atributo:", error);
    return { message: "Error al crear atributo", status: 500 };
  }
}
