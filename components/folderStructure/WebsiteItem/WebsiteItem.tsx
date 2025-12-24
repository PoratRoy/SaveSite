"use client";

import { useState } from "react";
import styles from "./WebsiteItem.module.css";
import { Website } from "@/models/types/website";
import { useSelection } from "@/context";
import Icon from "@/styles/Icons";

interface WebsiteItemProps {
  website: Website;
  level: number;
  onRemove: (websiteId: string) => void;
}

export default function WebsiteItem({ website, level, onRemove }: WebsiteItemProps) {
  const [showActions, setShowActions] = useState(false);
  const { selectWebsite, selectedWebsite } = useSelection();

  const isSelected = selectedWebsite?.id === website.id;

  const handleWebsiteClick = () => {
    selectWebsite(website);
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
          onClick={(e) => {
            e.stopPropagation();
            onRemove(website.id);
          }}
          title="Delete website"
        >
          <Icon type="delete" size={16} />
        </button>
      )}
    </div>
  );
}
