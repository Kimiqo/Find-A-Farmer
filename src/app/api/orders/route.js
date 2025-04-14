import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "src", "data", "orders.json");
  const jsonData = fs.readFileSync(filePath, "utf8");
  return NextResponse.json(JSON.parse(jsonData));
}

export async function POST(request) {
  const order = await request.json();
  const filePath = path.join(process.cwd(), "src", "data", "orders.json");
  let orders = [];
  if (fs.existsSync(filePath)) {
    orders = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  orders.push(order);
  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
  return NextResponse.json({ message: "Order placed" }, { status: 200 });
}