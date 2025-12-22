import styles from "./FolderActions.module.css";
import { FolderPlusIcon, LinkIcon, TrashIcon } from "@/styles/Icons";

interface FolderActionsProps {
  folderId: string;
  isRoot: boolean;
  onAddFolder: (folderId: string) => void;
  onAddWebsite: (folderId: string) => void;
  onRemoveFolder: (folderId: string) => void;
}

export default function FolderActions({
  folderId,
  isRoot,
  onAddFolder,
  onAddWebsite,
  onRemoveFolder,
}: FolderActionsProps) {
  return (
    <div className={styles.actions}>
      <button
        className={styles.actionButton}
        onClick={() => onAddFolder(folderId)}
        title="Add folder"
      >
        <FolderPlusIcon />
      </button>
      <button
        className={styles.actionButton}
        onClick={() => onAddWebsite(folderId)}
        title="Add website"
      >
        <LinkIcon />
      </button>
      {!isRoot && (
        <button
          className={styles.actionButton}
          onClick={() => onRemoveFolder(folderId)}
          title="Delete folder"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
