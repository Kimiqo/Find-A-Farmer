"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [farmers, setFarmers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });
  const [farmerId, setFarmerId] = useState("1"); // Default to farmer ID 1
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem("isAdmin")) {
      router.push("/admin");
    }

    // Fetch farmers and orders
    async function fetchData() {
      const farmersRes = await fetch("/api/farmers");
      const farmersData = await farmersRes.json();
      setFarmers(farmersData);

      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      setOrders(ordersData);
    }
    fetchData();
  }, [router]);

  async function handleAddProduct() {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill all fields");
      return;
    }

    const product = {
      id: Date.now(), // Simple ID for demo
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
    };

    await fetch(`/api/farmers/${farmerId}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    setNewProduct({ name: "", price: "", stock: "" });
    const farmersRes = await fetch("/api/farmers");
    setFarmers(await farmersRes.json());
  }

  async function handleDeleteProduct(productId) {
    await fetch(`/api/farmers/${farmerId}/products/${productId}`, {
      method: "DELETE",
    });
    const farmersRes = await fetch("/api/farmers");
    setFarmers(await farmersRes.json());
  }

  async function handleFulfillOrder(orderId) {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "fulfilled" }),
    });
    const ordersRes = await fetch("/api/orders");
    setOrders(await ordersRes.json());
  }

  const farmer = farmers.find((f) => f.id === parseInt(farmerId));

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <Button className="mb-4" onClick={() => {
        localStorage.removeItem("isAdmin");
        router.push("/admin");
      }}>
        Log Out
      </Button>

      <div className="mb-4">
        <label className="block mb-2">Select Farmer</label>
        <select
          value={farmerId}
          onChange={(e) => setFarmerId(e.target.value)}
          className="border p-2 rounded"
        >
          {farmers.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Add Product</h2>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
        />
        <Button onClick={handleAddProduct}>Add</Button>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Products</h2>
      <div className="grid gap-4 mb-4">
        {farmer?.products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Price: ${product.price.toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              <Button
                variant="destructive"
                className="mt-2"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-2">Orders</h2>
      <div className="grid gap-4">
        {orders
          .filter((order) => order.items.some((item) => item.farmerId === parseInt(farmerId)))
          .map((order) => (
            <Card key={order.timestamp}>
              <CardHeader>
                <CardTitle>Order at {new Date(order.timestamp).toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {order.items
                    .filter((item) => item.farmerId === parseInt(farmerId))
                    .map((item, index) => (
                      <li key={index}>
                        {item.name} - ${item.price} x {item.quantity}
                      </li>
                    ))}
                </ul>
                <p>Status: {order.status || "Pending"}</p>
                <Button
                  className="mt-2"
                  onClick={() => handleFulfillOrder(order.timestamp)}
                  disabled={order.status === "fulfilled"}
                >
                  Mark as Fulfilled
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </main>
  );
}