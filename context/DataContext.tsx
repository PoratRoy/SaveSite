"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { Folder } from "@/models/types/folder";
import { Tag } from "@/models/types/tag";
import { Website } from "@/models/types/website";
import { getFoldersTreeAction } from "@/app/actions/GET/getFoldersTreeAction";
import { createFolderAction } from "@/app/actions/POST/createFolderAction";
import { createWebsiteAction } from "@/app/actions/POST/createWebsiteAction";
import { updateFolderAction } from "@/app/actions/PUT/updateFolderAction";
import { updateWebsiteAction } from "@/app/actions/PUT/updateWebsiteAction";
import { deleteFolderAction } from "@/app/actions/DELETE/deleteFolderAction";
import { deleteWebsiteAction } from "@/app/actions/DELETE/deleteWebsiteAction";
import { getUserByEmailAction } from "@/app/actions/GET/getUserByEmailAction";
import { getTagsAction } from "@/app/actions/GET/getTagsAction";
import { createTagAction } from "@/app/actions/POST/createTagAction";
import { updateTagAction } from "@/app/actions/PUT/updateTagAction";
import { deleteTagAction } from "@/app/actions/DELETE/deleteTagAction";
import { updateTagPositionsAction } from "@/app/actions/PUT/updateTagPositionsAction";
import { updateWebsitePositionsAction } from "@/app/actions/PUT/updateWebsitePositionsAction";
import { toggleWebsiteStarredAction } from "@/app/actions/PUT/toggleWebsiteStarredAction";
import { useSelection } from "./SelectionContext";

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
    tagIds?: string[];
  }) => Promise<void>;
  updateFolder: (folderId: string, name: string) => Promise<void>;
  updateWebsite: (websiteId: string, websiteData: {
    title: string;
    link: string;
    description?: string;
    image?: string;
    icon?: string;
    color?: string;
    tagIds?: string[];
  }) => Promise<void>;
  removeFolder: (folderId: string) => Promise<void>;
  removeWebsite: (websiteId: string) => Promise<void>;
  refreshFolders: () => Promise<void>;
  addTag: (name: string, scope?: { userId?: string | null; folderId?: string | null }, refreshFolderId?: string) => Promise<Tag>;
  updateTag: (tagId: string, name: string, folderId?: string) => Promise<void>;
  removeTag: (tagId: string, folderId?: string) => Promise<void>;
  updateTagPositions: (tagPositions: { id: string; position: number }[], folderId?: string) => Promise<void>;
  updateWebsitePositions: (websitePositions: { id: string; position: number }[]) => Promise<void>;
  toggleWebsiteStarred: (websiteId: string, starred: boolean) => Promise<void>;
  refreshTags: (folderId?: string) => Promise<void>;
  checkDuplicateUrl: (url: string) => { isDuplicate: boolean; existingWebsite?: Website };
  onDataChange?: (rootFolder: Folder | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const { data: session } = useSession();
    const { updateSelection } = useSelection();
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
      if (updateSelection) {
        updateSelection(updatedTree);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Fetch tags (global tags for user only - folder tags are fetched on demand)
  const fetchTags = useCallback(async (folderId?: string) => {
    try {
      setIsLoadingTags(true);
      
      if (folderId) {
        // Fetch both global tags and specific folder tags
        const fetchedTags = await getTagsAction({
          userId,
          folderId,
          scope: 'all'
        });
        setTags(fetchedTags);
      } else {
        // Fetch only global tags
        const fetchedTags = await getTagsAction({
          userId,
          scope: 'global'
        });
        setTags(fetchedTags);
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
    } finally {
      setIsLoadingTags(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTags();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      tagIds?: string[];
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

  const updateWebsite = async (
    websiteId: string,
    websiteData: {
      title: string;
      link: string;
      description?: string;
      image?: string;
      icon?: string;
      color?: string;
      tagIds?: string[];
    }
  ) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      await updateWebsiteAction({
        websiteId,
        userId,
        ...websiteData,
      });
      await fetchFoldersTree();
    } catch (err) {
      console.error("Error updating website:", err);
      throw err;
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
  const addTag = async (name: string, scope?: { userId?: string | null; folderId?: string | null }, refreshFolderId?: string): Promise<Tag> => {
    try {
      const newTag = await createTagAction({ 
        name,
        userId: scope?.userId,
        folderId: scope?.folderId,
      });
      // Refresh tags with refreshFolderId to maintain view context
      // This allows creating global tags while viewing a folder without losing folder tags
      await fetchTags(refreshFolderId);
      return newTag;
    } catch (err) {
      console.error("Error creating tag:", err);
      throw err;
    }
  };

  const updateTag = async (tagId: string, name: string, folderId?: string) => {
    try {
      await updateTagAction({ tagId, name });
      // Refresh tags with the same folderId to maintain context
      await fetchTags(folderId);
    } catch (err) {
      console.error("Error updating tag:", err);
      throw err;
    }
  };

  const removeTag = async (tagId: string, folderId?: string) => {
    try {
      await deleteTagAction({ tagId });
      // Refresh tags with the same folderId to maintain context
      await fetchTags(folderId);
    } catch (err) {
      console.error("Error deleting tag:", err);
      throw err;
    }
  };

  const refreshTags = useCallback(async (folderId?: string) => {
    await fetchTags(folderId);
  }, [fetchTags]);

  // Check if a URL already exists in any folder
  const checkDuplicateUrl = (url: string): { isDuplicate: boolean; existingWebsite?: Website } => {
    if (!rootFolder) return { isDuplicate: false };

    // Normalize URL for comparison (remove trailing slash, convert to lowercase)
    const normalizeUrl = (u: string) => {
      try {
        const urlObj = new URL(u);
        return urlObj.href.toLowerCase().replace(/\/$/, '');
      } catch {
        return u.toLowerCase().replace(/\/$/, '');
      }
    };

    const normalizedUrl = normalizeUrl(url);

    // Recursively search through all folders
    const findInFolder = (folder: Folder): Website | undefined => {
      // Check websites in current folder
      if (folder.websites) {
        const found = folder.websites.find(
          w => normalizeUrl(w.link) === normalizedUrl
        );
        if (found) return found;
      }

      // Check child folders
      if (folder.children) {
        for (const subfolder of folder.children) {
          const found = findInFolder(subfolder);
          if (found) return found;
        }
      }

      return undefined;
    };

    const existingWebsite = findInFolder(rootFolder);
    return {
      isDuplicate: !!existingWebsite,
      existingWebsite,
    };
  };

  const updateTagPositions = async (tagPositions: { id: string; position: number }[], folderId?: string) => {
    try {
      await updateTagPositionsAction({ tagPositions });
      // Refresh tags with the same folderId to maintain context
      await fetchTags(folderId);
    } catch (err) {
      console.error("Error updating tag positions:", err);
      throw err;
    }
  };

  const updateWebsitePositions = async (websitePositions: { id: string; position: number }[]) => {
    try {
      await updateWebsitePositionsAction({ websitePositions });
      await fetchFoldersTree();
    } catch (err) {
      console.error("Error updating website positions:", err);
      throw err;
    }
  };

  const toggleWebsiteStarred = async (websiteId: string, starred: boolean) => {
    try {
      await toggleWebsiteStarredAction({ websiteId, userId, starred });
      await fetchFoldersTree();
    } catch (err) {
      console.error("Error toggling website starred status:", err);
      throw err;
    }
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
    updateWebsite,
    removeFolder,
    removeWebsite,
    refreshFolders,
    addTag,
    updateTag,
    removeTag,
    updateTagPositions,
    updateWebsitePositions,
    toggleWebsiteStarred,
    refreshTags,
    checkDuplicateUrl,
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
