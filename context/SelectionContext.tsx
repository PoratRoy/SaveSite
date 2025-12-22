"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Folder } from "@/models/types/folder";
import { Website } from "@/models/types/website";

type SelectionType = "folder" | "website" | null;

interface SelectionContextType {
  selectedType: SelectionType;
  selectedFolder: Folder | null;
  selectedWebsite: Website | null;
  selectedFolderId: string | null;
  selectedWebsiteId: string | null;
  selectFolder: (folder: Folder) => void;
  selectWebsite: (website: Website) => void;
  clearSelection: () => void;
  updateSelection: (rootFolder: Folder | null) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

interface SelectionProviderProps {
  children: ReactNode;
}

export function SelectionProvider({ children }: SelectionProviderProps) {
  const [selectedType, setSelectedType] = useState<SelectionType>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);

  const selectFolder = (folder: Folder) => {
    setSelectedType("folder");
    setSelectedFolder(folder);
    setSelectedFolderId(folder.id);
    setSelectedWebsite(null);
    setSelectedWebsiteId(null);
  };

  const selectWebsite = (website: Website) => {
    setSelectedType("website");
    setSelectedWebsite(website);
    setSelectedWebsiteId(website.id);
    setSelectedFolder(null);
    setSelectedFolderId(null);
  };

  const clearSelection = () => {
    setSelectedType(null);
    setSelectedFolder(null);
    setSelectedWebsite(null);
    setSelectedFolderId(null);
    setSelectedWebsiteId(null);
  };

  // Helper function to find folder by ID in the tree
  const findFolderById = (folder: Folder, id: string): Folder | null => {
    if (folder.id === id) return folder;
    
    if (folder.children) {
      for (const child of folder.children) {
        const found = findFolderById(child, id);
        if (found) return found;
      }
    }
    
    return null;
  };

  // Helper function to find website by ID in the tree
  const findWebsiteById = (folder: Folder, id: string): Website | null => {
    if (folder.websites) {
      const website = folder.websites.find(w => w.id === id);
      if (website) return website;
    }
    
    if (folder.children) {
      for (const child of folder.children) {
        const found = findWebsiteById(child, id);
        if (found) return found;
      }
    }
    
    return null;
  };

  // Update selection when data changes
  const updateSelection = (rootFolder: Folder | null) => {
    if (!rootFolder) {
      clearSelection();
      return;
    }

    // If a folder was selected, find and update it
    if (selectedType === "folder" && selectedFolderId) {
      const updatedFolder = findFolderById(rootFolder, selectedFolderId);
      if (updatedFolder) {
        setSelectedFolder(updatedFolder);
      } else {
        // Folder was deleted, clear selection
        clearSelection();
      }
    }

    // If a website was selected, find and update it
    if (selectedType === "website" && selectedWebsiteId) {
      const updatedWebsite = findWebsiteById(rootFolder, selectedWebsiteId);
      if (updatedWebsite) {
        setSelectedWebsite(updatedWebsite);
      } else {
        // Website was deleted, clear selection
        clearSelection();
      }
    }
  };

  const value: SelectionContextType = {
    selectedType,
    selectedFolder,
    selectedWebsite,
    selectedFolderId,
    selectedWebsiteId,
    selectFolder,
    selectWebsite,
    clearSelection,
    updateSelection,
  };

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}
