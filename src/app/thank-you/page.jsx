import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ThankYouPage() {
  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl mb-6 text-secondary">Thank You for Your Order!</h1>
      <div className="mb-6">
        <Image
          src="/images/farm-hero.jpg"
          alt="Fresh produce from local farmers"
          width={600}
          height={400}
          className="w-full max-w-md mx-auto rounded-lg shadow-md object-cover"
          loading="eager"
        />
      </div>
      <p className="text-lg text-muted-foreground mb-4">
        Your order has been placed successfully. You’ll receive your fresh produce from local Accra farmers soon!
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Check your email for order details and estimated delivery times.
      </p>
      <Link href="/">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Back to Homepage
        </Button>
      </Link>
    </main>
  );
}