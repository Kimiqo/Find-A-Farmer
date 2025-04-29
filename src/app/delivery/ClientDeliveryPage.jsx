"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
    } else {
      const calculatedTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(calculatedTotal);
    }
  }, [session, cart, router]);

  async function handleOrder() {
    if (!address) {
      setError("Delivery address is required");
      return;
    }

    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    console.log("Cart:", cart);

    const orderPayload = {
      buyerId: session.user.id,
      buyerName: session.user.name,
      buyerPhone: session.user.phone || "+233123456789",
      address,
      items: cart.map(item => ({
        productId: item.id, // Ensure id from cart maps to productId
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        farmerId: item.farmerId,
        farmerName: "Unknown", // Placeholder, can fetch from farmers collection if needed
      })),
      total,
    };

    console.log("Order payload:", orderPayload);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      clearCart();
      router.push("/thank-you");
    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Failed to place order");
    }
  }

  if (!session) {
    return null;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Order Summary</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <ul className="space-y-2">
                  {cart.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.name} (x{item.quantity || 1})
                      </span>
                      <span>GH₵ {item.price * (item.quantity || 1)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>GH₵ {total}</span>
                  </li>
                </ul>
              )}
            </div>
            <Input
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <Button
              onClick={handleOrder}
              className="w-full bg-[#2f855a] hover:bg-[#2f855a]/90 text-white"
            >
              Place Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}