import { useSelection } from "@/context";
import { Folder } from "@/models/types/folder";
import styles from "./FolderGrid.module.css";

interface FolderGridProps {
  folders: Folder[];
}

export default function FolderGrid({ folders }: FolderGridProps) {
  const { selectFolder } = useSelection();

  const handleFolderClick = (folder: Folder) => {
    selectFolder(folder);
  };

  return (
    <div className={styles.folderGrid}>
      {folders.map((folder) => (
        <button
          key={folder.id}
          className={styles.folderCard}
          onClick={() => handleFolderClick(folder)}
          title={folder.name}
        >
          <div className={styles.folderIcon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className={styles.folderName}>{folder.name}</div>
          {folder.children && folder.children.length > 0 && (
            <div className={styles.folderCount}>
              {folder.children.length}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
