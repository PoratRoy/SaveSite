"use client";

import styles from "./FolderTree.module.css";
import { useData } from "@/context/DataContext";
import { useSlidePanel } from "@/context/SlidePanelContext";
import { useSelection } from "@/context/SelectionContext";
import FolderItem from "../FolderItem/FolderItem";
import CreateWebsiteForm from "@/components/forms/CreateWebsiteForm/CreateWebsiteForm";
import Icon from "@/styles/Icons";

export default function FolderTree() {
  const { rootFolder, isLoading, error, addFolder, addWebsite, updateFolder, removeFolder, removeWebsite } = useData();
  const { openPanel, closePanel } = useSlidePanel();
  const { selectStarred, selectedType } = useSelection();

  const handleAddFolder = async (parentId: string, name: string) => {
    try {
      await addFolder(parentId, name);
    } catch (err) {
      throw err; // Re-throw to let FolderItem handle the error
    }
  };

  const handleAddWebsite = (folderId: string) => {
    const handleCreateWebsite = async (websiteData: {
      title: string;
      link: string;
      description?: string;
      image?: string;
      icon?: string;
      color?: string;
    }) => {
      try {
        await addWebsite(folderId, websiteData);
        closePanel();
      } catch (err) {
        throw err; // Let form handle the error
      }
    };

    const handleCancel = () => {
      closePanel();
    };

    openPanel(
      "Create Website",
      <CreateWebsiteForm
        folderId={folderId}
        onSubmit={handleCreateWebsite}
        onCancel={handleCancel}
      />
    );
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

  const handleUpdateFolder = async (folderId: string, name: string) => {
    try {
      await updateFolder(folderId, name);
    } catch (err) {
      throw err; // Re-throw to let FolderItem handle the error
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
      
      {!isLoading && !error && (
        <>
          {/* Starred Row */}
          <div
            className={`${styles.starredRow} ${selectedType === "starred" ? styles.selected : ""}`}
            onClick={selectStarred}
          >
            <Icon type="starRow" color="currentColor" size={24} />
            <span>Starred</span>
          </div>

          {rootFolder && (
            <FolderItem
              folder={rootFolder}
              level={0}
              onAddFolder={handleAddFolder}
              onAddWebsite={handleAddWebsite}
              onUpdateFolder={handleUpdateFolder}
              onRemoveFolder={handleRemoveFolder}
              onRemoveWebsite={handleRemoveWebsite}
            />
          )}
        </>
      )}
      
      {!isLoading && !error && !rootFolder && (
        <p className={styles.placeholder}>Please sign in to view your folders</p>
      )}
    </div>
  );
}
