"use client";

import styles from "./FolderTree.module.css";
import { useData } from "@/context/DataContext";
import FolderItem from "../FolderItem/FolderItem";

export default function FolderTree() {
  const { rootFolder, isLoading, error, addFolder, addWebsite, removeFolder, removeWebsite } = useData();

  const handleAddFolder = async (parentId: string) => {
    const newFolderName = prompt("Enter folder name:");
    if (!newFolderName) return;

    try {
      await addFolder(parentId, newFolderName);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create folder");
    }
  };

  const handleAddWebsite = async (folderId: string) => {
    const websiteTitle = prompt("Enter website title:");
    if (!websiteTitle) return;
    
    const websiteUrl = prompt("Enter website URL:");
    if (!websiteUrl) return;

    try {
      await addWebsite(folderId, websiteTitle, websiteUrl);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create website");
    }
  };

  const handleRemoveFolder = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this folder and all its contents?")) {
      return;
    }

    try {
      await removeFolder(folderId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete folder");
    }
  };

  const handleRemoveWebsite = async (websiteId: string) => {
    if (!confirm("Are you sure you want to delete this website?")) {
      return;
    }

    try {
      await removeWebsite(websiteId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete website");
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
      {!isLoading && !error && !rootFolder && (
        <p className={styles.placeholder}>Please sign in to view your folders</p>
      )}
    </div>
  );
}
