"use client";

import { useState, useMemo } from "react";
import styles from "./ManageTags.module.css";
import { useData, useFilter, useSelection } from "@/context";
import { useSlidePanel } from "@/context/SlidePanelContext";
import ManageTagsPanel from "../ManageTagsPanel/ManageTagsPanel";

export default function ManageTags() {
  const { tags, isLoadingTags } = useData();
  const { selectedTagIds, toggleTag, clearFilters, hasActiveFilters } = useFilter();
  const { selectedFolderId } = useSelection();
  const { openPanel } = useSlidePanel();
  const [showAllGlobal, setShowAllGlobal] = useState(false);
  const [showAllFolder, setShowAllFolder] = useState(false);

  // Separate global and folder tags (memoized for performance)
  const globalTags = useMemo(() => 
    tags.filter(tag => tag.userId && !tag.folderId), 
    [tags]
  );
  
  const folderTags = useMemo(() => 
    tags.filter(tag => tag.folderId === selectedFolderId), 
    [tags, selectedFolderId]
  );

  const displayedGlobalTags = useMemo(() => 
    showAllGlobal ? globalTags : globalTags.slice(0, 10),
    [showAllGlobal, globalTags]
  );
  
  const displayedFolderTags = useMemo(() => 
    showAllFolder ? folderTags : folderTags.slice(0, 10),
    [showAllFolder, folderTags]
  );
  
  const hasMoreGlobalTags = globalTags.length > 10;
  const hasMoreFolderTags = folderTags.length > 10;

  const handleOpenManagePanel = () => {
    openPanel(
      "Manage Tags",
      <ManageTagsPanel />
    );
  };

  const renderTagRow = (tagsList: typeof displayedGlobalTags, showAll: boolean, setShowAll: (val: boolean) => void, hasMore: boolean, label: string) => (
    <div className={styles.tagRow}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.tagsContainer}>
        {tagsList.length === 0 ? (
          <span className={styles.emptyText}>No {label.toLowerCase()} yet</span>
        ) : (
          <>
            {tagsList.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  className={`${styles.tag} ${isSelected ? styles.tagSelected : ''}`}
                  onClick={() => toggleTag(tag.id)}
                  title={isSelected ? `Remove ${tag.name} filter` : `Filter by ${tag.name}`}
                >
                  {tag.name}
                </button>
              );
            })}
            {hasMore && !showAll && (
              <button
                className={styles.showMoreButton}
                onClick={() => setShowAll(true)}
                title="Show all tags"
              >
                +{tagsList.length > 10 ? tagsList.length - 10 : 0}
              </button>
            )}
            {hasMore && showAll && (
              <button
                className={styles.showMoreButton}
                onClick={() => setShowAll(false)}
                title="Show less tags"
              >
                Show less
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.manageTags}>
      {isLoadingTags ? (
        <span className={styles.loadingText}>Loading tags...</span>
      ) : (
        <>
          {/* Global Tags Row */}
          {renderTagRow(displayedGlobalTags, showAllGlobal, setShowAllGlobal, hasMoreGlobalTags, "Global")}
          
          {/* Folder Tags Row (only show if folder is selected) */}
          {selectedFolderId && renderTagRow(displayedFolderTags, showAllFolder, setShowAllFolder, hasMoreFolderTags, "Folder")}
          
          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              className={styles.clearButton}
              onClick={clearFilters}
              title="Clear all filters"
            >
              Clear filters
            </button>
          )}
        </>
      )}
      <button
        onClick={handleOpenManagePanel}
        className={styles.manageButton}
      >
        Manage Tags
      </button>
    </div>
  );
}
