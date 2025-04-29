"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";
import { Textarea } from "@/components/textarea";

const farmerBanners = {
  1: "/images/farmer-1.jpg",
  2: "/images/farmer-2.jpg",
  3: "/images/farmer-3.jpg",
  4: "/images/farmer-4.jpg",
  5: "/images/farmer-5.jpg",
  6: "/images/farmer-6.jpg",
  7: "/images/farmer-7.jpg",
  8: "/images/farmer-8.jpg",
  9: "/images/farmer-9.jpg",
  10: "/images/farmer-10.jpg",
};

export default function ClientFarmerPage({ farmer }) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?farmerId=${farmer.id}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch {
        setReviews([]);
      }
    }
    fetchReviews();
  }, [farmer.id]);

  async function submitReview() {
    if (!session) {
      alert("Please sign in to submit a review");
      return;
    }
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId: farmer.id,
          userId: session.user.id,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      setNewReview({ rating: 0, comment: "" });
      alert("Review submitted for moderation");
    } catch {
      alert("Failed to submit review");
    }
  }

  if (!farmer) {
    return <div className="p-4 text-muted-foreground">Loading...</div>;
  }

  const bannerSrc = farmerBanners[farmer.id] || "/images/farm-hero.jpg";

  return (
    <main className="p-4 sm:p-6 md:p-8 w-full mx-auto bg-gradient-to-br from-[#f7fafc] to-[#e5e7eb] rounded-xl shadow-lg">
      <div className="relative w-full h-48 sm:h-64 md:h-80 mb-6 rounded-lg overflow-hidden shadow-md animate-fade-in">
        <Image
          src={bannerSrc}
          alt={`Banner image of ${farmer.name}'s farm`}
          fill
          className="object-cover"
          loading="eager"
          priority
        />
        <h1 className="absolute bottom-4 left-4 text-2xl sm:text-3xl font-bold text-primary-foreground bg-black/50 px-2 py-1 rounded">
          {farmer.name}
        </h1>
      </div>
      <p className="text-lg text-muted-foreground mb-6 animate-slide-up">{farmer.bio}</p>
      <h2 className="text-2xl md:text-3xl mb-4 text-secondary">Products</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {farmer.products.length ? (
          farmer.products.map((product) => (
            <Card key={product.id} className="card hover:shadow-xl transition-shadow animate-slide-up">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Price: GHS {product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                <Button
                  className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg animate-pulse"
                  onClick={() => addToCart(product, farmer.id)}
                  disabled={product.stock === 0}
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No products available.</p>
        )}
      </div>
      <h2 className="text-2xl md:text-3xl mb-4 text-secondary">Reviews</h2>
      {reviews.length ? (
        <ul className="space-y-4 mb-8">
          {reviews.map((review) => (
            <li key={review._id} className="p-4 bg-card rounded-lg shadow-md animate-slide-up">
              <p className="text-sm text-muted-foreground">Rating: {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
              <p className="text-xs text-muted-foreground">
                Posted on {new Date(review.timestamp).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground mb-8">No reviews yet.</p>
      )}
      {session && (
        <div className="mb-8">
          <h3 className="text-xl mb-4 text-secondary">Write a Review</h3>
          <div className="space-y-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className={`text-2xl ${star <= newReview.rating ? "text-[#f4a261]" : "text-muted-foreground"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Your review..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="rounded-lg border-primary/50 focus:ring-primary animate-fade-in"
            />
            <Button
              onClick={submitReview}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg animate-pulse"
            >
              Submit Review
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}