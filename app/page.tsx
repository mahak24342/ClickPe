"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Chat } from "./components/Chat";

// Product Type
type Product = {
  id: string;
  name: string;
  bank: string;
  rate_apr: number;
  min_income: number;
  min_credit_score: number;
  tenure_min_months: number;
  tenure_max_months: number;
  summary: string;
  disbursal_speed: "fast" | "instant" | "standard";
  docs_level: "low" | "standard";
};

function getBadges(product: Product) {
  const badges: string[] = [];

  if (product.rate_apr < 10) badges.push("Low APR");
  if (product.disbursal_speed === "fast" || product.disbursal_speed === "instant")
    badges.push("Fast Disbursal");
  if (product.docs_level === "low") badges.push("Low Docs");
  if (product.min_income < 35000) badges.push("Low Income Eligible");

  return badges.slice(0, 3);
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products from backend
  async function loadProducts() {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-lg text-muted-foreground">
        Loading your loan matches...
      </div>
    );
  }

  const top5 = products.slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold">YOUR TOP LOAN MATCHES</h1>
        <p className="text-muted-foreground mt-2">
          These loan products match your profile the best.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {top5.map((product, index) => {
          const badges = getBadges(product);

          return (
            <Card
              key={product.id}
              className="p-4 rounded-2xl shadow-md hover:shadow-lg transition border"
            >
              <CardHeader>
                <CardTitle className="space-y-1">
                  {index === 0 && (
                    <span className="text-green-600 text-sm font-semibold">
                      ⭐ Best Match
                    </span>
                  )}
                  <div className="text-xl font-semibold">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.bank}</div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  {badges.map((b) => (
                    <Badge key={b} className="rounded-full px-3 py-1 text-sm">
                      {b}
                    </Badge>
                  ))}
                </div>

                {/* Details */}
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">APR:</span> {product.rate_apr}%
                  </p>
                  <p>
                    <span className="font-medium">Min Income:</span> ₹{product.min_income}
                  </p>
                  <p>
                    <span className="font-medium">Credit Score:</span>{" "}
                    {product.min_credit_score}
                  </p>
                </div>

                {/* CTA */}
                <Chat product={product}/>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
