"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (session && session.user.role !== "buyer") {
      router.push("/");
      return;
    }
    console.log("Cart:", cart); // Debugging
  }, [session, status, router, cart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleOrder(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!address.trim()) {
      setError("Delivery address is required");
      return;
    }

    if (!cart.length) {
      setError("Cart is empty");
      return;
    }

    const payload = {
      buyerId: session?.user?.id,
      buyerName: session?.user?.name,
      buyerPhone: session?.user?.phone || "",
      items: cart.map((item) => ({
        farmerId: item.farmerId,
        farmerName: item.farmerName || "Unknown",
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      address,
    };

    console.log("Order payload:", payload); // Debugging

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }
      clearCart();
      setSuccess("Order placed successfully!");
      setTimeout(() => router.push("/thank-you"), 2000);
    } catch (err) {
      setError(err.message);
      console.error("Order error:", err);
    }
  }

  if (status === "loading") {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  if (!session || session.user.role !== "buyer") {
    return null;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length ? (
              <ul className="space-y-2">
                {cart.map((item) => (
                  <li
                    key={`${item.farmerId}-${item.productId}`}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
                <li className="flex justify-between font-bold mt-4">
                  <span>Total</span>
                  <span>GHS {total.toFixed(2)}</span>
                </li>
              </ul>
            ) : (
              <p className="text-gray-500">Your cart is empty</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOrder} className="space-y-4">
              <Input
                placeholder="Enter delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={!cart.length || !address.trim()}
                className="w-full bg-[#2f855a] hover:bg-[#2f855a]/90 text-white"
              >
                Place Order
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}