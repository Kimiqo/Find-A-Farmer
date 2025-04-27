"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [farmName, setFarmName] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [farmLat, setFarmLat] = useState("");
  const [farmLng, setFarmLng] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Geocode farm address using Mapbox
  async function geocodeAddress(address) {
    if (!address) return;
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}&limit=1`
      );
      const data = await response.json();
      if (data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setFarmLat(lat.toString());
        setFarmLng(lng.toString());
      } else {
        setError("Could not find location. Please try a different address.");
      }
    } catch (err) {
      setError("Failed to geocode address.");
      console.error("Geocode error:", err);
    }
  }

  useEffect(() => {
    if (farmAddress && role === "farmer-admin") {
      geocodeAddress(farmAddress);
    }
  }, [farmAddress]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !phone || !password) {
      setError("All personal fields are required");
      return;
    }

    if (role === "farmer-admin" && (!farmName || !farmAddress || !farmLat || !farmLng)) {
      setError("Farm name and address are required for farmers");
      return;
    }

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role,
        ...(role === "farmer-admin" ? { farmName, farmAddress, farmLat: parseFloat(farmLat), farmLng: parseFloat(farmLng) } : {}),
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to sign up");
      }
      setSuccess(
        role === "farmer-admin"
          ? "Sign-up successful! Awaiting admin approval."
          : "Sign-up successful! Please sign in."
      );
      setTimeout(() => router.push("/auth/signin"), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Select onValueChange={setRole} defaultValue="buyer">
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="farmer-admin">Farmer</SelectItem>
              </SelectContent>
            </Select>
            {role === "farmer-admin" && (
              <>
                <Input
                  placeholder="Farm Name"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Farm Address"
                  value={farmAddress}
                  onChange={(e) => setFarmAddress(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Latitude"
                    value={farmLat}
                    onChange={(e) => setFarmLat(e.target.value)}
                    type="number"
                    step="any"
                    readOnly
                  />
                  <Input
                    placeholder="Longitude"
                    value={farmLng}
                    onChange={(e) => setFarmLng(e.target.value)}
                    type="number"
                    step="any"
                    readOnly
                  />
                </div>
              </>
            )}
            <Button
              type="submit"
              className="w-full bg-[#2f855a] hover:bg-[#2f855a]/90 text-white"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}