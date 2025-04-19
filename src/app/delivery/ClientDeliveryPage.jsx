"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { getDistance } from "@/lib/utils";

export default function ClientDeliveryPage({ farmers }) {
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleGeocode() {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&bbox=-0.4,5.4,0.0,5.8`
      );
      const data = await res.json();
      if (!data.features.length) {
        setError("Location not found in Accra");
        return;
      }
      const [lng, lat] = data.features[0].center;
      setUserCoords({ lat, lng });
      setError("");
    } catch {
      setError("Failed to fetch location");
    }
  }

  async function handleOrder() {
    if (!address || !location || !userCoords) {
      setError("Please enter address and valid location");
      return;
    }

    const order = {
      timestamp: Date.now(),
      items: cart,
      address,
      location,
      status: "pending",
      deliveryTimes: cart.map((item) => {
        const farmer = farmers.find((f) => f.id === item.farmerId);
        if (!farmer) return { itemId: item.id, time: "Unknown" };
        const distance = getDistance(
          userCoords.lat,
          userCoords.lng,
          farmer.location.lat,
          farmer.location.lng
        );
        const timeMin = Math.round((distance / 30) * 60 + 5);
        return { itemId: item.id, farmerId: item.farmerId, time: `${timeMin} min` };
      }),
    };

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    clearCart();
    router.push("/thank-you");
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl mb-6">Delivery Details</h1>
      <div className="mb-6">
        <h2 className="text-2xl mb-4">Cart</h2>
        {cart.length ? (
          <ul className="list-disc pl-5 mb-4">
            {cart.map((item) => (
              <li key={item.id} className="text-sm text-muted-foreground">
                {item.name} - GHS {item.price.toFixed(2)} x {item.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Your cart is empty.</p>
        )}
      </div>
      <div className="mb-6">
        <h2 className="text-2xl mb-4">Delivery Address</h2>
        <Input
          placeholder="Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mb-4 focus:ring-2 focus:ring-primary"
          aria-label="Street address"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Location (e.g., Osu, Madina)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="max-w-xs focus:ring-2 focus:ring-primary"
            aria-label="Location"
          />
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleGeocode}
          >
            Verify Location
          </Button>
        </div>
      </div>
      {userCoords && (
        <div className="mb-6">
          <h2 className="text-2xl mb-4">Estimated Delivery Times</h2>
          <ul className="list-disc pl-5">
            {cart.map((item) => {
              const farmer = farmers.find((f) => f.id === item.farmerId);
              if (!farmer) return null;
              const distance = getDistance(
                userCoords.lat,
                userCoords.lng,
                farmer.location.lat,
                farmer.location.lng
              );
              const timeMin = Math.round((distance / 30) * 60 + 5);
              return (
                <li key={item.id} className="text-sm text-muted-foreground">
                  {item.name} from {farmer.name}: ~{timeMin} min
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {error && <p className="text-destructive mb-6">{error}</p>}
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={handleOrder}
        disabled={!cart.length}
      >
        Place Order
      </Button>
    </main>
  );
}