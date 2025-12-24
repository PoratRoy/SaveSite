"use client";

import { useSelection, useData } from "@/context";
import { useSlidePanel } from "@/context/SlidePanelContext";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import ManageTags from "../ManageTags/ManageTags";
import CreateWebsiteForm from "../../forms/CreateWebsiteForm/CreateWebsiteForm";
import ManageTagsPanel from "../ManageTagsPanel/ManageTagsPanel";
import styles from "./InnerHeader.module.css";
import Icon from "@/styles/Icons";

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
              <Icon type="tag" size={20} />
              <span>Manage Tags</span>
            </button>
          )}
          {selectedType === "folder" && (
            <button
              onClick={handleAddWebsite}
              className={styles.createButton}
              title="Add new website"
            >
              <Icon type="add" size={20} />
              <span>Add Website</span>
            </button>
          )}
        </div>
      </div>
      {(selectedType === "folder" || selectedType === "starred") && <ManageTags />}
    </div>
  );
}
