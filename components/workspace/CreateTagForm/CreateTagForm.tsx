"use client";

import { useState } from "react";
import styles from "./CreateTagForm.module.css";

interface CreateTagFormProps {
  onCreateTag: (tagName: string) => Promise<void>;
  onError?: (error: string) => void;
}

export default function CreateTagForm({ onCreateTag, onError }: CreateTagFormProps) {
  const [tagName, setTagName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!tagName.trim()) return;

    try {
      setIsCreating(true);
      await onCreateTag(tagName.trim());
      setTagName("");
    } catch (err) {
      if (onError) {
        onError(err instanceof Error ? err.message : "Failed to create tag");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isCreating) {
      handleCreate();
    }
  };

  return (
    <div className={styles.createSection}>
      <input
        type="text"
        placeholder="New tag name..."
        value={tagName}
        onChange={(e) => setTagName(e.target.value)}
        onKeyPress={handleKeyPress}
        className={styles.input}
        disabled={isCreating}
      />
      <button 
        onClick={handleCreate} 
        className={styles.createButton}
        disabled={isCreating || !tagName.trim()}
      >
        {isCreating ? "Creating..." : "Create"}
      </button>
    </div>
  );
}
