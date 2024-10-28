import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Attribute from "@/schemas/attribute"; // Importa el modelo Attribute

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  const { id } = params; // Obtenemos el id de los parámetros

  try {
    // Buscamos el atributo por su id
    const attribute = await Attribute.findById(id);

    if (!attribute) {
      return NextResponse.json(
        { message: "Atributo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      attribute,
      message: "Atributo encontrado",
    });
  } catch (error) {
    console.error("Error al obtener el atributo:", error);
    return NextResponse.json(
      { message: "Error al obtener el atributo" },
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
    const attributeData = {
      name: formData.get("name") as string,
      inputType: formData.get("inputType") as string,
    };

    // Buscar el atributo por su id y actualizarlo
    const updatedAttribute = await Attribute.findByIdAndUpdate(
      id,
      attributeData,
      {
        new: true, // Devolver el documento actualizado
        runValidators: true, // Validar los datos antes de la actualización
      }
    );

    // Si no se encuentra el atributo, devolver un error 404
    if (!updatedAttribute) {
      return NextResponse.json(
        { message: "Atributo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      attribute: updatedAttribute,
      message: "Atributo actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar el atributo:", error);
    return NextResponse.json(
      { message: "Error al actualizar el atributo" },
      { status: 500 }
    );
  }
}
