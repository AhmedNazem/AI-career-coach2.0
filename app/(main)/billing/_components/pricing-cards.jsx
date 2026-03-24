"use client";

import { useState } from "react";
import { pricingPlans } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createCheckoutSession } from "@/actions/payment";
import { toast } from "sonner";

export default function PricingCards({ currentSubscription }) {
  const [loading, setLoading] = useState(null);

  const handleUpgrade = async (plan) => {
    setLoading(plan.tier);
    try {
      const result = await createCheckoutSession("SUBSCRIPTION", plan.tier);
      if (result.url) {
        window.location.href = result.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(null);
    }
  };

  const tierWeights = {
    FREE: 0,
    STARTER: 1,
    PRO: 2,
  };

  const currentWeight = tierWeights[currentSubscription] || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {pricingPlans.map((plan) => {
        const planWeight = tierWeights[plan.tier] || 0;
        const isCurrent = plan.tier === currentSubscription;
        const isLowerTier = planWeight < currentWeight;

        return (
          <Card
            key={plan.name}
            className={`flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group bg-card/50 backdrop-blur-md border-primary/10 ${
              plan.popular ? "border-primary shadow-lg scale-105 z-10" : ""
            } ${isCurrent ? "ring-2 ring-primary ring-offset-4 ring-offset-background" : ""}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-none rounded-bl-lg px-4 py-1.5 font-bold uppercase tracking-wider">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                {isCurrent && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">
                    Current Plan
                  </Badge>
                )}
              </div>
              <CardDescription className="text-muted-foreground">
                {plan.description}
              </CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">
                  ${plan.price}
                </span>
                <span className="text-muted-foreground font-medium">/month</span>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div className="bg-primary/10 p-1 rounded-full text-primary mt-0.5">
                      <Check className="size-3" />
                    </div>
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className={`w-full font-bold h-11 transition-all ${
                  isCurrent || isLowerTier ? "bg-muted text-muted-foreground opacity-50" : (plan.popular ? "bg-primary hover:bg-primary/90 shadow-xl" : "variant-outline")
                }`}
                variant={isCurrent ? "outline" : (plan.popular ? "default" : "outline")}
                disabled={isCurrent || isLowerTier || loading === plan.tier}
                onClick={() => handleUpgrade(plan)}
              >
                {loading === plan.tier ? "Processing..." : 
                 isCurrent ? "Active Plan" : 
                 isLowerTier ? "Included in your plan" : 
                 planWeight > currentWeight ? "Upgrade" : plan.buttonText}
              </Button>
            </CardFooter>

            {/* Premium Visual Flourish */}
            <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
          </Card>
        );
      })}
    </div>
  );
}
