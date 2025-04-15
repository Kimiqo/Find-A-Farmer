import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-background">
      <div className="relative w-full max-w-6xl mb-8">
        <Image
          src="/images/farm-hero.jpg"
          alt="Lush farmland showcasing sustainable agriculture"
          width={1200}
          height={400}
          className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg shadow-md"
          loading="eager"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground">
            About Find a Farmer
          </h1>
        </div>
      </div>

      <section className="max-w-4xl mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl mb-4">Our Mission</h2>
        <p className="text-lg text-muted-foreground mb-6">
          At Find a Farmer, we’re passionate about connecting communities with local farmers. Our platform makes it easy to discover fresh, sustainable produce while supporting small-scale agriculture.
        </p>
        <Image
          src="/images/produce.jpg"
          alt="Freshly harvested vegetables from local farms"
          width={400}
          height={300}
          className="w-full max-w-md mx-auto h-48 sm:h-64 object-cover rounded-lg shadow-md mb-6"
          loading="lazy"
        />
        <Link href="/search">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Shop Local Now
          </Button>
        </Link>
      </section>

      <section className="max-w-4xl mb-12">
        <h2 className="text-2xl sm:text-3xl mb-4 text-center">Our Story</h2>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/2">
            <p className="text-lg text-muted-foreground">
              Founded with a love for fresh food and community, Find a Farmer started as a way to bridge the gap between urban dwellers and rural farmers. We believe in transparent sourcing and empowering farmers to thrive.
            </p>
          </div>
          <Image
            src="/images/local.jpg"
            alt="Farmers and customers at a vibrant market"
            width={300}
            height={200}
            className="md:w-1/2 h-40 sm:h-48 object-cover rounded-lg shadow-md"
            loading="lazy"
          />
        </div>
      </section>

      <section className="max-w-4xl">
        <h2 className="text-2xl sm:text-3xl mb-4 text-center">Our Values</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div className="card p-6 text-center flex flex-col items-center">
            <Image
              src="/images/produce.jpg"
              alt="Organic produce grown sustainably"
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-full mb-4"
              loading="lazy"
            />
            <h3 className="text-xl mb-2">Quality</h3>
            <p className="text-muted-foreground">
              We prioritize fresh, high-quality produce grown with care.
            </p>
          </div>
          <div className="card p-6 text-center flex flex-col items-center">
            <Image
              src="/images/local.jpg"
              alt="Community supporting local farmers"
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-full mb-4"
              loading="lazy"
            />
            <h3 className="text-xl mb-2">Community</h3>
            <p className="text-muted-foreground">
              We strengthen ties between farmers and their neighbors.
            </p>
          </div>
          <div className="card p-6 text-center flex flex-col items-center">
            <Image
              src="/images/sustainable.jpg"
              alt="Eco-friendly farming practices"
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-full mb-4"
              loading="lazy"
            />
            <h3 className="text-xl mb-2">Sustainability</h3>
            <p className="text-muted-foreground">
              We promote eco-conscious farming for a healthier planet.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}