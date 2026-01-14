"use client";

import { useDialogStore } from "@/services/providers/dialog.provider";
import { Dialog } from "./Dialog";

export function DialogManager() {
  const currentDialog = useDialogStore((state) => state.currentDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);

  if (!currentDialog) return null;

  return (
    <Dialog
      isOpen={true}
      type={currentDialog.type}
      title={currentDialog.title}
      message={currentDialog.message}
      onClose={closeDialog}
    />
  );
}
