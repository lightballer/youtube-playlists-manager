"use client";

import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";

import { createDialogStore } from "@/services/stores/dialog.store";
import { DialogStore } from "@/types/dialog";

export type DialogStoreApi = ReturnType<typeof createDialogStore>;

export const DialogStoreContext = createContext<DialogStoreApi | undefined>(
  undefined
);

export interface DialogStoreProviderProps {
  children: ReactNode;
}

export const DialogStoreProvider = ({ children }: DialogStoreProviderProps) => {
  const [store] = useState(() => createDialogStore());
  return (
    <DialogStoreContext.Provider value={store}>
      {children}
    </DialogStoreContext.Provider>
  );
};

export const useDialogStore = <T,>(selector: (store: DialogStore) => T): T => {
  const dialogStoreContext = useContext(DialogStoreContext);
  if (!dialogStoreContext) {
    throw new Error(`useDialogStore must be used within DialogStoreProvider`);
  }

  return useStore(dialogStoreContext, selector);
};
