"use client";

import { useDialogStore } from "@/services/providers/dialog.provider";
import { DialogType } from "@/types/dialog";

export function useDialog() {
  const showDialog = useDialogStore((state) => state.showDialog);

  const showError = (message: string, title: string = "Error") => {
    showDialog({
      type: "error" as DialogType,
      title,
      message,
    });
  };

  const showSuccess = (message: string, title: string = "Success!") => {
    showDialog({
      type: "success" as DialogType,
      title,
      message,
      autoCloseMs: 3000,
    });
  };

  const showWarning = (message: string, title: string = "Warning") => {
    showDialog({
      type: "warning" as DialogType,
      title,
      message,
    });
  };

  const showInfo = (message: string, title: string = "Info") => {
    showDialog({
      type: "info" as DialogType,
      title,
      message,
    });
  };

  return {
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
}
