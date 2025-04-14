import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Find a Farmer</h1>
      <div className="flex gap-2 mb-4">
        <Input placeholder="Enter ZIP code" />
        <Button>Search</Button>
      </div>
    </main>
  );
}