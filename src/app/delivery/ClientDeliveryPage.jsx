"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { getDistance } from "@/lib/utils";

export default function ClientDeliveryPage({ farmers }) {
  const { cart, removeFromCart } = useCart();
  const [zip, setZip] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedZip = localStorage.getItem("userZip");
    if (savedZip) {
      setZip(savedZip);
      handleSearch(savedZip);
    }
  }, []);

  async function handleSearch(zipCode) {
    try {
      const response = await fetch(`/api/geocode?zip=${zipCode}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setUserCoords({ lat: data.lat, lng: data.lng });
      setError("");
      localStorage.setItem("userZip", zipCode);
    } catch {
      setError("Failed to fetch location");
    }
  }

  async function handleGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setError("");
        },
        () => setError("Geolocation failed")
      );
    } else {
      setError("Geolocation not supported");
    }
  }

  function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  }

  function estimateDeliveryTime(farmerId) {
    if (!userCoords) return "N/A";
    const farmer = farmers.find((f) => f.id === parseInt(farmerId));
    if (!farmer) return "N/A";

    const distance = getDistance(
      userCoords.lat,
      userCoords.lng,
      farmer.location.lat,
      farmer.location.lng
    );

    const minutes = Math.round(30 + distance);
    return `${minutes} minutes`;
  }

  async function handleSubmitOrder() {
    if (!userCoords || !address) {
      alert("Please provide a valid ZIP code and address");
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          timestamp: new Date().toISOString(),
          delivery: { address, zip, coords: userCoords },
        }),
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
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl mb-6">Delivery Details</h1>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl mb-4">Your Location</h2>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input
            placeholder="Enter ZIP code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="max-w-xs"
            aria-label="ZIP code input"
          />
          <Button onClick={() => handleSearch(zip)}>Update</Button>
          <Button variant="outline" onClick={handleGeolocation}>
            Use My Location
          </Button>
        </div>
        <Input
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="max-w-md"
          aria-label="Delivery address input"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <h2 className="text-2xl md:text-3xl mb-4">Order Summary</h2>
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
                <p className="text-sm">Estimated Delivery: {estimateDeliveryTime(item.farmerId)}</p>
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
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-lg">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Total Price: ${calculateTotal()}</p>
              <Button
                className="mt-4 bg-primary hover:bg-primary/90 text-white"
                onClick={handleSubmitOrder}
              >
                Confirm Order
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}