"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { Folder } from "@/models/types/folder";
import { getFoldersTreeAction } from "@/app/actions/GET/getFoldersTreeAction";
import { createFolderAction } from "@/app/actions/POST/createFolderAction";
import { createWebsiteAction } from "@/app/actions/POST/createWebsiteAction";
import { deleteFolderAction } from "@/app/actions/DELETE/deleteFolderAction";
import { deleteWebsiteAction } from "@/app/actions/DELETE/deleteWebsiteAction";
import { getUserByEmailAction } from "@/app/actions/GET/getUserByEmailAction";

interface DataContextType {
  rootFolder: Folder | null;
  isLoading: boolean;
  error: string | null;
  userId: string;
  addFolder: (parentId: string, name: string) => Promise<void>;
  addWebsite: (folderId: string, title: string, url: string) => Promise<void>;
  removeFolder: (folderId: string) => Promise<void>;
  removeWebsite: (websiteId: string) => Promise<void>;
  refreshFolders: () => Promise<void>;
  onDataChange?: (rootFolder: Folder | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
  onDataChange?: (rootFolder: Folder | null) => void;
}

export function DataProvider({ children, onDataChange }: DataProviderProps) {
  const { data: session } = useSession();
  const [rootFolder, setRootFolder] = useState<Folder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  const userEmail = session?.user?.email || "";

  // Fetch user ID from email
  useEffect(() => {
    const fetchUserId = async () => {
      if (!userEmail) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getUserByEmailAction(userEmail);
        if (response.success && response.data) {
          setUserId(response.data.id);
        } else {
          setError(response.message || "User not found");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user");
        setIsLoading(false);
      }
    };

    fetchUserId();
  }, [userEmail]);

  // Fetch folders tree when userId is available
  const fetchFoldersTree = async () => {
    if (!userId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const tree = await getFoldersTreeAction(userId);
      
      let updatedTree: Folder;
      if (!tree) {
        updatedTree = {
          id: "root",
          name: "My Websites",
          userId,
          parentId: null,
          createdAt: new Date(),
          children: [],
          websites: [],
        };
      } else {
        updatedTree = tree;
      }
      
      setRootFolder(updatedTree);
      
      // Notify about data change
      if (onDataChange) {
        onDataChange(updatedTree);
      }
    } catch (err) {
      console.error("Error fetching folders:", err);
      setError("Failed to load folders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFoldersTree();
  }, [userId]);

  // CRUD Operations
  const addFolder = async (parentId: string, name: string) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      await createFolderAction({
        name,
        userId,
        parentId,
      });
      await fetchFoldersTree();
    } catch (err) {
      console.error("Error creating folder:", err);
      throw new Error("Failed to create folder");
    }
  };

  const addWebsite = async (folderId: string, title: string, url: string) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      await createWebsiteAction({
        title,
        link: url,
        ownerId: userId,
        folderId,
      });
      await fetchFoldersTree();
    } catch (err) {
      console.error("Error creating website:", err);
      throw new Error("Failed to create website");
    }
  };

  const removeFolder = async (folderId: string) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      await deleteFolderAction({
        folderId,
        userId,
      });
      await fetchFoldersTree();
    } catch (err) {
      console.error("Error deleting folder:", err);
      throw new Error("Failed to delete folder");
    }
  };

  const removeWebsite = async (websiteId: string) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      await deleteWebsiteAction({
        websiteId,
        userId,
      });
      await fetchFoldersTree();
    } catch (err) {
      console.error("Error deleting website:", err);
      throw new Error("Failed to delete website");
    }
  };

  const refreshFolders = async () => {
    await fetchFoldersTree();
  };

  const value: DataContextType = {
    rootFolder,
    isLoading,
    error,
    userId,
    addFolder,
    addWebsite,
    removeFolder,
    removeWebsite,
    refreshFolders,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
