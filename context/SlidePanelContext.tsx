"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SlidePanelContextType {
  isOpen: boolean;
  title: string;
  content: ReactNode | null;
  openPanel: (title: string, content: ReactNode) => void;
  closePanel: () => void;
}

const SlidePanelContext = createContext<SlidePanelContextType | undefined>(undefined);

export function SlidePanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<ReactNode | null>(null);

  const openPanel = (newTitle: string, newContent: ReactNode) => {
    setTitle(newTitle);
    setContent(newContent);
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
    // Clear content after animation completes
    setTimeout(() => {
      setContent(null);
      setTitle("");
    }, 300);
  };

  return (
    <SlidePanelContext.Provider
      value={{
        isOpen,
        title,
        content,
        openPanel,
        closePanel,
      }}
    >
      {children}
    </SlidePanelContext.Provider>
  );
}

export function useSlidePanel() {
  const context = useContext(SlidePanelContext);
  if (context === undefined) {
    throw new Error("useSlidePanel must be used within a SlidePanelProvider");
  }
  return context;
}
