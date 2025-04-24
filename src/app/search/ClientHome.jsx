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
  const [location, setLocation] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-0.2, 5.6], // Accra
      zoom: 10,
    });
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => map.current.remove();
  }, []);

  useEffect(() => {
    if (!map.current || !userCoords) return;

    map.current.setCenter([userCoords.lng, userCoords.lat]);
    map.current.setZoom(13);

    // Clear existing markers
    const markers = document.querySelectorAll(".mapboxgl-marker");
    markers.forEach((marker) => marker.remove());
    if (userMarker.current) {
      userMarker.current.remove();
    }

    // Add user marker (black)
    userMarker.current = new mapboxgl.Marker({ color: "#000000" })
      .setLngLat([userCoords.lng, userCoords.lat])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<div class="p-2"><h3 class="text-lg font-bold">Your Location</h3></div>`))
      .addTo(map.current);

    // Add farmer markers (green)
    farmers.forEach((farmer) => {
      const distance = getDistance(
        userCoords.lat,
        userCoords.lng,
        farmer.location.lat,
        farmer.location.lng
      );
      if (distance <= 3) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="text-lg font-bold text-secondary">${farmer.name}</h3>
            <p className="text-sm text-muted-foreground">${distance.toFixed(2)} km away</p>
            <p className="text-sm text-muted-foreground">${farmer.location.address}</p>
            <a href="/farmers/${farmer.id}" className="text-primary hover:underline">View Farm</a>
          </div>
        `);
        new mapboxgl.Marker({ color: "#2f855a" })
          .setLngLat([farmer.location.lng, farmer.location.lat])
          .setPopup(popup)
          .addTo(map.current);
      }
    });
  }, [userCoords, farmers]);

  async function fetchSuggestions(query) {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}&bbox=-0.4,5.4,0.0,5.8&limit=5`
      );
      const data = await res.json();
      setSuggestions(data.features.map((f) => ({
        name: f.place_name,
        coords: f.center,
      })));
    } catch {
      setSuggestions([]);
    }
  }

  async function handleSearch() {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${mapboxgl.accessToken}&bbox=-0.4,5.4,0.0,5.8`
      );
      const data = await res.json();
      if (!data.features.length) {
        setError("Location not found in Accra");
        return;
      }
      const [lng, lat] = data.features[0].center;
      setUserCoords({ lat, lng });
      localStorage.setItem("userLocation", JSON.stringify({ name: location, coords: { lat, lng } }));
      setError("");
      setSuggestions([]);
    } catch {
      setError("Failed to fetch location");
    }
  }

  function handleSelectSuggestion(suggestion) {
    setLocation(suggestion.name);
    setUserCoords({ lat: suggestion.coords[1], lng: suggestion.coords[0] });
    localStorage.setItem("userLocation", JSON.stringify({
      name: suggestion.name,
      coords: { lat: suggestion.coords[1], lng: suggestion.coords[0] },
    }));
    setSuggestions([]);
    setError("");
  }

  async function handleGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserCoords(coords);
          localStorage.setItem("userLocation", JSON.stringify({ name: "Current Location", coords }));
          setError("");
          setSuggestions([]);
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
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl mb-6">Find Local Farmers in Accra</h1>
      <div className="relative flex flex-col sm:flex-row gap-2 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Input
            placeholder="Enter location (e.g., Osu, Madina)"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            className="focus:ring-2 focus:ring-primary"
            aria-label="Location search"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-card shadow-lg rounded-b-lg mt-1 max-h-60 overflow-auto">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="p-2 text-sm text-foreground hover:bg-muted cursor-pointer"
                  onClick={() => handleSelectSuggestion(s)}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleSearch}
        >
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
                getDistance(userCoords.lat, userCoords.lng, farmer.location.lat, farmer.location.lng) <= 3
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