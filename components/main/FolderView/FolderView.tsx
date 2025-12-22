import styles from "./FolderView.module.css";
import { Folder } from "@/models/types/folder";
import WebsiteCard from "@/components/main/WebsiteCard/WebsiteCard";

interface FolderViewProps {
  folder: Folder;
}

export default function FolderView({ folder }: FolderViewProps) {
  const hasChildren = folder.children && folder.children.length > 0;
  const hasWebsites = folder.websites && folder.websites.length > 0;
  const isEmpty = !hasChildren && !hasWebsites;

  return (
    <>
      <h2 className={styles.title}>{folder.name}</h2>
      
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
            Websites ({folder.websites!.length})
          </h3>
          <div className={styles.websitesGrid}>
            {folder.websites!.map((website) => (
              <WebsiteCard key={website.id} website={website} />
            ))}
          </div>
        </div>
      )}

      {isEmpty && (
        <p className={styles.placeholder}>This folder is empty</p>
      )}
    </>
  );
}
