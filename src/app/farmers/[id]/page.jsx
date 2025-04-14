import { getFarmers } from "@/lib/data";
import ClientFarmerPage from "./ClientFarmerPage";

export default async function FarmerPage({ params }) {
  const farmers = await getFarmers();
  const farmer = farmers.find((f) => f.id === parseInt(params.id));
  return <ClientFarmerPage farmer={farmer} />;
}