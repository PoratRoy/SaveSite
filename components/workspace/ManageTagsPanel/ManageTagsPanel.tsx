"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Reorder } from "framer-motion";
import styles from "./ManageTagsPanel.module.css";
import { Tag } from "@/models/types/tag";
import CreateTagForm from "../CreateTagForm/CreateTagForm";
import TagItem from "./TagItem";
import { useData } from "@/context";

export default function ManageTagsPanel() {
  const { tags, addTag, updateTag, removeTag, updateTagPositions } = useData();
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [orderedTags, setOrderedTags] = useState<Tag[]>(tags);
  const previousOrderRef = useRef<Tag[]>(tags);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCreateTag = async (tagName: string) => {
    try {
      setError(null);
      await addTag(tagName);
    } catch (err) {
      throw err; // Let CreateTagForm handle the error
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

  // Sync orderedTags with tags from context
  useEffect(() => {
    setOrderedTags(tags);
    previousOrderRef.current = tags;
  }, [tags]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Debounced save function
  const debouncedSave = useCallback(async (newOrder: Tag[]) => {
    // Compare current order with previous order
    const changedTags: { id: string; position: number }[] = [];
    
    newOrder.forEach((tag, newIndex) => {
      const oldIndex = previousOrderRef.current.findIndex(t => t.id === tag.id);
      if (oldIndex !== newIndex) {
        changedTags.push({
          id: tag.id,
          position: newIndex,
        });
      }
    });

    // Only make API call if positions changed
    if (changedTags.length > 0) {
      try {
        await updateTagPositions(changedTags);
        // Update the reference to the new order
        previousOrderRef.current = newOrder;
      } catch (err) {
        console.error("Error updating tag positions:", err);
        setError("Failed to update tag order");
        // Revert to original order on error
        setOrderedTags(previousOrderRef.current);
      }
    }
  }, [updateTagPositions]);

  // Handle reorder - update local state and schedule save
  const handleReorder = (newOrder: Tag[]) => {
    setOrderedTags(newOrder);
    
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Schedule save after 800ms of no movement
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave(newOrder);
    }, 800);
  };

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}

      {/* Create New Tag */}
      <CreateTagForm onCreateTag={handleCreateTag} onError={setError} />

      {/* Tags List */}
      {orderedTags.length === 0 ? (
        <div className={styles.tagsList}>
          <p className={styles.emptyMessage}>No tags yet. Create your first tag!</p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={orderedTags}
          onReorder={handleReorder}
          className={styles.tagsList}
        >
          {orderedTags.map((tag) => (
            <TagItem
              key={tag.id}
              tag={tag}
              isEditing={editingTag?.id === tag.id}
              editTagName={editTagName}
              onEditChange={setEditTagName}
              onEditSubmit={handleUpdateTag}
              onStartEdit={startEditing}
              onCancelEdit={cancelEditing}
              onDelete={handleDeleteTag}
            />
          ))}
        </Reorder.Group>
      )}
    </>
  );
}
