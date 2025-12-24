"use client";

import { useSelection, useData, useView } from "@/context";
import { useSlidePanel } from "@/context/SlidePanelContext";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import ManageTags from "../ManageTags/ManageTags";
import CreateWebsiteForm from "../../forms/CreateWebsiteForm/CreateWebsiteForm";
import ManageTagsPanel from "../ManageTagsPanel/ManageTagsPanel";
import styles from "./InnerHeader.module.css";
import Icon from "@/styles/Icons";

interface InnerHeaderProps {
  isTagsExpanded: boolean;
  setIsTagsExpanded: (value: boolean) => void;
}

export default function InnerHeader({
  isTagsExpanded,
  setIsTagsExpanded,
}: InnerHeaderProps) {
  const { selectedType, selectedFolder } = useSelection();
  const { addWebsite } = useData();
  const { openPanel, closePanel } = useSlidePanel();
  const { viewMode, toggleViewMode } = useView();

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
    openPanel("Manage Tags", <ManageTagsPanel />);
  };

  return (
    <div className={styles.dashboardHeader}>
      <div className={styles.breadcrumbRow}>
        <Breadcrumb />
        <div className={styles.buttonGroup}>
          {(selectedType === "folder" || selectedType === "starred") && (
            <>
              <button
                onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                className={styles.toggleButton}
                title={isTagsExpanded ? "Hide filters" : "Show filters"}
              >
                <Icon
                  type={isTagsExpanded ? "arrowUp" : "arrowDown"}
                  size={20}
                />
              </button>
              <button
                onClick={toggleViewMode}
                className={styles.toggleButton}
                title={
                  viewMode === "grid"
                    ? "Switch to list view"
                    : "Switch to grid view"
                }
              >
                <Icon type={viewMode === "grid" ? "list" : "grid"} size={20} />
              </button>
              <button
                onClick={handleOpenManagePanel}
                className={styles.manageButton}
                title="Manage tags"
              >
                <Icon type="tag" size={20} />
                <span>Manage Tags</span>
              </button>
            </>
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
      {(selectedType === "folder" || selectedType === "starred") &&
        isTagsExpanded && <ManageTags />}
    </div>
  );
}
