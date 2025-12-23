"use client";

import { useEffect } from "react";
import styles from "./ContentArea.module.css";
import { useSelection, useSearch, useData } from "@/context";
import InnerHeader from "../InnerHeader/InnerHeader";
import SearchResults from "@/components/workspace/SearchResults/SearchResults";
import EmptyState from "@/components/workspace/EmptyState/EmptyState";
import FolderView from "@/components/workspace/FolderView/FolderView";
import WebsiteView from "@/components/workspace/WebsiteView/WebsiteView";
import StarredView from "@/components/workspace/StarredView/StarredView";

export default function ContentArea() {
  const { selectedType, selectedFolder, selectedWebsite, selectFolder, selectWebsite, selectedFolderId } = useSelection();
  const { showResults, searchResults, searchQuery, closeResults } = useSearch();
  const { refreshTags } = useData();

  // Refresh tags when folder changes to include folder-specific tags
  useEffect(() => {
    if (selectedFolderId) {
      refreshTags(selectedFolderId);
    } else {
      refreshTags(); // Fetch only global tags when no folder selected
    }
  }, [selectedFolderId]);

  const handleResultClick = (result: any) => {
    if (result.type === "folder") {
      selectFolder(result.item);
    } else {
      selectWebsite(result.item);
    }
    closeResults();
  };

  return (
    <main className={styles.dashboard}>
      <InnerHeader />
      <div className={styles.dashboardContent}>
        {showResults && (
          <SearchResults
            searchQuery={searchQuery}
            searchResults={searchResults}
            onResultClick={handleResultClick}
            onClose={closeResults}
          />
        )}

        {!selectedType && <EmptyState />}

        {selectedType === "starred" && (
          <StarredView />
        )}

        {selectedType === "folder" && selectedFolder && (
          <FolderView folder={selectedFolder} />
        )}

        {selectedType === "website" && selectedWebsite && (
          <WebsiteView website={selectedWebsite} />
        )}
      </div>
    </main>
  );
}
