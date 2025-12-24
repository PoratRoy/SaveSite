import { useState, useRef, useEffect } from "react";
import styles from "./WebsiteCard.module.css";
import { Website } from "@/models/types/website";
import Icon from "@/styles/Icons";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import { websiteEmojis } from "@/resources/emojis";

interface WebsiteCardProps {
  website: Website;
  onEdit?: (website: Website) => void;
  onDelete?: (websiteId: string) => void;
  onViewMore?: (website: Website) => void;
  onToggleStarred?: (websiteId: string, starred: boolean) => void;
}

export default function WebsiteCard({
  website,
  onEdit,
  onDelete,
  onViewMore,
  onToggleStarred,
}: WebsiteCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openDialog } = useConfirmDialog();

  const coverStyle = website.image
    ? { backgroundImage: `url(${website.image})` }
    : { backgroundColor: website.color || "#3b82f6" };

  const isIconUrl = website.icon && website.icon.startsWith("http");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          <Icon type="options" size={18} />
        </button>

        {showDropdown && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownItem}
              onClick={handleToggleStarred}
            >
              <Icon type={website.starred ? "starRow" : "star"} size={20} />
              <span>{website.starred ? "Unstar" : "Star"}</span>
            </button>
            <button className={styles.dropdownItem} onClick={handleEdit}>
              <Icon type="edit" size={20} />
              <span>Edit</span>
            </button>
            <button className={styles.dropdownItem} onClick={handleDeleteClick}>
              <Icon type="delete" size={20} />
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
                (e.target as HTMLImageElement).style.display = "none";
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<div class="' +
                    styles.iconEmoji +
                    '">' +
                    websiteEmojis[0] +
                    "</div>";
                }
              }}
            />
          ) : (
            <div className={styles.iconEmoji}>{website.icon}</div>
          )
        ) : (
          <div className={styles.iconPlaceholder}>
            <Icon type="siteTree" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{website.title}</h3>

        {/* Tags */}
        {website.tags && website.tags.length > 0 && (
          <div className={styles.tags}>
            {website.tags.slice(0, 6).map((tag) => (
              <span key={tag.id} className={styles.tag}>
                {tag.name}
              </span>
            ))}
            {website.tags.length > 6 && (
              <span className={styles.tagMore}>
                <Icon type="add" size={16} />
                {website.tags.length - 6}
              </span>
            )}
          </div>
        )}

        <div className={styles.actions}>
          {onViewMore && (
            <button
              onClick={() => onViewMore(website)}
              className={styles.viewMoreButton}
            >
              <Icon type="menu" size={16} /> More
            </button>
          )}
          <a
            href={website.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkButton}
          >
            <Icon type="link" size={16} />
            Visit
          </a>
        </div>
      </div>
    </div>
  );
}
