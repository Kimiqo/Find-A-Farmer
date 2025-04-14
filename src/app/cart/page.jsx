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
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <div className="grid gap-4">
          {cart.map((item) => (
            <Card key={`${item.farmerId}-${item.id}`} className="card">
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Price: ${item.price.toFixed(2)}</p>
                <p className="text-sm">Quantity: {item.quantity}</p>
                <Button
                  variant="destructive"
                  className="mt-4"
                  onClick={() => removeFromCart(item.id, item.farmerId)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button
            className="mt-6 bg-primary hover:bg-primary/90 text-white"
            onClick={handleProceedToDelivery}
          >
            Proceed to Delivery
          </Button>
        </div>
      )}
    </main>
  );
}