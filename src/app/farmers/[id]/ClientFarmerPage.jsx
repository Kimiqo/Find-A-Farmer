"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/CartContext";

export default function ClientFarmerPage({ farmer }) {
  const { addToCart } = useCart();

  if (!farmer) {
    return <div className="p-4 max-w-4xl mx-auto">Farmer not found</div>;
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{farmer.name}</h1>
      <p className="mb-4">{farmer.location.address}</p>
      <h2 className="text-2xl font-semibold mb-2">Products</h2>
      <div className="grid gap-4">
        {farmer.products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Price: ${product.price.toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              <Button
                className="mt-2"
                onClick={() => addToCart(product, farmer.id)}
                disabled={product.stock === 0}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}