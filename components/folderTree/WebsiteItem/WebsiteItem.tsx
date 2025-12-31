"use client";

import { useState } from "react";
import styles from "./WebsiteItem.module.css";
import { Website } from "@/models/types/website";
import { useSelection } from "@/context";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import Icon from "@/styles/Icons";

interface WebsiteItemProps {
  website: Website;
  level: number;
  onRemove: (websiteId: string) => void;
}

export default function WebsiteItem({ website, level, onRemove }: WebsiteItemProps) {
  const [showActions, setShowActions] = useState(false);
  const { selectWebsite, selectedWebsite } = useSelection();
  const { openDialog } = useConfirmDialog();

  const isSelected = selectedWebsite?.id === website.id;

  const handleWebsiteClick = () => {
    selectWebsite(website);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDialog({
      title: "Delete Website",
      message: `Are you sure you want to delete "${website.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: () => onRemove(website.id),
    });
  };

  return (
    <div
      className={`${styles.websiteItem} ${isSelected ? styles.selected : ""}`}
      style={{ paddingLeft: `${level * 16 + 24}px` }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleWebsiteClick}
    >
      <Icon type="siteTree" className={styles.websiteIcon} size={20} />
      <span className={styles.websiteName}>{website.title}</span>
      
      {showActions && (
        <button
          className={styles.actionButton}
          onClick={handleDeleteClick}
          title="Delete website"
        >
          <Icon type="delete" size={16} />
        </button>
      )}
    </div>
  );
}
