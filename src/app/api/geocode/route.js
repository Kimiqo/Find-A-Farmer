import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get("zip");

  if (!zip) {
    return NextResponse.json({ error: "ZIP code required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${zip}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    );
    const data = await response.json();
    if (data.features.length === 0) {
      return NextResponse.json({ error: "Invalid ZIP code" }, { status: 404 });
    }
    const [lng, lat] = data.features[0].center;
    return NextResponse.json({ lat, lng });
  } catch (error) {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}