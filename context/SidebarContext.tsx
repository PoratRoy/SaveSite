"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isOpen: boolean;
  width: number;
  toggleSidebar: () => void;
  setWidth: (width: number) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const MIN_WIDTH = 200;
const MAX_WIDTH_VW = 30;
const DEFAULT_WIDTH = 280;
const COLLAPSED_WIDTH = 30;

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidthState] = useState(DEFAULT_WIDTH);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const setWidth = (newWidth: number) => {
    const maxWidth = (window.innerWidth * MAX_WIDTH_VW) / 100;
    const constrainedWidth = Math.max(MIN_WIDTH, Math.min(newWidth, maxWidth));
    setWidthState(constrainedWidth);
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        width,
        toggleSidebar,
        setWidth,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export { MIN_WIDTH, MAX_WIDTH_VW, COLLAPSED_WIDTH };
