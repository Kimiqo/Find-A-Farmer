"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FarmerCard from "@/components/FarmerCard";
import { getDistance } from "@/lib/utils";

export default function ClientHome({ farmers }) {
  const [zip, setZip] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [error, setError] = useState("");

  async function handleSearch() {
    try {
      const response = await fetch(`/api/geocode?zip=${zip}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setUserCoords({ lat: data.lat, lng: data.lng });
      setError("");
      localStorage.setItem("userZip", zip);
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

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl mb-6">Find Local Farmers</h1>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <Input
          placeholder="Enter ZIP code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="max-w-xs"
          aria-label="ZIP code input"
        />
        <Button onClick={handleSearch}>Search</Button>
        <Button variant="outline" onClick={handleGeolocation}>
          Use My Location
        </Button>
      </div>
      {error && <p className="text-red-500 mb-6">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {userCoords &&
          farmers.map((farmer) => (
            <FarmerCard
              key={farmer.id}
              farmer={farmer}
              distance={getDistance(
                userCoords.lat,
                userCoords.lng,
                farmer.location.lat,
                farmer.location.lng
              )}
            />
          ))}
      </div>
    </main>
  );
}