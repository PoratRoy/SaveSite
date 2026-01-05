"use client";

import { useState } from "react";
import { Folder } from "@/models/types/folder";
import { Website } from "@/models/types/website";
import Icon from "@/styles/Icons";
import styles from "./MoveFolderPanel.module.css";

interface MoveFolderPanelProps {
  website: Website;
  rootFolder: Folder;
  currentFolderId: string;
  onMove: (targetFolderId: string) => Promise<void>;
  onCancel: () => void;
}

export default function MoveFolderPanel({
  website,
  rootFolder,
  currentFolderId,
  onMove,
  onCancel,
}: MoveFolderPanelProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Flatten folder tree into a list
  const flattenFolders = (folder: Folder, level: number = 0): Array<{ folder: Folder; level: number }> => {
    const result: Array<{ folder: Folder; level: number }> = [{ folder, level }];
    
    if (folder.children) {
      folder.children.forEach(child => {
        result.push(...flattenFolders(child, level + 1));
      });
    }
    
    return result;
  };

  const folderList = flattenFolders(rootFolder);

  const handleMove = async () => {
    if (!selectedFolderId) {
      setError("Please select a folder");
      return;
    }

    if (selectedFolderId === currentFolderId) {
      setError("Website is already in this folder");
      return;
    }

    setIsMoving(true);
    setError(null);

    try {
      await onMove(selectedFolderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move website");
      setIsMoving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Move Website</h3>
        <p className={styles.subtitle}>
          Select a folder to move <strong>{website.title}</strong>
        </p>
      </div>

      <div className={styles.folderList}>
        {folderList.map(({ folder, level }) => {
          const isCurrentFolder = folder.id === currentFolderId;
          const isSelected = folder.id === selectedFolderId;

          return (
            <button
              key={folder.id}
              className={`${styles.folderItem} ${isSelected ? styles.selected : ""} ${
                isCurrentFolder ? styles.disabled : ""
              }`}
              style={{ paddingLeft: `${level * 20 + 16}px` }}
              onClick={() => !isCurrentFolder && setSelectedFolderId(folder.id)}
              disabled={isCurrentFolder}
            >
              <Icon type="folder" size={20} />
              <span className={styles.folderName}>{folder.name}</span>
              {isCurrentFolder && (
                <span className={styles.currentBadge}>Current</span>
              )}
            </button>
          );
        })}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <button
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isMoving}
        >
          Cancel
        </button>
        <button
          onClick={handleMove}
          className={styles.moveButton}
          disabled={isMoving || !selectedFolderId}
        >
          {isMoving ? "Moving..." : "Move Website"}
        </button>
      </div>
    </div>
  );
}
