"use client";

import { useSelection, useData } from "@/context";
import { useSlidePanel } from "@/context/SlidePanelContext";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import ManageTags from "../ManageTags/ManageTags";
import CreateWebsiteForm from "../CreateWebsiteForm/CreateWebsiteForm";
import ManageTagsPanel from "../ManageTagsPanel/ManageTagsPanel";
import styles from "./InnerHeader.module.css";

export default function InnerHeader() {
  const { selectedType, selectedFolder } = useSelection();
  const { addWebsite } = useData();
  const { openPanel, closePanel } = useSlidePanel();

  const handleAddWebsite = () => {
    if (!selectedFolder) return;

    const handleCreateWebsite = async (websiteData: any) => {
      try {
        await addWebsite(selectedFolder.id, websiteData);
        closePanel();
      } catch (err) {
        throw err;
      }
    };

    const handleCancel = () => {
      closePanel();
    };

    openPanel(
      "Create Website",
      <CreateWebsiteForm
        folderId={selectedFolder.id}
        onSubmit={handleCreateWebsite}
        onCancel={handleCancel}
      />
    );
  };

  const handleOpenManagePanel = () => {
    openPanel(
      "Manage Tags",
      <ManageTagsPanel />
    );
  };

  return (
    <div className={styles.dashboardHeader}>
      <div className={styles.breadcrumbRow}>
        <Breadcrumb />
        <div className={styles.buttonGroup}>
          {(selectedType === "folder" || selectedType === "starred") && (
            <button
              onClick={handleOpenManagePanel}
              className={styles.manageButton}
              title="Manage tags"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <span>Manage Tags</span>
            </button>
          )}
          {selectedType === "folder" && (
            <button
              onClick={handleAddWebsite}
              className={styles.createButton}
              title="Add new website"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add Website</span>
            </button>
          )}
        </div>
      </div>
      {(selectedType === "folder" || selectedType === "starred") && <ManageTags />}
    </div>
  );
}
