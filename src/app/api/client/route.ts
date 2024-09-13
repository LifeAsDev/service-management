import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Client from "@/schemas/client"; // Import the Client model

export async function POST(req: Request, { params }: { params: any }) {
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

    // Verificar si ya existe un cliente con el mismo ID
    const existingClient = await Client.findOne({ id: clientData.id });
    if (existingClient) {
      return NextResponse.json(
        {
          message: "Client with this ID already exists",
          errors: { id: "Ya existe un cliente con este RUT" },
        },
        { status: 400 }
      );
    }

    // Crear el nuevo cliente si no existe
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
    let page: number = parseInt(searchParams.get("page") || "1", 10);
    const pageSize: number = parseInt(searchParams.get("pageSize") || "3", 10);

    let aggregatePipeline: any[] = [];
    if (keyword !== "") {
      aggregatePipeline.push({
        $match: {
          $or: [
            { fullName: { $regex: keyword, $options: "i" } },
            { id: { $regex: keyword, $options: "i" } },
            { correo: { $regex: keyword, $options: "i" } },
          ],
        },
      });
    }
    aggregatePipeline.push({
      $facet: {
        metadata: [{ $count: "totalCount" }],
        data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      },
    });

    const clientsData = await Client.aggregate(aggregatePipeline);
    const clients = clientsData[0].data;
    const totalCount = clientsData[0].metadata[0]?.totalCount ?? 0;

    return NextResponse.json({
      clients,
      keyword,
      totalCount,
      message: "Clients",
      page,
    });
  } catch (error) {
    console.error("Error client:", error);
    return NextResponse.json({ message: "Error client" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("id");

    if (!clientId) {
      return NextResponse.json(
        { message: "Client ID is required" },
        { status: 400 }
      );
    }

    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { message: "Error deleting client" },
      { status: 500 }
    );
  }
}
