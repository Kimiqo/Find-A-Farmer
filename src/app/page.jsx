import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Find a Farmer
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-6">
          Connect with local farmers to buy fresh, sustainable produce directly from the source.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/search">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Start Shopping
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl">
        <div className="card p-6 text-center">
          <h3 className="text-xl mb-2">Fresh Produce</h3>
          <p className="text-gray-600">
            Get farm-fresh fruits, vegetables, and more delivered to your door.
          </p>
        </div>
        <div className="card p-6 text-center">
          <h3 className="text-xl mb-2">Support Local</h3>
          <p className="text-gray-600">
            Help small farmers thrive by buying directly from them.
          </p>
        </div>
        <div className="card p-6 text-center">
          <h3 className="text-xl mb-2">Sustainable</h3>
          <p className="text-gray-600">
            Choose eco-friendly options with minimal packaging and local sourcing.
          </p>
        </div>
      </div>
    </main>
  );
}