"use client";

import { PlaylistStoreProvider } from "@/services/providers/playlist.provider";
import { DialogStoreProvider } from "@/services/providers/dialog.provider";
import { DialogManager } from "@/components/DialogManager";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DialogStoreProvider>
        <PlaylistStoreProvider>
          {children}
          <DialogManager />
        </PlaylistStoreProvider>
      </DialogStoreProvider>
    </SessionProvider>
  );
}
