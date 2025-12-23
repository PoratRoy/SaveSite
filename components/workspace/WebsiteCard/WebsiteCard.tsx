import { useState, useRef, useEffect } from "react";
import styles from "./WebsiteCard.module.css";
import { Website } from "@/models/types/website";
import { LinkIcon, MoreVerticalIcon, EditIcon, TrashIcon } from "@/styles/Icons";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";

interface WebsiteCardProps {
  website: Website;
  onEdit?: (website: Website) => void;
  onDelete?: (websiteId: string) => void;
  onViewMore?: (website: Website) => void;
  onToggleStarred?: (websiteId: string, starred: boolean) => void;
}

export default function WebsiteCard({ website, onEdit, onDelete, onViewMore, onToggleStarred }: WebsiteCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openDialog } = useConfirmDialog();

  const coverStyle = website.image
    ? { backgroundImage: `url(${website.image})` }
    : { backgroundColor: website.color || "#3b82f6" };

  const isIconUrl = website.icon && website.icon.startsWith('http');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleEdit = () => {
    setShowDropdown(false);
    onEdit?.(website);
  };

  const handleDeleteClick = () => {
    setShowDropdown(false);
    openDialog({
      title: "Delete Website",
      message: `Are you sure you want to delete "${website.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: () => onDelete?.(website.id),
    });
  };

  const handleToggleStarred = () => {
    setShowDropdown(false);
    onToggleStarred?.(website.id, !website.starred);
  };

  return (
    <div className={styles.card}>
      {/* Cover Image or Color */}
      <div className={styles.cover} style={coverStyle}></div>

      {/* Dropdown Menu */}
      <div className={styles.menuContainer} ref={dropdownRef}>
        <button
          className={styles.menuButton}
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          aria-label="More options"
        >
          <MoreVerticalIcon size={18} />
        </button>

        {showDropdown && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownItem}
              onClick={handleToggleStarred}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={website.starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{website.starred ? 'Unstar' : 'Star'}</span>
            </button>
            <button
              className={styles.dropdownItem}
              onClick={handleEdit}
            >
              <EditIcon size={16} />
              <span>Edit</span>
            </button>
            <button
              className={styles.dropdownItem}
              onClick={handleDeleteClick}
            >
              <TrashIcon size={16} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Favicon Icon */}
      <div className={styles.iconContainer}>
        {website.icon ? (
          isIconUrl ? (
            <img 
              src={website.icon} 
              alt={website.title} 
              className={styles.icon}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="' + styles.iconEmoji + '">🌐</div>';
                }
              }}
            />
          ) : (
            <div className={styles.iconEmoji}>{website.icon}</div>
          )
        ) : (
          <div className={styles.iconPlaceholder}>
            <LinkIcon size={20} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{website.title}</h3>
        
        {/* Description */}
        {website.description && (
          <p className={styles.description}>{website.description}</p>
        )}
        
        {/* Tags */}
        {website.tags && website.tags.length > 0 && (
          <div className={styles.tags}>
            {website.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className={styles.tag}>
                {tag.name}
              </span>
            ))}
            {website.tags.length > 3 && (
              <span className={styles.tagMore}>+{website.tags.length - 3}</span>
            )}
          </div>
        )}
        
        <div className={styles.actions}>
          {onViewMore && (
            <button
              onClick={() => onViewMore(website)}
              className={styles.viewMoreButton}
            >
              ⋯ More
            </button>
          )}
          <a
            href={website.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkButton}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Visit
          </a>
        </div>
      </div>
    </div>
  );
}
