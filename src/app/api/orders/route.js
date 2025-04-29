import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  const { buyerId, buyerName, buyerPhone, address, items, total } = await req.json();

  // Validate payload
  if (!buyerId || !buyerName || !buyerPhone || !address || !Array.isArray(items) || items.length === 0 || typeof total !== "number") {
    return new Response(JSON.stringify({ error: "Missing or invalid order data" }), { status: 400 });
  }

  // Validate each item
  for (const item of items) {
    if (
      !item.productId ||
      typeof item.productId !== "number" ||
      !item.name ||
      typeof item.price !== "number" ||
      !item.quantity ||
      typeof item.quantity !== "number" ||
      !item.farmerId ||
      typeof item.farmerId !== "number"
    ) {
      return new Response(JSON.stringify({ error: "Invalid item data" }), { status: 400 });
    }
  }

  try {
    await client.connect();
    const db = client.db("farmers_app");

    // Verify buyer exists
    const buyer = await db.collection("users").findOne({ _id: new ObjectId(buyerId) });
    if (!buyer) {
      return new Response(JSON.stringify({ error: "Buyer not found" }), { status: 404 });
    }

    // Verify farmers and stock
    for (const item of items) {
      const farmer = await db.collection("farmers").findOne({ id: item.farmerId });
      if (!farmer) {
        return new Response(JSON.stringify({ error: `Farmer with ID ${item.farmerId} not found` }), { status: 404 });
      }

      // Simulate stock check (assuming products are stored elsewhere or hardcoded)
      // In a real app, you'd have a products collection with stock
      if (item.quantity > 2000) { // Using the stock value from cart (2000)
        return new Response(JSON.stringify({ error: `Insufficient stock for ${item.name}` }), { status: 400 });
      }
    }

    const order = {
      buyerId,
      buyerName,
      buyerPhone,
      address,
      items,
      total,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(order);

    // Update notifications for farmers
    const farmerIds = [...new Set(items.map(item => item.farmerId))];
    for (const farmerId of farmerIds) {
      await db.collection("notifications").insertOne({
        type: "new_order",
        farmerId,
        orderId: result.insertedId.toString(),
        buyerName,
        status: "pending",
        createdAt: new Date(),
      });
    }

    return new Response(JSON.stringify({ message: "Order placed successfully" }), { status: 201 });
  } catch (error) {
    console.error("Place order error:", error);
    return new Response(JSON.stringify({ error: "Failed to place order" }), { status: 500 });
  } finally {
    await client.close();
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const buyerId = searchParams.get("buyerId");

  if (!buyerId) {
    return new Response(JSON.stringify({ error: "Buyer ID is required" }), { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("farmers_app");
    const orders = await db.collection("orders").find({ buyerId }).toArray();
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), { status: 500 });
  } finally {
    await client.close();
  }
}