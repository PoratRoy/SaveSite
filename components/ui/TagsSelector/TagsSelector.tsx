"use client";

import { useState } from "react";
import styles from "./TagsSelector.module.css";
import { Tag } from "@/models/types/tag";
import Icon from "@/styles/Icons";

interface TagsSelectorProps {
  tags: Tag[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  onCreateTag?: (tagName: string) => Promise<void>;
  disabled?: boolean;
}

export default function TagsSelector({
  tags,
  selectedTagIds,
  onChange,
  onCreateTag,
  disabled = false,
}: TagsSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTagToggle = (tagId: string) => {
    const isSelected = selectedTagIds.includes(tagId);
    const newSelectedIds = isSelected
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];
    onChange(newSelectedIds);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      setError("Tag name is required");
      return;
    }

    if (!onCreateTag) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await onCreateTag(newTagName.trim());
      setNewTagName("");
      setIsCreating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewTagName("");
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateTag();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <>
      <label className={styles.label}>Tags</label>
      <div className={styles.tagsContainer}>
        <div className={styles.tagsScrollArea}>
          {tags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                className={`${styles.tagButton} ${isSelected ? styles.tagSelected : ""}`}
                onClick={() => handleTagToggle(tag.id)}
                disabled={disabled}
              >
                {tag.name}
              </button>
            );
          })}
        </div>

        {onCreateTag && (
          <div className={styles.addTagSection}>
            {isCreating ? (
              <div className={styles.createTagForm}>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tag name"
                  className={styles.tagInput}
                  disabled={isSubmitting}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={isSubmitting || !newTagName.trim()}
                  className={styles.saveButton}
                >
                  <Icon type="ok" size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className={styles.cancelButton}
                >
                  <Icon type="close" size={20} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                disabled={disabled}
                className={styles.addTagButton}
                title="Add new tag"
              >
                <Icon type="add" size={16} /> Add Tag
              </button>
            )}
          </div>
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </>
  );
}
