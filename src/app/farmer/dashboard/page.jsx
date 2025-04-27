"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FarmerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (session && session.user.role !== "farmer-admin") {
      router.push("/");
      return;
    }
    async function fetchData() {
      try {
        const res = await fetch("/api/farmer/data");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch data");
        setProducts(data.products || []);
        setOrders(data.orders || []);
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err.message);
      }
    }
    if (session) fetchData();
  }, [session, status, router]);

  async function handleAddProduct(e) {
    e.preventDefault();
    setError("");
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setError("All fields are required");
      return;
    }
    try {
      const res = await fetch("/api/farmer/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addProduct", data: newProduct }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add product");
      setNewProduct({ name: "", price: "", stock: "" });
      const updatedRes = await fetch("/api/farmer/data");
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setProducts(updatedData.products || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateProduct(e) {
    e.preventDefault();
    setError("");
    if (!editProduct.name || !editProduct.price || editProduct.stock === undefined) {
      setError("All fields are required");
      return;
    }
    try {
      const res = await fetch("/api/farmer/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateProduct", data: editProduct }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");
      setEditProduct(null);
      const updatedRes = await fetch("/api/farmer/data");
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setProducts(updatedData.products || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemoveProduct(productId) {
    setError("");
    try {
      const res = await fetch("/api/farmer/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "removeProduct", data: { productId } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove product");
      const updatedRes = await fetch("/api/farmer/data");
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setProducts(updatedData.products || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateOrderStatus(orderId, status) {
    setError("");
    try {
      const res = await fetch("/api/farmer/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateOrderStatus", data: { orderId, status } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order");
      const updatedRes = await fetch("/api/farmer/data");
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setOrders(updatedData.orders || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  if (status === "loading") {
    return <div className="p-4 text-muted-foreground">Loading...</div>;
  }

  if (!session || session.user.role !== "farmer-admin") {
    return null;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto bg-gradient-to-br from-[#f7fafc] to-[#e5e7eb] rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl text-secondary">Farmer Dashboard</h1>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg animate-pulse"
        >
          Sign Out
        </Button>
      </div>
      {error && <p className="text-destructive mb-6">{error}</p>}
      <section className="mb-8">
        <h2 className="text-2xl mb-4 text-secondary">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-4 max-w-md">
          <Input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="focus:ring-2 focus:ring-primary rounded-lg"
          />
          <Input
            type="number"
            placeholder="Price (GHS)"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="focus:ring-2 focus:ring-primary rounded-lg"
          />
          <Input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="focus:ring-2 focus:ring-primary rounded-lg"
          />
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg animate-pulse"
          >
            Add Product
          </Button>
        </form>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl mb-4 text-secondary">Your Products</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.length ? (
            products.map((product) => (
              <Card key={product.id} className="hover:shadow-xl transition-shadow animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-lg">{product.name || "Unnamed Product"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Price: GHS {(product.price || 0).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Stock: {product.stock || 0}</p>
                  <div className="mt-2 flex space-x-2">
                    <Button
                      onClick={() => setEditProduct(product)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg"
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No products yet.</p>
          )}
        </div>
        {editProduct && (
          <div className="mt-4">
            <h2 className="text-2xl mb-4 text-secondary">Edit Product</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4 max-w-md">
              <Input
                placeholder="Product Name"
                value={editProduct.name || ""}
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                className="focus:ring-2 focus:ring-primary rounded-lg"
              />
              <Input
                type="number"
                placeholder="Price (GHS)"
                value={editProduct.price || ""}
                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                className="focus:ring-2 focus:ring-primary rounded-lg"
              />
              <Input
                type="number"
                placeholder="Stock"
                value={editProduct.stock || ""}
                onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                className="focus:ring-2 focus:ring-primary rounded-lg"
              />
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg animate-pulse"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditProduct(null)}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </section>
      <section className="mb-8">
        <h2 className="text-2xl mb-4 text-secondary">Orders</h2>
        {orders.length ? (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="p-4 bg-card rounded-lg shadow-md animate-slide-up">
                <p className="text-sm text-muted-foreground">Order ID: {order._id}</p>
                <p className="text-sm text-muted-foreground">
                  Buyer: {order.buyerName || "Unknown"} ({order.buyerPhone || "N/A"})
                </p>
                <p className="text-sm text-muted-foreground">Total: GHS {(order.total || 0).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Status: {order.status}</p>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                {order.status !== "fulfilled" && (
                  <Button
                    onClick={() => handleUpdateOrderStatus(order._id, "fulfilled")}
                    className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg animate-pulse"
                  >
                    Mark as Fulfilled
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No orders yet.</p>
        )}
      </section>
      <section>
        <h2 className="text-2xl mb-4 text-secondary">Your Reviews</h2>
        {reviews.length ? (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review._id} className="p-4 bg-card rounded-lg shadow-md animate-slide-up">
                <p className="text-sm text-muted-foreground">Rating: {review.rating || "N/A"}/5</p>
                <p className="text-sm">{review.comment || "No comment"}</p>
                <p className="text-sm text-muted-foreground">
                  By {review.userName || "Anonymous"} on {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No reviews yet.</p>
        )}
      </section>
    </main>
  );
}