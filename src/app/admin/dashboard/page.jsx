"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [farmers, setFarmers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (session && session.user.role !== "admin-admin") {
      router.push("/");
      return;
    }
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/data");
        const data = await res.json();
        if (!res.ok) throw new Error(data.details || "Failed to fetch data");
        setFarmers(data.farmers);
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      }
    }
    if (session) fetchData();
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="p-4 text-muted-foreground">Loading...</div>;
  }

  if (!session || session.user.role !== "admin-admin") {
    return null;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto bg-gradient-to-br from-[#f7fafc] to-[#e5e7eb] rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl text-secondary">Admin Dashboard</h1>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg animate-pulse"
        >
          Sign Out
        </Button>
      </div>
      {error && <p className="text-destructive mb-6">{error}</p>}
      <section className="mb-8">
        <h2 className="text-2xl mb-4 text-secondary">Farmers</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {farmers.length ? (
            farmers.map((farmer) => (
              <Card key={farmer.id} className="hover:shadow-xl transition-shadow animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-lg">{farmer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">ID: {farmer.id}</p>
                  <p className="text-sm text-muted-foreground">Location: {farmer.location.address}</p>
                  <p className="text-sm text-muted-foreground">Products: {farmer.products.length}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No farmers found.</p>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-2xl mb-4 text-secondary">All Orders</h2>
        {orders.length ? (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="p-4 bg-card rounded-lg shadow-md animate-slide-up">
                <p className="text-sm text-muted-foreground">Order ID: {order._id}</p>
                <p className="text-sm text-muted-foreground">Farmer ID: {order.farmerId}</p>
                <p className="text-sm text-muted-foreground">Total: GHS {order.total}</p>
                <p className="text-sm text-muted-foreground">Status: {order.status}</p>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No orders found.</p>
        )}
      </section>
    </main>
  );
}