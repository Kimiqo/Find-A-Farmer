import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FarmerCard({ farmer, distance }) {
  return (
    <Link href={`/farmers/${farmer.id}`}>
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-xl">{farmer.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{distance.toFixed(2)} miles away</p>
          <p className="text-sm text-gray-600">{farmer.location.address}</p>
        </CardContent>
      </Card>
    </Link>
  );
}