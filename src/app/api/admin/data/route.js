import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin-admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    await client.connect();
    const db = client.db("farmers_app");

    const farmers = await db.collection("farmers").find().toArray();
    const orders = await db.collection("orders").find().toArray();

    return new Response(
      JSON.stringify({
        farmers: farmers.map((f) => ({
          id: f.id,
          name: f.name,
          location: f.location,
          products: f.products,
        })),
        orders: orders.map((o) => ({
          _id: o._id.toString(),
          farmerId: o.farmerId,
          buyerId: o.buyerId,
          items: o.items,
          total: o.total,
          status: o.status,
          createdAt: o.createdAt || new Date().toISOString(), // Fallback
        })),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/admin/data GET:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data", details: error.message }), { status: 500 });
  } finally {
    await client.close();
  }
}