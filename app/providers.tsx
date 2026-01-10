"use client";

import { PlaylistStoreProvider } from "@/services/providers/playlist.provider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PlaylistStoreProvider>{children}</PlaylistStoreProvider>
    </SessionProvider>
  );
}
