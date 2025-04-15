"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";

// Map farmer IDs to banner images
const farmerBanners = {
  1: "/images/farmer-1.jpg",
  2: "/images/farmer-2.jpg",
};

export default function ClientFarmerPage({ farmer }) {
  const { addToCart } = useCart();

  if (!farmer) {
    return <div className="p-4 text-muted-foreground">Loading...</div>;
  }

  const bannerSrc = farmerBanners[farmer.id] || "/images/farm-hero.jpg";

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="relative w-full h-48 sm:h-64 md:h-80 mb-6">
        <Image
          src={bannerSrc}
          alt={`Banner image of ${farmer.name}'s farm`}
          fill
          className="object-cover rounded-lg shadow-md"
          loading="eager"
          priority
        />
        <h1 className="absolute bottom-4 left-4 text-2xl sm:text-3xl font-bold text-primary-foreground bg-black/50 px-2 py-1 rounded">
          {farmer.name}
        </h1>
      </div>
      <h2 className="text-2xl md:text-3xl mb-4">Products</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {farmer.products.length ? (
          farmer.products.map((product) => (
            <Card key={product.id} className="card">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Price: ${product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                <Button
                  className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => addToCart(product, farmer.id)}
                  disabled={product.stock === 0}
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No products available.</p>
        )}
      </div>
    </main>
  );
}