"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./FolderItem.module.css";
import { Folder } from "@/models/types/folder";
import Icon from "@/styles/Icons";
import { useSelection } from "@/context";
import FolderActions from "../FolderActions/FolderActions";
import WebsiteItem from "../WebsiteItem/WebsiteItem";
import { Website } from "@/models/types/website";

interface FolderItemProps {
  folder: Folder;
  level: number;
  onAddFolder: (parentId: string, name: string) => Promise<void>;
  onAddWebsite: (folderId: string) => void;
  onUpdateFolder: (folderId: string, name: string) => Promise<void>;
  onRemoveFolder: (folderId: string) => void;
  onRemoveWebsite: (websiteId: string) => void;
}

export default function FolderItem({
  folder,
  level,
  onAddFolder,
  onAddWebsite,
  onUpdateFolder,
  onRemoveFolder,
  onRemoveWebsite,
}: FolderItemProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const [showActions, setShowActions] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isEditingFolder, setIsEditingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editFolderName, setEditFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const { selectFolder, selectedFolder } = useSelection();

  const hasChildren = (folder.children && folder.children.length > 0) || 
                      (folder.websites && folder.websites.length > 0);

  const isSelected = selectedFolder?.id === folder.id;

  const handleFolderClick = () => {
    selectFolder(folder);
  };

  const handleStartCreatingFolder = () => {
    setIsCreatingFolder(true);
    setIsExpanded(true); // Expand folder to show new input
  };

  const handleSaveFolder = async () => {
    if (!newFolderName.trim() || isCreating) return;

    try {
      setIsCreating(true);
      await onAddFolder(folder.id, newFolderName.trim());
      setNewFolderName("");
      setIsCreatingFolder(false);
    } catch (err) {
      console.error("Error creating folder:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelCreatingFolder = () => {
    setIsCreatingFolder(false);
    setNewFolderName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveFolder();
    } else if (e.key === "Escape") {
      handleCancelCreatingFolder();
    }
  };

  const handleStartEditingFolder = () => {
    setIsEditingFolder(true);
    setEditFolderName(folder.name);
  };

  const handleUpdateFolderName = async () => {
    if (!editFolderName.trim() || isUpdating || editFolderName === folder.name) return;

    try {
      setIsUpdating(true);
      await onUpdateFolder(folder.id, editFolderName.trim());
      setIsEditingFolder(false);
    } catch (err) {
      console.error("Error updating folder:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEditingFolder = () => {
    setIsEditingFolder(false);
    setEditFolderName("");
  };

  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpdateFolderName();
    } else if (e.key === "Escape") {
      handleCancelEditingFolder();
    }
  };

  // Focus input when creating folder
  useEffect(() => {
    if (isCreatingFolder && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreatingFolder]);

  // Focus input when editing folder
  useEffect(() => {
    if (isEditingFolder && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select(); // Select all text for easy replacement
    }
  }, [isEditingFolder]);

  return (
    <div className={styles.folderItem}>
      <div
        className={`${styles.folderHeader} ${isSelected ? styles.selected : ""}`}
        style={{ paddingLeft: `${level * 16}px` }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={handleFolderClick}
      >
        <button
          className={styles.expandButton}
          onClick={(e) => {
            e.stopPropagation();
            if (!isExpanded) {
              handleFolderClick();
            }
            setIsExpanded(!isExpanded);
          }}
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
        >
          {isExpanded ? <Icon type="arrowDown" size={20} /> : <Icon type="arrowRight" size={20} />}
        </button>
        <Icon type="folderTree" className={styles.folderIcon} size={20} />
        
        {isEditingFolder ? (
          <>
            <input
              ref={editInputRef}
              type="text"
              value={editFolderName}
              onChange={(e) => setEditFolderName(e.target.value)}
              onKeyDown={handleEditKeyPress}
              onBlur={handleCancelEditingFolder}
              className={styles.editInput}
              disabled={isUpdating}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUpdateFolderName();
              }}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur
              className={styles.saveButton}
              disabled={isUpdating || !editFolderName.trim() || editFolderName === folder.name}
            >
              ✓
            </button>
          </>
        ) : (
          <span className={styles.folderName}>{folder.name}</span>
        )}
        
        {showActions && !isEditingFolder && (
          <FolderActions
            folderId={folder.id}
            folderName={folder.name}
            isRoot={folder.id === "root"}
            onAddFolder={handleStartCreatingFolder}
            onAddWebsite={onAddWebsite}
            onEditFolder={handleStartEditingFolder}
            onRemoveFolder={onRemoveFolder}
          />
        )}
      </div>

      {isExpanded && (
        <div className={styles.folderContent}>
          {/* Inline folder creation input */}
          {isCreatingFolder && (
            <div
              className={styles.newFolderInput}
              style={{ paddingLeft: `${(level + 1) * 16}px` }}
            >
              <Icon type="folderTree" className={styles.folderIcon} size={20} />
              <input
                ref={inputRef}
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleCancelCreatingFolder}
                placeholder="New folder name..."
                className={styles.input}
                disabled={isCreating}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSaveFolder();
                }}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur
                className={styles.saveButton}
                disabled={isCreating || !newFolderName.trim()}
              >
                ✓
              </button>
            </div>
          )}

          {folder.children?.map((child: any) => (
            <FolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              onAddFolder={onAddFolder}
              onAddWebsite={onAddWebsite}
              onUpdateFolder={onUpdateFolder}
              onRemoveFolder={onRemoveFolder}
              onRemoveWebsite={onRemoveWebsite}
            />
          ))}
          {folder.websites?.map((website: Website) => (
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
