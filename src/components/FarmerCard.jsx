import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FarmerCard({ farmer, distance }) {
  return (
    <Link href={`/farmers/${farmer.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{farmer.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{distance.toFixed(2)} miles away</p>
          <p>{farmer.location.address}</p>
        </CardContent>
      </Card>
    </Link>
  );
}