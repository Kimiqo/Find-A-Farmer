import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const farmerImages = {
  1: "/images/farmer-1.jpg",
  2: "/images/farmer-2.jpg",
  3: "/images/farmer-3.jpg",
  4: "/images/farmer-4.jpg",
  5: "/images/farmer-5.jpg",
  6: "/images/farmer-6.jpg",
  7: "/images/farmer-7.jpg",
  8: "/images/farmer-8.jpg",
  9: "/images/farmer-9.jpg",
  10: "/images/farmer-10.jpg",
  11: "/images/farmer-11.jpg",
  12: "/images/farmer-12.jpg",
  13: "/images/farmer-13.jpg",
  14: "/images/farmer-14.jpg",
  15: "/images/farmer-15.jpg",
  16: "/images/farmer-16.jpg",
  17: "/images/farmer-17.jpg",
  18: "/images/farmer-18.jpg",
  19: "/images/farmer-19.jpg",
  20: "/images/farmer-20.jpg",
  21: "/images/farmer-21.jpg",
  22: "/images/farmer-22.jpg",
  23: "/images/farmer-23.jpg",
};

export default function FarmerCard({ farmer, distance }) {
  const imageSrc = farmerImages[farmer.id] || "/images/farm-hero.jpg";

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
          <p className="text-sm text-muted-foreground">{distance.toFixed(2)} km away</p>
          <p className="text-sm text-muted-foreground">{farmer.location.address}</p>
          <p className="text-sm text-muted-foreground">
            Products from GHS {Math.min(...farmer.products.map(p => p.price)).toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}