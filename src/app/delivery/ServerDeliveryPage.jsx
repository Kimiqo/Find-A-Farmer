import { getFarmers } from "@/lib/data";
import DeliveryPage from "./ClientDeliveryPage";

export default async function ServerDeliveryPage() {
  const farmers = await getFarmers();
  return <DeliveryPage farmers={farmers} />;
}