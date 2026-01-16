"use client";

import { createPortal } from "react-dom";
import Spinner from "./Spinner";

type LoadingOverlayProps = {
  message?: string;
};

export default function LoadingOverlay({
  message = "Loading...",
}: LoadingOverlayProps) {
  const overlayContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_200ms_ease-out]"
      role="status"
      aria-live="polite"
    >
      <div
        className="absolute inset-0 bg-[rgba(10,14,26,0.8)] backdrop-blur-md"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-white/80 text-lg font-medium">{message}</p>
      </div>
    </div>
  );

  if (typeof window === "undefined") return null;

  return createPortal(overlayContent, document.body);
}
