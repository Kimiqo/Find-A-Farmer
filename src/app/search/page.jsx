import ClientHome from "./ClientHome";
import { getFarmers } from "@/lib/data";

export default async function SearchPage() {
  const farmers = await getFarmers();
  return <ClientHome farmers={farmers} />;
}