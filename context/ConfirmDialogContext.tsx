"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmDialogContextType {
  isOpen: boolean;
  options: ConfirmDialogOptions | null;
  openDialog: (options: ConfirmDialogOptions) => void;
  closeDialog: () => void;
  confirm: () => void;
  cancel: () => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);

  const openDialog = (newOptions: ConfirmDialogOptions) => {
    setOptions(newOptions);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setTimeout(() => {
      setOptions(null);
    }, 200);
  };

  const confirm = () => {
    if (options?.onConfirm) {
      options.onConfirm();
    }
    closeDialog();
  };

  const cancel = () => {
    if (options?.onCancel) {
      options.onCancel();
    }
    closeDialog();
  };

  return (
    <ConfirmDialogContext.Provider
      value={{
        isOpen,
        options,
        openDialog,
        closeDialog,
        confirm,
        cancel,
      }}
    >
      {children}
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (context === undefined) {
    throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider");
  }
  return context;
}
