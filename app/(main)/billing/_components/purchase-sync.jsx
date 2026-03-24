"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifySession } from "@/actions/payment";
import { toast } from "sonner";

export default function PurchaseSync() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const success = searchParams.get("success");
  const processedRef = useRef(false);

  useEffect(() => {
    if (success === "true" && sessionId && !processedRef.current) {
      processedRef.current = true;
      
      const syncPurchase = async () => {
        const loadingToast = toast.loading("Syncing your purchase...");
        try {
          const result = await verifySession(sessionId);
          if (result.success) {
            toast.success("Purchase synced successfully!", {
              id: loadingToast,
            });
            // Remove the query params from URL without reloading
            router.replace("/billing");
          } else {
            toast.error(result.error || "Failed to sync purchase", {
              id: loadingToast,
            });
          }
        } catch (error) {
          toast.error("An error occurred while syncing purchase", {
            id: loadingToast,
          });
        }
      };

      syncPurchase();
    }
  }, [success, sessionId, router]);

  return null;
}
