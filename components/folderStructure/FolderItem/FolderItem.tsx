"use client";

import { useState } from "react";
import styles from "./FolderItem.module.css";
import { Folder } from "@/models/types/folder";
import { ChevronRightIcon, ChevronDownIcon, FolderIcon } from "@/styles/Icons";
import FolderActions from "../FolderActions/FolderActions";
import WebsiteItem from "../WebsiteItem/WebsiteItem";

interface FolderItemProps {
  folder: Folder;
  level: number;
  onAddFolder: (parentId: string) => void;
  onAddWebsite: (folderId: string) => void;
  onRemoveFolder: (folderId: string) => void;
  onRemoveWebsite: (websiteId: string) => void;
}

export default function FolderItem({
  folder,
  level,
  onAddFolder,
  onAddWebsite,
  onRemoveFolder,
  onRemoveWebsite,
}: FolderItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);

  const hasChildren = (folder.children && folder.children.length > 0) || 
                      (folder.websites && folder.websites.length > 0);

  return (
    <div className={styles.folderItem}>
      <div
        className={styles.folderHeader}
        style={{ paddingLeft: `${level * 16}px` }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
        >
          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
        <FolderIcon className={styles.folderIcon} />
        <span className={styles.folderName}>{folder.name}</span>
        
        {showActions && (
          <FolderActions
            folderId={folder.id}
            isRoot={folder.id === "root"}
            onAddFolder={onAddFolder}
            onAddWebsite={onAddWebsite}
            onRemoveFolder={onRemoveFolder}
          />
        )}
      </div>

      {isExpanded && (
        <div className={styles.folderContent}>
          {folder.children?.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              onAddFolder={onAddFolder}
              onAddWebsite={onAddWebsite}
              onRemoveFolder={onRemoveFolder}
              onRemoveWebsite={onRemoveWebsite}
            />
          ))}
          {folder.websites?.map((website) => (
            <WebsiteItem
              key={website.id}
              website={website}
              level={level + 1}
              onRemove={onRemoveWebsite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
