export type DialogType = 'error' | 'success' | 'info' | 'warning';

export interface DialogState {
  id: string;
  type: DialogType;
  title: string;
  message: string;
  autoCloseMs?: number;
}

export interface DialogStoreState {
  dialogs: DialogState[];
  currentDialog: DialogState | null;
}

export interface DialogStoreActions {
  showDialog: (dialog: Omit<DialogState, 'id'>) => void;
  closeDialog: () => void;
  clearAll: () => void;
}

export type DialogStore = DialogStoreState & DialogStoreActions;
