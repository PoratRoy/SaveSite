import { useState, useMemo } from "react";
import styles from "./FolderView.module.css";
import { Folder } from "@/models/types/folder";
import { Website } from "@/models/types/website";
import WebsiteCard from "@/components/main/WebsiteCard/WebsiteCard";
import EditWebsiteForm from "@/components/main/EditWebsiteForm/EditWebsiteForm";
import { useData, useFilter, useSelection } from "@/context";
import { useSlidePanel } from "@/context/SlidePanelContext";

interface FolderViewProps {
  folder: Folder;
}

export default function FolderView({ folder }: FolderViewProps) {
  const { updateWebsite, removeWebsite } = useData();
  const { openPanel, closePanel } = useSlidePanel();
  const { selectedTagIds, hasActiveFilters } = useFilter();
  const { selectWebsite } = useSelection();
  
  // Filter websites based on selected tags
  const filteredWebsites = useMemo(() => {
    if (!folder.websites || !hasActiveFilters) {
      return folder.websites || [];
    }
    
    return folder.websites.filter((website) => {
      // Website must have at least one of the selected tags
      return website.tags?.some((tag) => selectedTagIds.includes(tag.id));
    });
  }, [folder.websites, selectedTagIds, hasActiveFilters]);
  
  const hasChildren = folder.children && folder.children.length > 0;
  const hasWebsites = filteredWebsites.length > 0;
  const isEmpty = !hasChildren && !hasWebsites;

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

  const handleDeleteWebsite = async (websiteId: string) => {
    if (confirm("Are you sure you want to delete this website?")) {
      try {
        await removeWebsite(websiteId);
      } catch (err) {
        console.error("Failed to delete website:", err);
        alert("Failed to delete website");
      }
    }
  };

  const handleViewMore = (website: Website) => {
    selectWebsite(website);
  };

  return (
    <section className={styles.folderView}>
      {hasChildren && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Folders ({folder.children!.length})
          </h3>
          <ul className={styles.list}>
            {folder.children!.map((child) => (
              <li key={child.id} className={styles.listItem}>
                📁 {child.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasWebsites && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Websites ({filteredWebsites.length})
            {hasActiveFilters && folder.websites && folder.websites.length !== filteredWebsites.length && (
              <span className={styles.filterInfo}> (filtered from {folder.websites.length})</span>
            )}
          </h3>
          <div className={styles.websitesGrid}>
            {filteredWebsites.map((website) => (
              <WebsiteCard
                key={website.id}
                website={website}
                onEdit={handleEditWebsite}
                onDelete={handleDeleteWebsite}
                onViewMore={handleViewMore}
              />
            ))}
          </div>
        </div>
      )}

      {isEmpty && (
        <p className={styles.placeholder}>This folder is empty</p>
      )}
    </section>
  );
}
