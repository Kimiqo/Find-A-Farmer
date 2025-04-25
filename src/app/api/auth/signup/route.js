import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    if (password.length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), { status: 400 });
    }
    if (role !== "buyer") {
      return new Response(JSON.stringify({ error: "Only buyer signup is allowed" }), { status: 403 });
    }

    await client.connect();
    const db = client.db("farmers_app");
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already registered" }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    return new Response("User created", { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to sign up" }), { status: 500 });
  } finally {
    await client.close();
  }
}