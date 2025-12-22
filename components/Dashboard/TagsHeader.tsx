"use client";

import { useState } from "react";
import styles from "./TagsHeader.module.css";
import { Tag } from "@/models/types/tag";
import { useData } from "@/context";
import SlidePanel from "@/components/SlidePanel/SlidePanel";

export default function TagsHeader() {
  const { tags, isLoadingTags, addTag, updateTag, removeTag } = useData();
  const [showManagePanel, setShowManagePanel] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      setError(null);
      await addTag(newTagName);
      setNewTagName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tag");
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag || !editTagName.trim()) return;

    try {
      setError(null);
      await updateTag(editingTag.id, editTagName);
      setEditingTag(null);
      setEditTagName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tag");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      setError(null);
      await removeTag(tagId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tag");
    }
  };

  const startEditing = (tag: Tag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingTag(null);
    setEditTagName("");
    setError(null);
  };

  const displayedTags = tags.slice(0, 10); // Show max 10 tags in header
  const hasMoreTags = tags.length > 10;

  return (
    <>
      <div className={styles.tagsHeader}>
        <div className={styles.tagsContainer}>
          {isLoadingTags ? (
            <span className={styles.loadingText}>Loading tags...</span>
          ) : tags.length === 0 ? (
            <span className={styles.emptyText}>No tags yet</span>
          ) : (
            <>
              {displayedTags.map((tag) => (
                <span key={tag.id} className={styles.tag}>
                  {tag.name}
                </span>
              ))}
              {hasMoreTags && (
                <span className={styles.moreTag}>+{tags.length - 10} more</span>
              )}
            </>
          )}
        </div>
        <button
          onClick={() => setShowManagePanel(true)}
          className={styles.manageButton}
        >
          Manage Tags
        </button>
      </div>

      <SlidePanel
        isOpen={showManagePanel}
        onClose={() => setShowManagePanel(false)}
        title="Manage Tags"
      >
        {error && <div className={styles.error}>{error}</div>}

        {/* Create New Tag */}
        <div className={styles.createSection}>
          <input
            type="text"
            placeholder="New tag name..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreateTag()}
            className={styles.input}
          />
          <button onClick={handleCreateTag} className={styles.createButton}>
            Create
          </button>
        </div>

        {/* Tags List */}
        <div className={styles.tagsList}>
          {tags.length === 0 ? (
            <p className={styles.emptyMessage}>No tags yet. Create your first tag!</p>
          ) : (
            tags.map((tag) => (
              <div key={tag.id} className={styles.tagItem}>
                {editingTag?.id === tag.id ? (
                  <>
                    <input
                      type="text"
                      value={editTagName}
                      onChange={(e) => setEditTagName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleUpdateTag()}
                      className={styles.editInput}
                      autoFocus
                    />
                    <div className={styles.tagActions}>
                      <button
                        onClick={handleUpdateTag}
                        className={styles.saveButton}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className={styles.tagName}>{tag.name}</span>
                    <div className={styles.tagActions}>
                      <button
                        onClick={() => startEditing(tag)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </SlidePanel>
    </>
  );
}
