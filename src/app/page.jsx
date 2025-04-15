import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-background">
      <div className="relative w-full max-w-6xl mb-8">
        <Image
          src="/images/farm-hero.jpg"
          alt="Vibrant farm landscape with rolling fields"
          width={1200}
          height={400}
          className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg shadow-md"
          loading="eager"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground">
            Find a Farmer
          </h1>
        </div>
      </div>
      <div className="text-center max-w-2xl mb-8">
        <p className="text-lg sm:text-xl text-muted-foreground">
          Connect with local farmers to buy fresh, sustainable produce directly from the source.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/search">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Shopping
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl">
        <div className="card p-6 text-center flex flex-col items-center">
          <Image
            src="/images/produce.jpg"
            alt="Basket of fresh vegetables"
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-full mb-4"
            loading="lazy"
          />
          <h3 className="text-xl mb-2">Fresh Produce</h3>
          <p className="text-muted-foreground">
            Get farm-fresh fruits, vegetables, and more delivered to your door.
          </p>
        </div>
        <div className="card p-6 text-center flex flex-col items-center">
          <Image
            src="/images/local.jpg"
            alt="Farmers at a local market"
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-full mb-4"
            loading="lazy"
          />
          <h3 className="text-xl mb-2">Support Local</h3>
          <p className="text-muted-foreground">
            Help small farmers thrive by buying directly from them.
          </p>
        </div>
        <div className="card p-6 text-center flex flex-col items-center">
          <Image
            src="/images/sustainable.jpg"
            alt="Sustainable farming practices"
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-full mb-4"
            loading="lazy"
          />
          <h3 className="text-xl mb-2">Sustainable</h3>
          <p className="text-muted-foreground">
            Choose eco-friendly options with minimal packaging and local sourcing.
          </p>
        </div>
      </div>
    </main>
  );
}