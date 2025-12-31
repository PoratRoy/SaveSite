import Icon from "@/styles/Icons";
import styles from "./FolderActions.module.css";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";

interface FolderActionsProps {
  folderId: string;
  folderName: string;
  isRoot: boolean;
  onAddFolder: () => void;
  onAddWebsite: (folderId: string) => void;
  onEditFolder: () => void;
  onRemoveFolder: (folderId: string) => void;
}

export default function FolderActions({
  folderId,
  folderName,
  isRoot,
  onAddFolder,
  onAddWebsite,
  onEditFolder,
  onRemoveFolder,
}: FolderActionsProps) {
  const { openDialog } = useConfirmDialog();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDialog({
      title: "Delete Folder",
      message: `Are you sure you want to delete "${folderName}"? This will also delete all subfolders and websites inside it. This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: () => onRemoveFolder(folderId),
    });
  };

  return (
    <>
    <div className={styles.actions}>
      <button
        className={styles.actionButton}
        onClick={(e) => {
          e.stopPropagation();
          onAddFolder();
        }}
        title="Add folder"
      >
        <Icon type="folderTree" size={16} />
      </button>
      <button
        className={styles.actionButton}
        onClick={(e) => {
          e.stopPropagation();
          onAddWebsite(folderId);
        }}
        title="Add website"
      >
        <Icon type="siteTree" size={16} />
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
            <Icon type="edit" size={16} />
          </button>
          <button
            className={styles.actionButton}
            onClick={handleDeleteClick}
            title="Delete folder"
          >
            <Icon type="delete" size={16} />
          </button>
        </>
      )}
    </div>
    </>
  );
}
