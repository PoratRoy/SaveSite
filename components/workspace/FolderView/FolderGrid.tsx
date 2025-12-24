import { useSelection } from "@/context";
import { Folder } from "@/models/types/folder";
import styles from "./FolderGrid.module.css";
import Icon from "@/styles/Icons";

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
      {folders.map((folder: Folder) => (
        <button
          key={folder.id}
          className={styles.folderCard}
          onClick={() => handleFolderClick(folder)}
          title={folder.name}
        >
          <div className={styles.folderIcon}>
            <Icon type="folder" size={50} />
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
