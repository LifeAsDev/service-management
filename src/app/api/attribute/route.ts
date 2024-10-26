import Attribute from "@/schemas/attribute";
import mongoose, { Schema, Types } from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectMongoDB();

  try {
    const formData = await req.formData();
    const attributeData = {
      name: formData.get("name") as string,
      inputType: formData.get("inputType") as string,
    };

    // Verificar si ya existe un atributo con el mismo nombre
    const existingAttribute = await Attribute.findOne({
      name: attributeData.name,
    });
    if (existingAttribute) {
      return NextResponse.json(
        {
          message: "Attribute with this name already exists",
          errors: { name: "Ya existe un atributo con este nombre" },
        },
        { status: 400 }
      );
    }

    // Crear el nuevo atributo si no existe
    const attribute = await Attribute.create(attributeData);

    return NextResponse.json({
      attribute,
      message: "Attribute created successfully",
    });
  } catch (error) {
    console.error("Error creating attribute:", error);
    return NextResponse.json(
      { message: "Error creating attribute" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") as string;
    let page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "3", 10);

    let aggregatePipeline: any[] = [];
    if (keyword !== "") {
      aggregatePipeline.push({
        $match: {
          name: { $regex: keyword, $options: "i" },
        },
      });
    }
    aggregatePipeline.push({
      $facet: {
        metadata: [{ $count: "totalCount" }],
        data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      },
    });

    const attributesData = await Attribute.aggregate(aggregatePipeline);
    const attributes = attributesData[0].data;
    const totalCount = attributesData[0].metadata[0]?.totalCount ?? 0;

    return NextResponse.json({
      attributes,
      keyword,
      totalCount,
      message: "Attributes",
      page,
    });
  } catch (error) {
    console.error("Error retrieving attributes:", error);
    return NextResponse.json(
      { message: "Error retrieving attributes" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const attributeId = searchParams.get("id");

    if (!attributeId) {
      return NextResponse.json(
        { message: "Attribute ID is required" },
        { status: 400 }
      );
    }

    const deletedAttribute = await Attribute.findByIdAndDelete(attributeId);

    if (!deletedAttribute) {
      return NextResponse.json(
        { message: "Attribute not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Attribute deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting attribute:", error);
    return NextResponse.json(
      { message: "Error deleting attribute" },
      { status: 500 }
    );
  }
}
