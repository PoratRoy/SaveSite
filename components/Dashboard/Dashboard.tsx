"use client";

import styles from "./Dashboard.module.css";
import { useSelection } from "@/context";

export default function Dashboard() {
  const { selectedType, selectedFolder, selectedWebsite } = useSelection();

  return (
    <main className={styles.dashboard}>
      <div className={styles.dashboardContent}>
        {!selectedType && (
          <>
            <h2 className={styles.dashboardTitle}>My Websites</h2>
            <p className={styles.placeholder}>Select a folder or website from the sidebar to view details</p>
          </>
        )}

        {selectedType === "folder" && selectedFolder && (
          <>
            <h2 className={styles.dashboardTitle}>{selectedFolder.name}</h2>
            
            {selectedFolder.children && selectedFolder.children.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Folders ({selectedFolder.children.length})</h3>
                <ul className={styles.list}>
                  {selectedFolder.children.map((child) => (
                    <li key={child.id} className={styles.listItem}>
                      📁 {child.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedFolder.websites && selectedFolder.websites.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Websites ({selectedFolder.websites.length})</h3>
                <ul className={styles.list}>
                  {selectedFolder.websites.map((website) => (
                    <li key={website.id} className={styles.listItem}>
                      🔗 {website.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(!selectedFolder.children || selectedFolder.children.length === 0) &&
             (!selectedFolder.websites || selectedFolder.websites.length === 0) && (
              <p className={styles.placeholder}>This folder is empty</p>
            )}
          </>
        )}

        {selectedType === "website" && selectedWebsite && (
          <>
            <h2 className={styles.dashboardTitle}>{selectedWebsite.title}</h2>
            
            <div className={styles.section}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>URL:</span>
                <a 
                  href={selectedWebsite.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.detailLink}
                >
                  {selectedWebsite.link}
                </a>
              </div>

              {selectedWebsite.description && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Description:</span>
                  <span className={styles.detailValue}>{selectedWebsite.description}</span>
                </div>
              )}

              {selectedWebsite.image && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Image:</span>
                  <img 
                    src={selectedWebsite.image} 
                    alt={selectedWebsite.title}
                    className={styles.websiteImage}
                  />
                </div>
              )}

              {selectedWebsite.icon && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Icon:</span>
                  <img 
                    src={selectedWebsite.icon} 
                    alt="icon"
                    className={styles.websiteIcon}
                  />
                </div>
              )}

              {selectedWebsite.color && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Color:</span>
                  <div 
                    className={styles.colorSwatch}
                    style={{ backgroundColor: selectedWebsite.color }}
                  ></div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
