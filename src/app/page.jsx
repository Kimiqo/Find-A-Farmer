import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-[#f7fafc] to-[#e5e7eb]">
      <section className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
        <Image
          src="/images/farm-hero.jpg"
          alt="Farmers market hero image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Fresh from Accra Farms
            </h1>
            <p className="text-lg sm:text-xl mb-6">
              Connect with local farmers for fresh produce
            </p>
            <Link href="/search">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg text-lg animate-pulse">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>
      <section className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-background">
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
      </section>
    </main>
  );
}