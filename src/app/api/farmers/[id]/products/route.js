import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request, { params }) {
  const { id } = params;
  const product = await request.json();
  const filePath = path.join(process.cwd(), "src", "data", "farmers.json");
  const farmers = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const farmerIndex = farmers.findIndex((f) => f.id === parseInt(id));

  if (farmerIndex === -1) {
    return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
  }

  farmers[farmerIndex].products.push(product);
  fs.writeFileSync(filePath, JSON.stringify(farmers, null, 2));
  return NextResponse.json({ message: "Product added" });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const { productId } = await request.json();
  const filePath = path.join(process.cwd(), "src", "data", "farmers.json");
  const farmers = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const farmerIndex = farmers.findIndex((f) => f.id === parseInt(id));

  if (farmerIndex === -1) {
    return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
  }

  farmers[farmerIndex].products = farmers[farmerIndex].products.filter(
    (p) => p.id !== productId
  );
  fs.writeFileSync(filePath, JSON.stringify(farmers, null, 2));
  return NextResponse.json({ message: "Product deleted" });
}