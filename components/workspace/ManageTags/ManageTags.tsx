"use client";

import { useState, useMemo } from "react";
import styles from "./ManageTags.module.css";
import { useData, useFilter, useSelection } from "@/context";
import { Tag } from "@/models/types/tag";
export default function ManageTags() {
  const { tags, isLoadingTags } = useData();
  const { selectedTagIds, toggleTag, clearFilters, hasActiveFilters } = useFilter();
  const { selectedFolderId } = useSelection();
  const [showAllGlobal, setShowAllGlobal] = useState(false);
  const [showAllFolder, setShowAllFolder] = useState(false);

  // Separate global and folder tags (memoized for performance)
  const globalTags = useMemo(() => 
    tags.filter((tag: Tag) => tag.userId && !tag.folderId), 
    [tags]
  );
  
  const folderTags = useMemo(() => 
    tags.filter((tag: Tag) => tag.folderId === selectedFolderId), 
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

  const renderTagRow = (tagsList: typeof displayedGlobalTags, totalTags: Tag[], showAll: boolean, setShowAll: (val: boolean) => void, hasMore: boolean, label: string, isLastRow: boolean) => (
    <div className={styles.tagRow}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.tagsContainer}>
        {tagsList.length === 0 ? (
          <span className={styles.emptyText}>No {label.toLowerCase()} yet</span>
        ) : (
          <>
            {tagsList.map((tag: Tag) => {
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
                +{totalTags.length - 10}
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
            {isLastRow && hasActiveFilters && (
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
          {renderTagRow(displayedGlobalTags, globalTags, showAllGlobal, setShowAllGlobal, hasMoreGlobalTags, "GLOBAL TAGS", !selectedFolderId)}
          
          {/* Folder Tags Row (only show if folder is selected) */}
          {selectedFolderId && renderTagRow(displayedFolderTags, folderTags, showAllFolder, setShowAllFolder, hasMoreFolderTags, "FOLDER TAGS", true)}
        </>
      )}
    </div>
  );
}
