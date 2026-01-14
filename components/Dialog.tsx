"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { DialogType } from "@/types/dialog";

interface DialogProps {
  isOpen: boolean;
  type: DialogType;
  title: string;
  message: string;
  onClose: () => void;
}

export function Dialog({ isOpen, type, title, message, onClose }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTab);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "error":
        return {
          borderColor: "border-red-500",
          iconColor: "text-red-500",
          titleColor: "text-red-400",
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
        };
      case "success":
        return {
          borderColor: "border-green-500",
          iconColor: "text-green-500",
          titleColor: "text-green-400",
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
          glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
        };
      case "warning":
        return {
          borderColor: "border-yellow-500",
          iconColor: "text-yellow-500",
          titleColor: "text-yellow-400",
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ),
        };
      case "info":
        return {
          borderColor: "border-cyan-500",
          iconColor: "text-cyan-500",
          titleColor: "text-cyan-400",
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
    }
  };

  const styles = getTypeStyles();

  const dialogContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_200ms_ease-out]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-[rgba(10,14,26,0.8)] backdrop-blur-md"
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className={`relative w-full max-w-120 bg-white/10 border border-white/15 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-t-4 ${
          styles.borderColor
        } ${styles.glow || ""} animate-[scaleIn_200ms_ease-out]`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${styles.iconColor}`}
          >
            {styles.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="dialog-title"
              className={`text-xl font-semibold ${styles.titleColor}`}
            >
              {title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-all duration-200 flex items-center justify-center"
            aria-label="Close dialog"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div id="dialog-message" className="text-white/80 leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
