"use client";

import { Reorder, useDragControls } from "framer-motion";
import { Tag } from "@/models/types/tag";
import styles from "./ManageTagsPanel.module.css";

interface TagItemProps {
  tag: Tag;
  isEditing: boolean;
  editTagName: string;
  onEditChange: (value: string) => void;
  onEditSubmit: () => void;
  onStartEdit: (tag: Tag) => void;
  onCancelEdit: () => void;
  onDelete: (tagId: string, tagName: string) => void;
}

export default function TagItem({
  tag,
  isEditing,
  editTagName,
  onEditChange,
  onEditSubmit,
  onStartEdit,
  onCancelEdit,
  onDelete,
}: TagItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      key={tag.id}
      value={tag}
      className={styles.tagItem}
      dragListener={false}
      dragControls={dragControls}
    >
      {isEditing ? (
        <>
          <div className={styles.dragHandle}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6" cy="4" r="1.5" fill="currentColor" />
              <circle cx="10" cy="4" r="1.5" fill="currentColor" />
              <circle cx="6" cy="8" r="1.5" fill="currentColor" />
              <circle cx="10" cy="8" r="1.5" fill="currentColor" />
              <circle cx="6" cy="12" r="1.5" fill="currentColor" />
              <circle cx="10" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <input
            type="text"
            value={editTagName}
            onChange={(e) => onEditChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onEditSubmit()}
            className={styles.editInput}
            autoFocus
          />
          <div className={styles.tagActions}>
            <button onClick={onEditSubmit} className={styles.saveButton}>
              Save
            </button>
            <button onClick={onCancelEdit} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            className={styles.dragHandle}
            onPointerDown={(e) => dragControls.start(e)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6" cy="4" r="1.5" fill="currentColor" />
              <circle cx="10" cy="4" r="1.5" fill="currentColor" />
              <circle cx="6" cy="8" r="1.5" fill="currentColor" />
              <circle cx="10" cy="8" r="1.5" fill="currentColor" />
              <circle cx="6" cy="12" r="1.5" fill="currentColor" />
              <circle cx="10" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <span className={styles.tagName}>{tag.name}</span>
          <div className={styles.tagActions}>
            <button
              onClick={() => onStartEdit(tag)}
              className={styles.editButton}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(tag.id, tag.name)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </Reorder.Item>
  );
}
