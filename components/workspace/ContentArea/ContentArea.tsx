"use client";

import { useEffect } from "react";
import styles from "./ContentArea.module.css";
import { useSelection, useData } from "@/context";
import { useSidebar, COLLAPSED_WIDTH } from "@/context/SidebarContext";
import InnerHeader from "../InnerHeader/InnerHeader";
import EmptyState from "@/components/workspace/EmptyState/EmptyState";
import FolderView from "@/components/workspace/FolderView/FolderView";
import WebsiteView from "@/components/workspace/WebsiteView/WebsiteView";
import StarredView from "@/components/workspace/StarredView/StarredView";

export default function ContentArea() {
  const { selectedType, selectedFolder, selectedWebsite, selectedFolderId } = useSelection();
  const { refreshTags } = useData();
  const { isOpen, width } = useSidebar();

  // Refresh tags when folder changes to include folder-specific tags
  useEffect(() => {
    if (selectedFolderId) {
      refreshTags(selectedFolderId);
    } else {
      refreshTags(); // Fetch only global tags when no folder selected
    }
  }, [selectedFolderId]);

  return (
    <main 
      className={styles.dashboard}
      style={{
        marginLeft: isOpen ? `${width}px` : `${COLLAPSED_WIDTH}px`,
        transition: 'margin-left 0.2s ease'
      }}
    >
      <InnerHeader />
      <div className={styles.dashboardContent}>
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
