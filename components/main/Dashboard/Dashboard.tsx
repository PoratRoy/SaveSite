"use client";

import styles from "./Dashboard.module.css";
import { useSelection, useSearch } from "@/context";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import SearchResults from "@/components/main/SearchResults/SearchResults";
import EmptyState from "@/components/main/EmptyState/EmptyState";
import FolderView from "@/components/main/FolderView/FolderView";
import WebsiteView from "@/components/main/WebsiteView/WebsiteView";

export default function Dashboard() {
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
      <DashboardHeader />
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
