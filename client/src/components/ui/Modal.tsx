"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import IconButton from "./IconButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClassName?: string;
}

// The only dialog primitive in the app - see docs/ui-guidelines.md "Modals":
// used for confirmations and small, section-scoped forms (never a full
// portfolio-wide editor). Radius/padding/max-width follow
// docs/design-system.md "Modals" tokens (20px radius, 32px padding, 600px).
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidthClassName = "max-w-[600px]",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-text/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative flex max-h-[85vh] w-full flex-col rounded-[20px] bg-surface shadow-elevated",
              maxWidthClassName,
            )}
          >
            <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-8">
              <div>
                <h2 id="modal-title" className="text-xl font-semibold text-text">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-sm text-textMuted">{description}</p>
                )}
              </div>
              <IconButton aria-label="Close dialog" onClick={onClose} className="shrink-0">
                <X size={18} aria-hidden="true" />
              </IconButton>
            </div>

            <div className="overflow-y-auto px-5 py-4 sm:px-8 sm:py-6">{children}</div>

            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4 sm:px-8 sm:py-5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
