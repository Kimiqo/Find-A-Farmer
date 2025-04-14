import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PATCH(request, { params }) {
  const { id } = params;
  const { status } = await request.json();
  const filePath = path.join(process.cwd(), "src", "data", "orders.json");
  const orders = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const orderIndex = orders.findIndex((o) => o.timestamp === id);

  if (orderIndex === -1) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  orders[orderIndex].status = status;
  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
  return NextResponse.json({ message: "Order updated" });
}