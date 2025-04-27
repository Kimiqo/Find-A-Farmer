import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "farmer-admin" || !session.user.farmerId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    await client.connect();
    const db = client.db("farmers_app");
    const farmerId = parseInt(session.user.farmerId);

    const farmer = await db.collection("farmers").findOne({ id: farmerId });
    const orders = await db.collection("orders").find({ farmerId }).toArray();
    const reviews = await db.collection("reviews").find({ farmerId }).toArray();

    if (!farmer) {
      return new Response(JSON.stringify({ error: "Farmer not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        products: farmer.products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          stock: p.stock,
        })),
        orders: orders.map((o) => ({
          _id: o._id.toString(),
          buyerId: o.buyerId,
          buyerName: o.buyerName,
          buyerPhone: o.buyerPhone,
          items: o.items,
          total: o.total,
          status: o.status,
          createdAt: o.createdAt || new Date().toISOString(),
        })),
        reviews: reviews.map((r) => ({
          _id: r._id.toString(),
          rating: r.rating,
          comment: r.comment,
          userName: r.userName,
          createdAt: r.createdAt || new Date().toISOString(),
        })),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/farmer/data GET:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data", details: error.message }), { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "farmer-admin" || !session.user.farmerId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { action, data } = await req.json();
  try {
    await client.connect();
    const db = client.db("farmers_app");
    const farmerId = parseInt(session.user.farmerId);

    if (action === "addProduct") {
      const { name, price, stock } = data;
      if (!name || !price || !stock) {
        return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
      }
      const farmer = await db.collection("farmers").findOne({ id: farmerId });
      const productId = farmer.products.length + 1;
      await db.collection("farmers").updateOne(
        { id: farmerId },
        { $push: { products: { id: productId, name, price: parseFloat(price), stock: parseInt(stock) } } }
      );
      return new Response(JSON.stringify({ message: "Product added" }), { status: 201 });
    }

    if (action === "updateProduct") {
      const { productId, name, price, stock } = data;
      if (!productId || !name || !price || stock === undefined) {
        return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
      }
      await db.collection("farmers").updateOne(
        { id: farmerId, "products.id": parseInt(productId) },
        { $set: { "products.$.name": name, "products.$.price": parseFloat(price), "products.$.stock": parseInt(stock) } }
      );
      return new Response(JSON.stringify({ message: "Product updated" }), { status: 200 });
    }

    if (action === "removeProduct") {
      const { productId } = data;
      if (!productId) {
        return new Response(JSON.stringify({ error: "Missing productId" }), { status: 400 });
      }
      await db.collection("farmers").updateOne(
        { id: farmerId },
        { $pull: { products: { id: parseInt(productId) } } }
      );
      return new Response(JSON.stringify({ message: "Product removed" }), { status: 200 });
    }

    if (action === "updateOrderStatus") {
      const { orderId, status } = data;
      if (!orderId || !status) {
        return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
      }
      await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId), farmerId },
        { $set: { status } }
      );
      return new Response(JSON.stringify({ message: "Order status updated" }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
  } catch (error) {
    console.error("Error in /api/farmer/data POST:", error);
    return new Response(JSON.stringify({ error: "Failed to process request", details: error.message }), { status: 500 });
  } finally {
    await client.close();
  }
}