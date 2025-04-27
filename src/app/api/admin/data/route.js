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

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    await client.connect();
    const db = client.db("farmers_app");

    const farmersQuery = search
      ? { name: { $regex: search, $options: "i" } }
      : {};
    const farmers = await db.collection("farmers").find(farmersQuery).toArray();
    const orders = await db.collection("orders").find().toArray();
    const reviews = await db.collection("reviews").find().toArray();
    const notifications = await db.collection("notifications").find().toArray();

    return new Response(
      JSON.stringify({
        farmers: farmers.map((f) => ({
          id: f.id,
          name: f.name,
          location: f.location,
          products: f.products,
          status: f.status,
        })),
        orders: orders.map((o) => ({
          _id: o._id.toString(),
          farmerId: o.farmerId,
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
          farmerId: r.farmerId,
          rating: r.rating,
          comment: r.comment,
          userName: r.userName,
          createdAt: r.createdAt || new Date().toISOString(),
        })),
        notifications: notifications.map((n) => ({
          _id: n._id.toString(),
          type: n.type,
          userId: n.userId,
          userName: n.userName,
          userEmail: n.userEmail,
          status: n.status,
          createdAt: n.createdAt || new Date().toISOString(),
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