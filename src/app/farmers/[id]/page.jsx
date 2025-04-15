import { getFarmers } from "@/lib/data";
import ClientFarmerPage from "./ClientFarmerPage";

export default async function FarmerPage({ params }) {
  const farmers = await getFarmers();
  const farmer = farmers.find((f) => f.id === parseInt(params.id));
  if (!farmer) {
    return <div className="p-4 text-muted-foreground">Farmer not found</div>;
  }
  return <ClientFarmerPage farmer={farmer} />;
}