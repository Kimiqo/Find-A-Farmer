"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { getDistance } from "@/lib/utils";

export default function ClientDeliveryPage({ farmers }) {
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserCoords(coords);
          localStorage.setItem("userLocation", JSON.stringify({ name: "Current Location", coords }));
          setError("");
        },
        () => {
          setError("Geolocation failed. Using Accra center.");
          setUserCoords({ lat: 5.6, lng: -0.2 }); // Accra fallback
        }
      );
    } else {
      setError("Geolocation not supported. Using Accra center.");
      setUserCoords({ lat: 5.6, lng: -0.2 });
    }
  }, []);

  async function handleOrder() {
    if (!address || !userCoords) {
      setError("Please enter a street address.");
      return;
    }

    try {
      const order = {
        timestamp: Date.now(),
        items: cart,
        address,
        location: userCoords.lat === 5.6 && userCoords.lng === -0.2 ? "Accra Center (Fallback)" : "Current Location",
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

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      clearCart();
      router.push("/thank-you");
    } catch (err) {
      setError("Failed to place order. Please try again.");
    }
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
        <p className="text-sm text-muted-foreground">
          {userCoords?.lat === 5.6 && userCoords?.lng === -0.2
            ? "Using Accra center (enable location services for precise delivery)."
            : "Using your current location for delivery."}
        </p>
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
        disabled={!cart.length || !address || !userCoords}
      >
        Place Order
      </Button>
    </main>
  );
}