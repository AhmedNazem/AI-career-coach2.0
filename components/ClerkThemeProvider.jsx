"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, light } from "@clerk/themes";

export default function ClerkThemeProvider({ children }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const clerkTheme = mounted && resolvedTheme === "dark" ? dark : light;

  return (
    <ClerkProvider appearance={{ baseTheme: clerkTheme }}>
      {children}
    </ClerkProvider>
  );
}
