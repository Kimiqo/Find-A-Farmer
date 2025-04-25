import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const farmerId = parseInt(searchParams.get("farmerId"));

  if (!farmerId) {
    return new Response(JSON.stringify({ error: "Farmer ID is required" }), { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("farmers_app");
    const reviews = await db
      .collection("reviews")
      .find({ farmerId, status: "approved" })
      .toArray();
    return new Response(JSON.stringify(reviews.map(review => ({
      ...review,
      _id: review._id.toString(),
      timestamp: review.timestamp
    }))), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req) {
  const { farmerId, userId, rating, comment } = await req.json();

  if (!farmerId || !userId || !rating || !comment) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("farmers_app");
    await db.collection("reviews").insertOne({
      farmerId: parseInt(farmerId),
      userId,
      rating: parseInt(rating),
      comment,
      timestamp: Date.now(),
      status: "pending",
    });
    return new Response("Review submitted", { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to submit review" }), { status: 500 });
  } finally {
    await client.close();
  }
}