import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  const { name, email, phone, password, role, farmName, farmAddress, farmLat, farmLng } = await req.json();

  if (!name || !email || !phone || !password || !["buyer", "farmer-admin"].includes(role)) {
    return new Response(JSON.stringify({ error: "Missing or invalid personal fields" }), { status: 400 });
  }

  if (role === "farmer-admin" && (!farmName || !farmAddress || farmLat === undefined || farmLng === undefined)) {
    return new Response(JSON.stringify({ error: "Missing farm details for farmer role" }), { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("farmers_app");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      ...(role === "farmer-admin"
        ? {
            farmName,
            farmAddress,
            farmLat: parseFloat(farmLat),
            farmLng: parseFloat(farmLng),
            status: "pending",
          }
        : {}),
    };

    const result = await db.collection("users").insertOne(user);

    await db.collection("notifications").insertOne({
      type: role === "farmer-admin" ? "farmer_signup" : "user_signup",
      userId: result.insertedId.toString(),
      userName: name,
      userEmail: email,
      ...(role === "farmer-admin" ? { farmName, farmAddress } : {}),
      status: role === "farmer-admin" ? "pending" : "approved",
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Sign-up successful" }), { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Failed to sign up" }), { status: 500 });
  } finally {
    await client.close();
  }
}