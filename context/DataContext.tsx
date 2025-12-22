"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { Folder } from "@/models/types/folder";
import { Tag } from "@/models/types/tag";
import { getFoldersTreeAction } from "@/app/actions/GET/getFoldersTreeAction";
import { createFolderAction } from "@/app/actions/POST/createFolderAction";
import { createWebsiteAction } from "@/app/actions/POST/createWebsiteAction";
import { updateFolderAction } from "@/app/actions/PUT/updateFolderAction";
import { deleteFolderAction } from "@/app/actions/DELETE/deleteFolderAction";
import { deleteWebsiteAction } from "@/app/actions/DELETE/deleteWebsiteAction";
import { getUserByEmailAction } from "@/app/actions/GET/getUserByEmailAction";
import { getTagsAction } from "@/app/actions/GET/getTagsAction";
import { createTagAction } from "@/app/actions/POST/createTagAction";
import { updateTagAction } from "@/app/actions/PUT/updateTagAction";
import { deleteTagAction } from "@/app/actions/DELETE/deleteTagAction";

interface DataContextType {
  rootFolder: Folder | null;
  tags: Tag[];
  isLoading: boolean;
  isLoadingTags: boolean;
  error: string | null;
  userId: string;
  addFolder: (parentId: string, name: string) => Promise<void>;
  addWebsite: (folderId: string, websiteData: {
    title: string;
    link: string;
    description?: string;
    image?: string;
    icon?: string;
    color?: string;
  }) => Promise<void>;
  updateFolder: (folderId: string, name: string) => Promise<void>;
  removeFolder: (folderId: string) => Promise<void>;
  removeWebsite: (websiteId: string) => Promise<void>;
  refreshFolders: () => Promise<void>;
  addTag: (name: string) => Promise<void>;
  updateTag: (tagId: string, name: string) => Promise<void>;
  removeTag: (tagId: string) => Promise<void>;
  refreshTags: () => Promise<void>;
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
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
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

  // Fetch tags
  const fetchTags = async () => {
    try {
      setIsLoadingTags(true);
      const fetchedTags = await getTagsAction();
      setTags(fetchedTags);
    } catch (err) {
      console.error("Error fetching tags:", err);
    } finally {
      setIsLoadingTags(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

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

  const addWebsite = async (
    folderId: string,
    websiteData: {
      title: string;
      link: string;
      description?: string;
      image?: string;
      icon?: string;
      color?: string;
    }
  ) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      await createWebsiteAction({
        ...websiteData,
        ownerId: userId,
        folderId,
      });
      await fetchFoldersTree();
    } catch (err) {
      console.error("Error creating website:", err);
      throw err;
    }
  };

  const updateFolder = async (folderId: string, name: string) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      await updateFolderAction({
        folderId,
        userId,
        name,
      });
      await fetchFoldersTree();
    } catch (err) {
      console.error("Error updating folder:", err);
      throw new Error("Failed to update folder");
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

  // Tags CRUD Operations
  const addTag = async (name: string) => {
    try {
      await createTagAction({ name });
      await fetchTags();
    } catch (err) {
      console.error("Error creating tag:", err);
      throw err;
    }
  };

  const updateTag = async (tagId: string, name: string) => {
    try {
      await updateTagAction({ tagId, name });
      await fetchTags();
    } catch (err) {
      console.error("Error updating tag:", err);
      throw err;
    }
  };

  const removeTag = async (tagId: string) => {
    try {
      await deleteTagAction({ tagId });
      await fetchTags();
    } catch (err) {
      console.error("Error deleting tag:", err);
      throw err;
    }
  };

  const refreshTags = async () => {
    await fetchTags();
  };

  const value: DataContextType = {
    rootFolder,
    tags,
    isLoading,
    isLoadingTags,
    error,
    userId,
    addFolder,
    addWebsite,
    updateFolder,
    removeFolder,
    removeWebsite,
    refreshFolders,
    addTag,
    updateTag,
    removeTag,
    refreshTags,
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
