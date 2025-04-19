"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FarmerCard from "@/components/FarmerCard";
import { getDistance } from "@/lib/utils";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function ClientHome({ farmers }) {
  const [zip, setZip] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [error, setError] = useState("");
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-0.2, 5.6], // Accra center
      zoom: 10,
    });

    // Add navigation control (zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => map.current.remove();
  }, []);

  // Update map markers when userCoords or farmers change
  useEffect(() => {
    if (!map.current || !userCoords) return;

    // Center map on user location
    map.current.setCenter([userCoords.lng, userCoords.lat]);
    map.current.setZoom(12);

    // Clear existing markers
    const markers = document.querySelectorAll(".mapboxgl-marker");
    markers.forEach((marker) => marker.remove());

    // Add farmer markers within 10 km
    farmers.forEach((farmer) => {
      const distance = getDistance(
        userCoords.lat,
        userCoords.lng,
        farmer.location.lat,
        farmer.location.lng
      );
      if (distance <= 10) {
        // 10 km radius
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="text-lg font-bold text-secondary">${farmer.name}</h3>
            <p class="text-sm text-muted-foreground">${distance.toFixed(2)} km away</p>
            <p class="text-sm text-muted-foreground">${farmer.location.address}</p>
            <a href="/farmers/${farmer.id}" class="text-primary hover:underline">View Farm</a>
          </div>
        `);

        new mapboxgl.Marker({ color: "#2f855a" }) // Green marker
          .setLngLat([farmer.location.lng, farmer.location.lat])
          .setPopup(popup)
          .addTo(map.current);
      }
    });
  }, [userCoords, farmers]);

  async function handleSearch() {
    try {
      // Mock geocoding for Accra ZIPs (replace with Mapbox Geocoding API)
      const zipCoords = {
        "00233": { lat: 5.5536, lng: -0.1830 }, // Osu
        "00234": { lat: 5.6508, lng: -0.1867 }, // Legon
        "00235": { lat: 5.6767, lng: -0.1665 }, // Madina
      };
      const coords = zipCoords[zip];
      if (!coords) {
        setError("Invalid ZIP code for Accra");
        return;
      }
      setUserCoords(coords);
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
      <h1 className="text-3xl md:text-4xl mb-6">Find Local Farmers in Accra</h1>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <Input
          placeholder="Enter Accra ZIP code (e.g., 00233)"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="max-w-xs focus:ring-2 focus:ring-primary"
          aria-label="ZIP code input"
        />
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSearch}>
          Search
        </Button>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={handleGeolocation}
        >
          Use My Location
        </Button>
      </div>
      {error && <p className="text-destructive mb-6">{error}</p>}
      <div className="mb-6">
        <div ref={mapContainer} className="w-full h-96 sm:h-[500px] rounded-lg shadow-md" />
      </div>
      <h2 className="text-2xl md:text-3xl mb-4">Nearby Farmers</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {userCoords &&
          farmers
            .filter(
              (farmer) =>
                getDistance(userCoords.lat, userCoords.lng, farmer.location.lat, farmer.location.lng) <= 10
            )
            .map((farmer) => (
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