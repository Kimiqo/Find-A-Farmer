import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function getFarmers() {
  try {
    await client.connect();
    const db = client.db("farmers_app");
    const farmers = await db.collection("farmers").find().toArray();
    return farmers.map(({ _id, ...farmer }) => ({
      ...farmer,
      id: farmer.id,
      location: {
        lat: farmer.location.lat,
        lng: farmer.location.lng,
        address: farmer.location.address,
      },
      products: farmer.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
      })),
    }));
  } finally {
    await client.close();
  }
}