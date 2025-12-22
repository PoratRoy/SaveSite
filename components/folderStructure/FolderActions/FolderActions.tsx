import styles from "./FolderActions.module.css";
import { FolderPlusIcon, LinkIcon, EditIcon, TrashIcon } from "@/styles/Icons";

interface FolderActionsProps {
  folderId: string;
  isRoot: boolean;
  onAddFolder: () => void;
  onAddWebsite: (folderId: string) => void;
  onEditFolder: () => void;
  onRemoveFolder: (folderId: string) => void;
}

export default function FolderActions({
  folderId,
  isRoot,
  onAddFolder,
  onAddWebsite,
  onEditFolder,
  onRemoveFolder,
}: FolderActionsProps) {
  return (
    <div className={styles.actions}>
      <button
        className={styles.actionButton}
        onClick={(e) => {
          e.stopPropagation();
          onAddFolder();
        }}
        title="Add folder"
      >
        <FolderPlusIcon />
      </button>
      <button
        className={styles.actionButton}
        onClick={(e) => {
          e.stopPropagation();
          onAddWebsite(folderId);
        }}
        title="Add website"
      >
        <LinkIcon />
      </button>
      {!isRoot && (
        <>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              onEditFolder();
            }}
            title="Edit folder"
          >
            <EditIcon />
          </button>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFolder(folderId);
            }}
            title="Delete folder"
          >
            <TrashIcon />
          </button>
        </>
      )}
    </div>
  );
}
