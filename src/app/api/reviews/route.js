import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const farmerId = parseInt(searchParams.get("farmerId"));

  try {
    await client.connect();
    const db = client.db("farmers_app");
    const reviews = await db.collection("reviews").find({ farmerId }).toArray();
    return new Response(
      JSON.stringify(
        reviews.map((r) => ({
          _id: r._id.toString(),
          farmerId: r.farmerId,
          rating: r.rating,
          comment: r.comment,
          userName: r.userName,
          createdAt: r.createdAt || new Date().toISOString(),
        }))
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/reviews GET:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "buyer") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { farmerId, rating, comment } = await req.json();
  if (!farmerId || !rating || !comment) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("farmers_app");
    const review = {
      farmerId: parseInt(farmerId),
      rating: parseInt(rating),
      comment,
      userName: session.user.name,
      createdAt: new Date(),
    };
    await db.collection("reviews").insertOne(review);
    return new Response(JSON.stringify({ message: "Review submitted" }), { status: 201 });
  } catch (error) {
    console.error("Error in /api/reviews POST:", error);
    return new Response(JSON.stringify({ error: "Failed to submit review" }), { status: 500 });
  } finally {
    await client.close();
  }
}