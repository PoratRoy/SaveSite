"use client";

import { useSelection, useData } from "@/context";
import { useSlidePanel } from "@/context/SlidePanelContext";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import ManageTags from "../ManageTags/ManageTags";
import CreateWebsiteForm from "../CreateWebsiteForm/CreateWebsiteForm";
import { LinkIcon } from "@/styles/Icons";
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

  return (
    <div className={styles.dashboardHeader}>
      <div className={styles.breadcrumbRow}>
        <Breadcrumb />
        {selectedType === "folder" && (
          <button
            onClick={handleAddWebsite}
            className={styles.createButton}
            title="Create new website"
          >
            <LinkIcon size={16} />
            <span>New Website</span>
          </button>
        )}
      </div>
      {(selectedType === "folder" || selectedType === "starred") && <ManageTags />}
    </div>
  );
}
