"use client";

import { useState } from "react";
import styles from "./ManageTags.module.css";
import { useData, useFilter } from "@/context";
import { useSlidePanel } from "@/context/SlidePanelContext";
import ManageTagsPanel from "../ManageTagsPanel/ManageTagsPanel";

export default function ManageTags() {
  const { tags, isLoadingTags } = useData();
  const { selectedTagIds, toggleTag, clearFilters, hasActiveFilters } = useFilter();
  const { openPanel } = useSlidePanel();
  const [showAll, setShowAll] = useState(false);

  const displayedTags = showAll ? tags : tags.slice(0, 10);
  const hasMoreTags = tags.length > 10;

  const handleOpenManagePanel = () => {
    openPanel(
      "Manage Tags",
      <ManageTagsPanel />
    );
  };

  return (
    <div className={styles.manageTags}>
      <div className={styles.tagsContainer}>
        {isLoadingTags ? (
          <span className={styles.loadingText}>Loading tags...</span>
        ) : tags.length === 0 ? (
          <span className={styles.emptyText}>No tags yet</span>
        ) : (
          <>
            {displayedTags.map((tag) => {
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
            {hasMoreTags && !showAll && (
              <button
                className={styles.showMoreButton}
                onClick={() => setShowAll(true)}
                title="Show all tags"
              >
                Show more
              </button>
            )}
            {hasMoreTags && showAll && (
              <button
                className={styles.showMoreButton}
                onClick={() => setShowAll(false)}
                title="Show less tags"
              >
                Show less
              </button>
            )}
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
      </div>
      <button
        onClick={handleOpenManagePanel}
        className={styles.manageButton}
      >
        Manage Tags
      </button>
    </div>
  );
}
