"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const router = useRouter();

  async function handleCheckout() {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, timestamp: new Date().toISOString() }),
      });
      if (response.ok) {
        alert("Order placed!");
        cart.forEach((item) => removeFromCart(item.id, item.farmerId));
        router.push("/");
      } else {
        alert("Failed to place order");
      }
    } catch {
      alert("Error submitting order");
    }
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="grid gap-4">
          {cart.map((item) => (
            <Card key={`${item.farmerId}-${item.id}`}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
                <Button
                  variant="destructive"
                  className="mt-2"
                  onClick={() => removeFromCart(item.id, item.farmerId)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button className="mt-4" onClick={handleCheckout}>
            Place Order
          </Button>
        </div>
      )}
    </main>
  );
}