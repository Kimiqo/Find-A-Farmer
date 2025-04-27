import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin-admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { userId } = await req.json();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("farmers_app");

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user || user.role !== "farmer-admin" || user.status !== "pending") {
      return new Response(JSON.stringify({ error: "Invalid or already approved user" }), { status: 400 });
    }

    const farmerCount = await db.collection("farmers").countDocuments();
    const newFarmerId = farmerCount + 1;

    const farmer = {
      id: newFarmerId,
      name: user.farmName,
      location: {
        address: user.farmAddress,
        lat: user.farmLat,
        lng: user.farmLng,
      },
      products: [],
      status: "approved",
    };

    await db.collection("farmers").insertOne(farmer);
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { farmerId: newFarmerId, status: "approved" }, $unset: { farmName: "", farmAddress: "", farmLat: "", farmLng: "" } }
    );
    await db.collection("notifications").updateOne(
      { userId, type: "farmer_signup", status: "pending" },
      { $set: { status: "approved", updatedAt: new Date() } }
    );

    return new Response(JSON.stringify({ message: "Farmer approved" }), { status: 200 });
  } catch (error) {
    console.error("Approve farmer error:", error);
    return new Response(JSON.stringify({ error: "Failed to approve farmer" }), { status: 500 });
  } finally {
    await client.close();
  }
}