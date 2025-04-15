import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// Map farmer IDs to local images
const farmerImages = {
  1: "/images/farmer-1.jpg",
  2: "/images/farmer-2.jpg",
};

export default function FarmerCard({ farmer, distance }) {
  const imageSrc = farmerImages[farmer.id] || "/images/farm-hero.jpg"; // Fallback

  return (
    <Link href={`/farmers/${farmer.id}`}>
      <Card className="card hover:bg-muted/50 transition-colors">
        <CardHeader className="p-0">
          <Image
            src={imageSrc}
            alt={`Image of ${farmer.name}'s farm`}
            width={300}
            height={200}
            className="w-full h-32 sm:h-40 object-cover rounded-t-lg"
            loading="lazy"
          />
        </CardHeader>
        <CardContent className="pt-4">
          <CardTitle className="text-xl">{farmer.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{distance.toFixed(2)} miles away</p>
          <p className="text-sm text-muted-foreground">{farmer.location.address}</p>
        </CardContent>
      </Card>
    </Link>
  );
}