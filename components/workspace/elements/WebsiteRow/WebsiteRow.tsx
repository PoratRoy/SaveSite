"use client";

import { useState } from "react";
import styles from "./WebsiteRow.module.css";
import { Website } from "@/models/types/website";
import Icon from "@/styles/Icons";

interface WebsiteRowProps {
  website: Website;
  onEdit: (website: Website) => void;
  onDelete: (websiteId: string) => void;
  onViewMore: (website: Website) => void;
  onToggleStarred: (websiteId: string, starred: boolean) => void;
  onMove?: (website: Website) => void;
  dragHandleProps?: any;
}

export default function WebsiteRow({
  website,
  onEdit,
  onDelete,
  onViewMore,
  onToggleStarred,
  onMove,
  dragHandleProps,
}: WebsiteRowProps) {
  const [showActions, setShowActions] = useState(false);

  const isIconUrl = website.icon && website.icon.startsWith("http");

  const handleVisitSite = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(website.link, "_blank", "noopener,noreferrer");
  };

  const handleToggleStarred = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStarred(website.id, !website.starred);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(website);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(website.id);
  };

  const handleMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMove?.(website);
  };

  return (
    <div
      className={styles.listItem}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onViewMore(website)}
    >
      {/* Drag Handle */}
      {dragHandleProps && (
        <div className={styles.dragHandle} {...dragHandleProps}>
          <Icon type="dnd" size={18} />
        </div>
      )}

      {/* Icon */}
      <div className={styles.icon}>
        {website.icon ? (
          isIconUrl ? (
            <img
              src={website.icon}
              alt=""
              className={styles.iconImage}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className={styles.iconEmoji}>{website.icon}</span>
          )
        ) : (
          <Icon type="siteTree" size={20} />
        )}
      </div>

      {/* Title */}
      <div className={styles.title}>
        <span className={styles.titleText}>{website.title}</span>
        {website.starred && (
          <Icon type="star" size={14} className={styles.starIcon} />
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {showActions && (
          <>
            <button
              className={styles.actionButton}
              onClick={handleVisitSite}
              title="Visit site"
            >
              <Icon type="link" size={18} />
              <span>Visit</span>
            </button>

            <div className={styles.menuContainer}>
              <button
                className={styles.menuButton}
                onClick={(e) => e.stopPropagation()}
                title="More options"
              >
                <Icon type="options" size={20} />
              </button>
              <div className={styles.menuDropdown}>
                <button onClick={handleToggleStarred} className={styles.menuItem}>
                  <Icon type="star" size={16} />
                  <span>{website.starred ? "Unstar" : "Star"}</span>
                </button>
                <button onClick={handleEdit} className={styles.menuItem}>
                  <Icon type="edit" size={16} />
                  <span>Edit</span>
                </button>
                {onMove && (
                  <button onClick={handleMove} className={styles.menuItem}>
                    <Icon type="move" size={16} />
                    <span>Move</span>
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className={`${styles.menuItem} ${styles.menuItemDanger}`}
                >
                  <Icon type="delete" size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
