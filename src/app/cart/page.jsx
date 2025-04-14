"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const router = useRouter();

  function handleProceedToDelivery() {
    router.push("/delivery");
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
          <Button className="mt-4" onClick={handleProceedToDelivery}>
            Proceed to Delivery
          </Button>
        </div>
      )}
    </main>
  );
}

// after that then we'll look at designing for better ux/ui experience (inlcuding breakpoints and everything, we need a landing page too, we need a number on the cart to show the number of items there)