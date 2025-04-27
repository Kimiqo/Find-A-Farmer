import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "buyer") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let { buyerId, buyerName, buyerPhone, items, total, address } = await req.json();
  if (!buyerId || !items?.length || total === undefined || !address) {
    return new Response(JSON.stringify({ error: "Missing required fields: buyerId, items, total, address" }), { status: 400 });
  }

  // Ensure buyerId is a valid ObjectId
  try {
    buyerId = new ObjectId(buyerId);
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid buyerId format" }), { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("farmers_app");

    const buyer = await db.collection("users").findOne({ _id: buyerId });
    if (!buyer) {
      return new Response(JSON.stringify({ error: "Buyer not found" }), { status: 404 });
    }

    // Use provided buyerName, buyerPhone, or fallback to buyer document
    buyerName = buyerName || buyer.name || "Unknown";
    buyerPhone = buyerPhone || buyer.phone || "";

    const ordersByFarmer = items.reduce((acc, item) => {
      const { farmerId, farmerName, productId, name, price, quantity } = item;
      if (!farmerId || !productId || !name || price === undefined || !quantity) {
        throw new Error("Invalid item data");
      }
      if (!acc[farmerId]) {
        acc[farmerId] = { farmerId: parseInt(farmerId), farmerName, items: [], total: 0 };
      }
      acc[farmerId].items.push({ productId, name, price, quantity });
      acc[farmerId].total += price * quantity;
      return acc;
    }, {});

    const orders = Object.values(ordersByFarmer).map((order) => ({
      farmerId: order.farmerId,
      buyerId,
      buyerName,
      buyerPhone,
      items: order.items,
      total: order.total,
      address,
      status: "pending",
      createdAt: new Date(),
    }));

    const result = await db.collection("orders").insertMany(orders);
    if (result.insertedCount === orders.length) {
      return new Response(JSON.stringify({ message: "Order placed successfully" }), { status: 201 });
    }
    return new Response(JSON.stringify({ error: "Failed to place order" }), { status: 500 });
  } catch (error) {
    console.error("Error in /api/orders POST:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to place order" }), { status: 500 });
  } finally {
    await client.close();
  }
}