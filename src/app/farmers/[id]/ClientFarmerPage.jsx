"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/CartContext";

export default function ClientFarmerPage({ farmer }) {
  const { addToCart } = useCart();

  if (!farmer) {
    return <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">Farmer not found</div>;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl mb-4">{farmer.name}</h1>
      <p className="text-gray-600 mb-6">{farmer.location.address}</p>
      <h2 className="text-2xl md:text-3xl mb-4">Products</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {farmer.products.map((product) => (
          <Card key={product.id} className="card">
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Price: ${product.price.toFixed(2)}</p>
              <p className="text-sm">Stock: {product.stock}</p>
              <Button
                className="mt-4 bg-primary hover:bg-primary/90 text-white"
                onClick={() => addToCart(product, farmer.id)}
                disabled={product.stock === 0}
                aria-label={`Add ${product.name} to cart`}
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