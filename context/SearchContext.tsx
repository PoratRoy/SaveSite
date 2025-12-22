"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Folder } from "@/models/types/folder";
import { Website } from "@/models/types/website";

export interface SearchResult {
  type: "folder" | "website";
  item: Folder | Website;
  path: string; // Breadcrumb path to the item
}

interface SearchContextType {
  searchQuery: string;
  searchResults: SearchResult[];
  showResults: boolean;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string, rootFolder: Folder | null) => void;
  closeResults: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Helper to build path breadcrumb
  const buildPath = (folder: Folder, targetId: string, currentPath: string[] = []): string[] | null => {
    if (folder.id === targetId) {
      return [...currentPath, folder.name];
    }

    if (folder.children) {
      for (const child of folder.children) {
        const path = buildPath(child, targetId, [...currentPath, folder.name]);
        if (path) return path;
      }
    }

    return null;
  };

  // Recursive search through folder tree
  const searchInFolder = (
    folder: Folder,
    query: string,
    results: SearchResult[],
    parentPath: string[] = []
  ) => {
    const lowerQuery = query.toLowerCase();
    const currentPath = [...parentPath, folder.name];

    // Search in folder name
    if (folder.name.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: "folder",
        item: folder,
        path: currentPath.join(" > "),
      });
    }

    // Search in websites
    if (folder.websites) {
      for (const website of folder.websites) {
        if (
          website.title.toLowerCase().includes(lowerQuery) ||
          website.link.toLowerCase().includes(lowerQuery) ||
          website.description?.toLowerCase().includes(lowerQuery)
        ) {
          results.push({
            type: "website",
            item: website,
            path: currentPath.join(" > "),
          });
        }
      }
    }

    // Search in children
    if (folder.children) {
      for (const child of folder.children) {
        searchInFolder(child, query, results, currentPath);
      }
    }
  };

  const performSearch = (query: string, rootFolder: Folder | null) => {
    if (!query.trim() || !rootFolder) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results: SearchResult[] = [];
    searchInFolder(rootFolder, query, results, []);
    setSearchResults(results);
    setShowResults(true);
  };

  const closeResults = () => {
    setShowResults(false);
  };

  const value: SearchContextType = {
    searchQuery,
    searchResults,
    showResults,
    setSearchQuery,
    performSearch,
    closeResults,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
