"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/actions/payment";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function TokenPurchase({ amount, price, label }) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const result = await createCheckoutSession("TOKENS", amount.toString());
      if (result.url) {
        window.location.href = result.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all flex flex-col items-center gap-3">
      <span className="text-sm font-bold uppercase text-muted-foreground">{label}</span>
      <span className="text-3xl font-black">{amount} {amount === 1 ? "Token" : "Tokens"}</span>
      <span className="text-xl font-bold text-primary">${price}</span>
      <Button 
        onClick={handlePurchase} 
        disabled={loading}
        className="mt-2 px-8 rounded-full font-bold shadow-lg hover:shadow-primary/20 transition-all"
      >
        {loading ? "Processing..." : "Buy Now"}
      </Button>
    </div>
  );
}
