"use client";

import { useEffect, useState } from "react";
import styles from "./WorkspaceLayout.module.css";
import { useSelection, useData } from "@/context";
import { useSidebar, COLLAPSED_WIDTH } from "@/context/SidebarContext";
import { useSlidePanel } from "@/context/SlidePanelContext";
import { useAppQueryParams } from "@/hooks/useAppQueryParams";
import InnerHeader from "../header/InnerHeader/InnerHeader";
import EmptyState from "@/components/workspace/EmptyState/EmptyState";
import FolderView from "@/components/workspace/views/FolderView/FolderView";
import WebsiteView from "@/components/workspace/views/WebsiteView/WebsiteView";
import StarredView from "@/components/workspace/views/StarredView/StarredView";
import EditWebsiteForm from "@/components/forms/EditWebsiteForm/EditWebsiteForm";
import { Website } from "@/models/types/website";

export default function WorkspaceLayout() {
  // Sync URL query params with application state
  useAppQueryParams();
  
  const { selectedType, selectedFolder, selectedWebsite, selectedFolderId } = useSelection();
  const { refreshTags, updateWebsite } = useData();
  const { openPanel, closePanel } = useSlidePanel();
  const { isOpen, width } = useSidebar();
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);

  // Refresh tags when folder changes to include folder-specific tags
  useEffect(() => {
    if (selectedFolderId) {
      refreshTags(selectedFolderId);
    } else {
      refreshTags(); // Fetch only global tags when no folder selected
    }
  }, [selectedFolderId, refreshTags]);

  // Calculate inner header height based on tags expansion
  const hasTagsSection = selectedType === "folder" || selectedType === "starred";
  const innerHeaderHeight = hasTagsSection 
    ? (isTagsExpanded ? 160 : 60) // ~60px breadcrumb + ~100px tags when expanded
    : 60; // Just breadcrumb

  const handleEditWebsite = (website: Website) => {
    const handleUpdate = async (websiteData: {
      title: string;
      link: string;
      description?: string;
      image?: string;
      icon?: string;
      color?: string;
      tagIds?: string[];
    }) => {
      try {
        await updateWebsite(website.id, websiteData);
        closePanel();
      } catch (err) {
        throw err;
      }
    };

    openPanel(
      "Edit Website",
      <EditWebsiteForm
        website={website}
        onSubmit={handleUpdate}
        onCancel={closePanel}
      />
    );
  };

  return (
    <main 
      className={styles.dashboard}
      style={{
        marginLeft: isOpen ? `${width}px` : `${COLLAPSED_WIDTH}px`,
        transition: 'margin-left 0.2s ease'
      }}
    >
      <InnerHeader isTagsExpanded={isTagsExpanded} setIsTagsExpanded={setIsTagsExpanded} />
      <div 
        className={styles.dashboardContent}
        style={{
          height: `calc(100vh - 64px - ${innerHeaderHeight}px)`
        }}
      >
        {!selectedType && <EmptyState />}

        {selectedType === "starred" && (
          <StarredView />
        )}

        {selectedType === "folder" && selectedFolder && (
          <FolderView folder={selectedFolder} />
        )}

        {selectedType === "website" && selectedWebsite && (
          <WebsiteView website={selectedWebsite} onEdit={handleEditWebsite} />
        )}
      </div>
    </main>
  );
}
