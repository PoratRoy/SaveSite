"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "./FolderTree.module.css";
import { Folder } from "@/models/types/folder";
import { getFoldersTreeAction } from "@/app/actions/GET/getFoldersTreeAction";
import { createFolderAction } from "@/app/actions/POST/createFolderAction";
import { createWebsiteAction } from "@/app/actions/POST/createWebsiteAction";
import { deleteFolderAction } from "@/app/actions/DELETE/deleteFolderAction";
import { deleteWebsiteAction } from "@/app/actions/DELETE/deleteWebsiteAction";
import FolderItem from "../FolderItem/FolderItem";

export default function FolderTree() {
  const { data: session } = useSession();
  const [rootFolder, setRootFolder] = useState<Folder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from session
  const userId = session?.user?.email || "";

  // Fetch folders tree on mount and when userId changes
  useEffect(() => {
    const fetchFoldersTree = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const tree = await getFoldersTreeAction(userId);
        
        // If no tree exists, create a default root folder
        if (!tree) {
          setRootFolder({
            id: "root",
            name: "My Websites",
            userId,
            parentId: null,
            createdAt: new Date(),
            children: [],
            websites: [],
          });
        } else {
          setRootFolder(tree);
        }
      } catch (err) {
        console.error("Error fetching folders:", err);
        setError("Failed to load folders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoldersTree();
  }, [userId]);

  const handleAddFolder = async (parentId: string) => {
    if (!userId) return;

    const newFolderName = prompt("Enter folder name:");
    if (!newFolderName) return;

    try {
      await createFolderAction({
        name: newFolderName,
        userId,
        parentId,
      });

      // Refresh the tree
      const tree = await getFoldersTreeAction(userId);
      setRootFolder(tree);
    } catch (err) {
      console.error("Error creating folder:", err);
      alert("Failed to create folder");
    }
  };

  const handleAddWebsite = async (folderId: string) => {
    if (!userId) return;

    const websiteTitle = prompt("Enter website title:");
    if (!websiteTitle) return;
    
    const websiteUrl = prompt("Enter website URL:");
    if (!websiteUrl) return;

    try {
      await createWebsiteAction({
        title: websiteTitle,
        link: websiteUrl,
        ownerId: userId,
        folderId,
      });

      // Refresh the tree
      const tree = await getFoldersTreeAction(userId);
      setRootFolder(tree);
    } catch (err) {
      console.error("Error creating website:", err);
      alert("Failed to create website");
    }
  };

  const handleRemoveFolder = async (folderId: string) => {
    if (!userId) return;

    if (!confirm("Are you sure you want to delete this folder and all its contents?")) {
      return;
    }

    try {
      await deleteFolderAction({
        folderId,
        userId,
      });

      // Refresh the tree
      const tree = await getFoldersTreeAction(userId);
      setRootFolder(tree);
    } catch (err) {
      console.error("Error deleting folder:", err);
      alert("Failed to delete folder");
    }
  };

  const handleRemoveWebsite = async (websiteId: string, folderId: string) => {
    if (!userId) return;

    if (!confirm("Are you sure you want to delete this website?")) {
      return;
    }

    try {
      await deleteWebsiteAction({
        websiteId,
        userId,
      });

      // Refresh the tree
      const tree = await getFoldersTreeAction(userId);
      setRootFolder(tree);
    } catch (err) {
      console.error("Error deleting website:", err);
      alert("Failed to delete website");
    }
  };

  return (
    <div className={styles.tree}>
      {isLoading && <p className={styles.placeholder}>Loading folders...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!isLoading && !error && rootFolder && (
        <FolderItem
          folder={rootFolder}
          level={0}
          onAddFolder={handleAddFolder}
          onAddWebsite={handleAddWebsite}
          onRemoveFolder={handleRemoveFolder}
          onRemoveWebsite={handleRemoveWebsite}
        />
      )}
      {!isLoading && !error && !rootFolder && !userId && (
        <p className={styles.placeholder}>Please sign in to view your folders</p>
      )}
    </div>
  );
}
