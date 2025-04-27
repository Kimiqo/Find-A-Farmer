"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [farmers, setFarmers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
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
        const res = await fetch(`/api/admin/data?search=${encodeURIComponent(search)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch data");
        setFarmers(data.farmers || []);
        setOrders(data.orders || []);
        setReviews(data.reviews || []);
        setNotifications(data.notifications || []);
      } catch (err) {
        setError(err.message);
      }
    }
    if (session) fetchData();
  }, [session, status, router, search]);

  async function handleApproveFarmer(userId) {
    try {
      const res = await fetch("/api/admin/approve-farmer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve farmer");
      setNotifications(notifications.filter((n) => n.userId !== userId));
      const updatedRes = await fetch(`/api/admin/data?search=${encodeURIComponent(search)}`);
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setFarmers(updatedData.farmers || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }

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
        <h2 className="text-2xl mb-4 text-secondary">Search Farmers</h2>
        <Input
          placeholder="Search by farmer name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md focus:ring-2 focus:ring-primary rounded-lg"
        />
      </section>
      <section className="mb-8">
        <h2 className="text-2xl mb-4 text-secondary">Notifications</h2>
        {notifications.length ? (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li key={n._id} className="p-4 bg-card rounded-lg shadow-md animate-slide-up">
                <p className="text-sm text-muted-foreground">
                  {n.type === "user_signup" ? "New User" : "New Farmer"}: {n.userName || "Unknown"} ({n.userEmail})
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(n.createdAt).toLocaleDateString()}
                </p>
                {n.type === "farmer_signup" && n.status === "pending" && (
                  <Button
                    onClick={() => handleApproveFarmer(n.userId)}
                    className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg animate-pulse"
                  >
                    Approve
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No notifications.</p>
        )}
      </section>
      <section className="mb-8">
        <h2 className="text-2xl mb-4 text-secondary">Farmers</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {farmers.length ? (
            farmers.map((farmer) => (
              <Card key={farmer._id || farmer.id} className="hover:shadow-xl transition-shadow animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-lg">{farmer.name || "Unnamed Farmer"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">ID: {farmer.id}</p>
                  <p className="text-sm text-muted-foreground">Location: {farmer.location?.address || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">Status: {farmer.status || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">Products:</p>
                  <ul className="list-disc pl-4">
                    {(farmer.products || []).map((p) => (
                      <li key={p.id} className="text-sm text-muted-foreground">
                        {p.name || "Unnamed"} - GHS {(p.price || 0).toFixed(2)}, Stock: {p.stock || 0}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No farmers found.</p>
          )}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl mb-4 text-secondary">All Orders</h2>
        {orders.length ? (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="p-4 bg-card rounded-lg shadow-md animate-slide-up">
                <p className="text-sm text-muted-foreground">Order ID: {order._id}</p>
                <p className="text-sm text-muted-foreground">Farmer ID: {order.farmerId}</p>
                <p className="text-sm text-muted-foreground">
                  Buyer: {order.buyerName || "Unknown"} ({order.buyerPhone || "N/A"})
                </p>
                <p className="text-sm text-muted-foreground">Total: GHS {(order.total || 0).toFixed(2)}</p>
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
      <section>
        <h2 className="text-2xl mb-4 text-secondary">All Reviews</h2>
        {reviews.length ? (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review._id} className="p-4 bg-card rounded-lg shadow-md animate-slide-up">
                <p className="text-sm text-muted-foreground">Farmer ID: {review.farmerId}</p>
                <p className="text-sm text-muted-foreground">Rating: {review.rating || "N/A"}/5</p>
                <p className="text-sm">{review.comment || "No comment"}</p>
                <p className="text-sm text-muted-foreground">
                  By {review.userName || "Anonymous"} on {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No reviews found.</p>
        )}
      </section>
    </main>
  );
}