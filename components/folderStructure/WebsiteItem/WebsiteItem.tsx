"use client";

import { useState } from "react";
import styles from "./WebsiteItem.module.css";
import { Website } from "@/models/types/website";
import { WebsiteIcon, TrashIcon } from "@/styles/Icons";

interface WebsiteItemProps {
  website: Website;
  folderId: string;
  level: number;
  onRemove: (websiteId: string, folderId: string) => void;
}

export default function WebsiteItem({ website, folderId, level, onRemove }: WebsiteItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={styles.websiteItem}
      style={{ paddingLeft: `${level * 16 + 24}px` }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <WebsiteIcon className={styles.websiteIcon} />
      <span className={styles.websiteName}>{website.title}</span>
      
      {showActions && (
        <button
          className={styles.actionButton}
          onClick={() => onRemove(website.id, folderId)}
          title="Delete website"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
