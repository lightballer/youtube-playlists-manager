import { DialogState, DialogStore, DialogStoreState } from "@/types/dialog";
import { createStore } from "zustand/vanilla";

export const defaultInitState: DialogStoreState = {
  dialogs: [],
  currentDialog: null,
};

let autoCloseTimeout: NodeJS.Timeout | null = null;

export const createDialogStore = (
  initState: DialogStoreState = defaultInitState
) => {
  return createStore<DialogStore>()((set, get) => ({
    ...initState,
    showDialog: (dialog) => {
      const id = crypto.randomUUID();
      const newDialog: DialogState = { ...dialog, id };

      set((state) => {
        const newDialogs = [...state.dialogs, newDialog];

        if (!state.currentDialog) {
          if (autoCloseTimeout) {
            clearTimeout(autoCloseTimeout);
            autoCloseTimeout = null;
          }

          if (newDialog.autoCloseMs) {
            autoCloseTimeout = setTimeout(() => {
              get().closeDialog();
            }, newDialog.autoCloseMs);
          }

          return {
            dialogs: newDialogs.slice(1),
            currentDialog: newDialog,
          };
        }

        return {
          dialogs: newDialogs,
        };
      });
    },
    closeDialog: () => {
      if (autoCloseTimeout) {
        clearTimeout(autoCloseTimeout);
        autoCloseTimeout = null;
      }

      set((state) => {
        if (state.dialogs.length > 0) {
          const nextDialog = state.dialogs[0];

          if (nextDialog && nextDialog.autoCloseMs) {
            autoCloseTimeout = setTimeout(() => {
              get().closeDialog();
            }, nextDialog.autoCloseMs);
          }

          return {
            currentDialog: nextDialog || null,
            dialogs: state.dialogs.slice(1),
          };
        }

        return {
          currentDialog: null,
          dialogs: [],
        };
      });
    },
    clearAll: () => {
      if (autoCloseTimeout) {
        clearTimeout(autoCloseTimeout);
        autoCloseTimeout = null;
      }

      set({
        dialogs: [],
        currentDialog: null,
      });
    },
  }));
};
