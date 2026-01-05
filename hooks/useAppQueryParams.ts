"use client";

import { useEffect, useCallback } from "react";
import { useQueryParams } from "./useQueryParams";
import { useSelection } from "@/context/SelectionContext";
import { useFilter } from "@/context/FilterContext";
import { useView } from "@/context/ViewContext";
import { useData } from "@/context/DataContext";

/**
 * Application-specific hook that integrates query params with all contexts
 * This hook should be used once at the app level to keep URL in sync with state
 * 
 * Features:
 * - Syncs URL with Selection, Filter, and View contexts
 * - Handles initial load from URL
 * - Updates URL when contexts change
 * - Maintains clean URL structure
 * 
 * @example
 * // In your main layout or page component:
 * function WorkspaceLayout() {
 *   useAppQueryParams();
 *   // ... rest of your component
 * }
 */
export function useAppQueryParams() {
  const { queryParams, updateQueryParams } = useQueryParams();
  const { rootFolder } = useData();
  const { 
    selectedFolder, 
    selectedWebsite, 
    selectFolder, 
    selectWebsite 
  } = useSelection();
  const { selectedTagIds, toggleTag, clearFilters } = useFilter();
  const { viewMode, setViewMode } = useView();

  // Track if initial load is complete to avoid circular updates
  const isInitialLoadRef = useCallback(() => {
    return !rootFolder; // If rootFolder isn't loaded yet, we're still initializing
  }, [rootFolder]);

  /**
   * INITIAL LOAD: Restore state from URL on mount
   */
  useEffect(() => {
    if (!rootFolder) return; // Wait for data to load

    let hasChanges = false;

    // Restore folder selection from URL
    if (queryParams.folder && queryParams.folder !== selectedFolder?.name) {
      const folder = findFolderByName(rootFolder, queryParams.folder);
      if (folder) {
        selectFolder(folder);
        hasChanges = true;
      }
    }

    // Restore website selection from URL
    if (queryParams.website && queryParams.website !== selectedWebsite?.title) {
      const website = findWebsiteByTitle(rootFolder, queryParams.website);
      if (website) {
        selectWebsite(website);
        hasChanges = true;
      }
    }

    // Restore tag filters from URL
    if (queryParams.tags) {
      const currentTagsSet = new Set(selectedTagIds);
      const urlTagsSet = new Set(queryParams.tags);
      
      // Check if tags are different
      const tagsChanged = 
        currentTagsSet.size !== urlTagsSet.size ||
        [...currentTagsSet].some(id => !urlTagsSet.has(id));

      if (tagsChanged) {
        // Clear current filters and apply URL filters
        clearFilters();
        queryParams.tags.forEach(tagId => toggleTag(tagId));
        hasChanges = true;
      }
    }

    // Restore view mode from URL
    if (queryParams.view && queryParams.view !== viewMode) {
      setViewMode(queryParams.view);
      hasChanges = true;
    }

    // Only log if we actually restored something
    if (hasChanges) {
      console.log("Restored state from URL:", queryParams);
    }
  }, [rootFolder]); // Only run when rootFolder loads

  /**
   * SYNC: Update URL when folder selection changes
   */
  useEffect(() => {
    if (isInitialLoadRef()) return;

    const folderName = selectedFolder?.name;
    const currentFolderParam = queryParams.folder;

    if (folderName !== currentFolderParam) {
      // Clear filters when switching folders
      clearFilters();
      
      updateQueryParams({ 
        folder: folderName,
        // Clear website and tags when folder changes
        website: undefined,
        tags: undefined
      }, { replace: true });
    }
  }, [selectedFolder?.name]);

  /**
   * SYNC: Update URL when website selection changes
   */
  useEffect(() => {
    if (isInitialLoadRef()) return;

    const websiteTitle = selectedWebsite?.title;
    const currentWebsiteParam = queryParams.website;

    if (websiteTitle !== currentWebsiteParam) {
      updateQueryParams({ 
        website: websiteTitle 
      }, { replace: true });
    }
  }, [selectedWebsite?.title]);

  /**
   * SYNC: Update URL when tag filters change
   */
  useEffect(() => {
    if (isInitialLoadRef()) return;

    const currentUrlTags = queryParams.tags || [];
    const tagsChanged = 
      selectedTagIds.length !== currentUrlTags.length ||
      selectedTagIds.some(id => !currentUrlTags.includes(id));

    if (tagsChanged) {
      updateQueryParams({ 
        tags: selectedTagIds.length > 0 ? selectedTagIds : undefined 
      }, { replace: true });
    }
  }, [selectedTagIds]);

  /**
   * SYNC: Update URL when view mode changes
   */
  useEffect(() => {
    if (isInitialLoadRef()) return;

    if (viewMode !== queryParams.view) {
      updateQueryParams({ 
        view: viewMode 
      }, { replace: true });
    }
  }, [viewMode]);
}

/**
 * Helper: Find folder by name in the folder tree
 */
function findFolderByName(folder: any, name: string): any {
  if (folder.name === name) return folder;
  
  if (folder.children) {
    for (const child of folder.children) {
      const found = findFolderByName(child, name);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Helper: Find website by title in the folder tree
 */
function findWebsiteByTitle(folder: any, title: string): any {
  // Check websites in current folder
  if (folder.websites) {
    const website = folder.websites.find((w: any) => w.title === title);
    if (website) return website;
  }
  
  // Check child folders recursively
  if (folder.children) {
    for (const child of folder.children) {
      const found = findWebsiteByTitle(child, title);
      if (found) return found;
    }
  }
  
  return null;
}
