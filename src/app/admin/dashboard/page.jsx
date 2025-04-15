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
  const [farmerId, setFarmerId] = useState("1");
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      router.push("/admin");
    }

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
      id: Date.now(),
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
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl mb-6">Admin Dashboard</h1>
      <Button
        className="mb-6 bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={() => {
          localStorage.removeItem("isAdmin");
          router.push("/admin");
        }}
        aria-label="Log out"
      >
        Log Out
      </Button>

      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold" htmlFor="farmer-select">
          Select Farmer
        </label>
        <select
          id="farmer-select"
          value={farmerId}
          onChange={(e) => setFarmerId(e.target.value)}
          className="border border-input p-2 rounded w-full max-w-xs focus:ring-2 focus:ring-primary"
          aria-label="Select farmer"
        >
          {farmers.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-2xl md:text-3xl mb-4">Add Product</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="max-w-xs focus:ring-2 focus:ring-primary"
          aria-label="Product name input"
        />
        <Input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="max-w-xs focus:ring-2 focus:ring-primary"
          aria-label="Price input"
          min="0"
          step="0.01"
        />
        <Input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          className="max-w-xs focus:ring-2 focus:ring-primary"
          aria-label="Stock input"
          min="0"
        />
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleAddProduct}
          aria-label="Add product"
        >
          Add
        </Button>
      </div>

      <h2 className="text-2xl md:text-3xl mb-4">Products</h2>
      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        {farmer?.products.length ? (
          farmer.products.map((product) => (
            <Card key={product.id} className="card">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Price: ${product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                <Button
                  variant="destructive"
                  className="mt-4"
                  onClick={() => handleDeleteProduct(product.id)}
                  aria-label={`Delete ${product.name}`}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No products available.</p>
        )}
      </div>

      <h2 className="text-2xl md:text-3xl mb-4">Orders</h2>
      <div className="grid gap-4">
        {orders
          .filter((order) => order.items.some((item) => item.farmerId === parseInt(farmerId)))
          .length ? (
          orders
            .filter((order) => order.items.some((item) => item.farmerId === parseInt(farmerId)))
            .map((order) => (
              <Card key={order.timestamp} className="card">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Order at {new Date(order.timestamp).toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 mb-4">
                    {order.items
                      .filter((item) => item.farmerId === parseInt(farmerId))
                      .map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {item.name} - ${item.price.toFixed(2)} x {item.quantity}
                        </li>
                      ))}
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Status: {order.status || "Pending"}
                  </p>
                  <Button
                    className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleFulfillOrder(order.timestamp)}
                    disabled={order.status === "fulfilled"}
                    aria-label={`Mark order from ${order.timestamp} as fulfilled`}
                  >
                    Mark as Fulfilled
                  </Button>
                </CardContent>
              </Card>
            ))
        ) : (
          <p className="text-muted-foreground">No orders for this farmer.</p>
        )}
      </div>
    </main>
  );
}