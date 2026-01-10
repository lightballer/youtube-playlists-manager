"use client";

import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";

import {
  type PlaylistStore,
  createPlaylistStore,
} from "@/services/stores/playlist.store";

export type PlaylistStoreApi = ReturnType<typeof createPlaylistStore>;

export const PlaylistStoreContext = createContext<PlaylistStoreApi | undefined>(
  undefined
);

export interface PlaylistStoreProviderProps {
  children: ReactNode;
}

export const PlaylistStoreProvider = ({
  children,
}: PlaylistStoreProviderProps) => {
  const [store] = useState(() => createPlaylistStore());
  return (
    <PlaylistStoreContext.Provider value={store}>
      {children}
    </PlaylistStoreContext.Provider>
  );
};

export const usePlaylistStore = <T,>(
  selector: (store: PlaylistStore) => T
): T => {
  const playlistStoreContext = useContext(PlaylistStoreContext);
  if (!playlistStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(playlistStoreContext, selector);
};
