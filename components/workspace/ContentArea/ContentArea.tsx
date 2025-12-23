"use client";

import styles from "./ContentArea.module.css";
import { useSelection, useSearch } from "@/context";
import InnerHeader from "../InnerHeader/InnerHeader";
import SearchResults from "@/components/workspace/SearchResults/SearchResults";
import EmptyState from "@/components/workspace/EmptyState/EmptyState";
import FolderView from "@/components/workspace/FolderView/FolderView";
import WebsiteView from "@/components/workspace/WebsiteView/WebsiteView";

export default function ContentArea() {
  const { selectedType, selectedFolder, selectedWebsite, selectFolder, selectWebsite } = useSelection();
  const { showResults, searchResults, searchQuery, closeResults } = useSearch();

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
