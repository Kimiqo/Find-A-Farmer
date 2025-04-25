import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const order = await req.json();
    await client.connect();
    const db = client.db("farmers_app");

    // Assign farmerId based on items
    const farmerIds = [...new Set(order.items.map((item) => item.farmerId))];
    if (farmerIds.length !== 1) {
      return new Response("Order must be from one farmer", { status: 400 });
    }

    const orderWithFarmer = { ...order, farmerId: farmerIds[0] };
    await db.collection("orders").insertOne(orderWithFarmer);
    return new Response("Order placed", { status: 200 });
  } catch {
    return new Response("Failed to place order", { status: 500 });
  } finally {
    await client.close();
  }
}