"use client";

import { useData, useSelection } from "@/context";
import { Folder } from "@/models/types/folder";
import styles from "./Breadcrumb.module.css";

export default function Breadcrumb() {
  const { rootFolder } = useData();
  const { selectedType, selectedFolder, selectedWebsite, selectFolder } = useSelection();

  // Build breadcrumb path
  const buildPath = (): { id: string; name: string; folder: Folder }[] => {
    if (!rootFolder) return [];

    const path: { id: string; name: string; folder: Folder }[] = [];

    // Helper to find path to a folder
    const findPathToFolder = (
      current: Folder,
      targetId: string,
      currentPath: { id: string; name: string; folder: Folder }[]
    ): boolean => {
      currentPath.push({ id: current.id, name: current.name, folder: current });

      if (current.id === targetId) {
        return true;
      }

      if (current.children) {
        for (const child of current.children) {
          if (findPathToFolder(child, targetId, currentPath)) {
            return true;
          }
        }
      }

      currentPath.pop();
      return false;
    };

    // Helper to find path to a website's parent folder
    const findPathToWebsite = (
      current: Folder,
      websiteId: string,
      currentPath: { id: string; name: string; folder: Folder }[]
    ): boolean => {
      currentPath.push({ id: current.id, name: current.name, folder: current });

      // Check if website is in this folder
      if (current.websites?.some(w => w.id === websiteId)) {
        return true;
      }

      if (current.children) {
        for (const child of current.children) {
          if (findPathToWebsite(child, websiteId, currentPath)) {
            return true;
          }
        }
      }

      currentPath.pop();
      return false;
    };

    if (selectedType === "folder" && selectedFolder) {
      findPathToFolder(rootFolder, selectedFolder.id, path);
    } else if (selectedType === "website" && selectedWebsite) {
      findPathToWebsite(rootFolder, selectedWebsite.id, path);
    }

    return path;
  };

  const breadcrumbPath = buildPath();

  // Show "Starred" breadcrumb for starred view
  if (selectedType === "starred") {
    return (
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbItem}>
          <span className={`${styles.breadcrumbText} ${styles.active}`}>
            Starred
          </span>
        </div>
      </div>
    );
  }

  if (breadcrumbPath.length === 0) {
    return null;
  }

  return (
    <div className={styles.breadcrumb}>
      {breadcrumbPath.map((item, index) => (
        <div key={item.id} className={styles.breadcrumbItem}>
          {index > 0 && <span className={styles.separator}>/</span>}
          <button
            onClick={() => selectFolder(item.folder)}
            className={`${styles.breadcrumbButton} ${
              index === breadcrumbPath.length - 1 && selectedType === "folder"
                ? styles.active
                : ""
            }`}
            disabled={index === breadcrumbPath.length - 1 && selectedType === "folder"}
          >
            {item.name}
          </button>
        </div>
      ))}
      {selectedType === "website" && selectedWebsite && (
        <div className={styles.breadcrumbItem}>
          <span className={styles.separator}>/</span>
          <span className={`${styles.breadcrumbText} ${styles.active}`}>
            {selectedWebsite.title}
          </span>
        </div>
      )}
    </div>
  );
}
