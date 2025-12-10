"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      config={{
        // Add minikit config here if needed later, e.g. minikit: { enabled: true }
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}

