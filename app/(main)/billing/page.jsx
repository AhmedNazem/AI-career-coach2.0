import { checkUser } from "@/lib/checkUser";
import { Suspense } from "react";
import PricingCards from "./_components/pricing-cards";
import TokenPurchase from "./_components/token-purchase";
import PurchaseSync from "./_components/purchase-sync";

export default async function BillingPage() {
  const user = await checkUser();

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl pt-24">
      <Suspense fallback={null}>
        <PurchaseSync />
      </Suspense>
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight gradient-title">
          Plans & Pricing
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
          Choose the best plan for your career growth. Each AI Interview takes 1
          token.
        </p>

        {user && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl px-8 py-4 mt-6 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                  Current Subscription
                </p>
                <p className="text-2xl font-black text-primary">
                  {user.subscription}
                </p>
              </div>
              <div className="h-10 w-px bg-primary/20" />
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                  Tokens Remaining
                </p>
                <p className="text-2xl font-black text-primary">
                  {user.tokens}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <PricingCards currentSubscription={user?.subscription} />

      <div className="mt-20 text-center border-t pt-12">
        <h3 className="text-2xl font-bold mb-4">Need More Tokens?</h3>
        <p className="text-muted-foreground mb-8">
          You can buy individual interview tokens without upgrading your
          subscription.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          <TokenPurchase amount={1} price={5} label="Starter Pack" />
          <TokenPurchase amount={5} price={20} label="Career Booster" />
          <TokenPurchase amount={10} price={35} label="Interview Pro" />
        </div>
      </div>
    </div>
  );
}
