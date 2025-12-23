"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Website } from "@/models/types/website";
import WebsiteCard from "./WebsiteCard";
import styles from "./WebsiteCard.module.css";

interface SortableWebsiteCardProps {
  website: Website;
  onEdit?: (website: Website) => void;
  onDelete?: (websiteId: string) => void;
  onViewMore?: (website: Website) => void;
  onToggleStarred?: (websiteId: string, starred: boolean) => void;
}

export default function SortableWebsiteCard({
  website,
  onEdit,
  onDelete,
  onViewMore,
  onToggleStarred,
}: SortableWebsiteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: website.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.cardWrapper}>
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6" cy="4" r="1.5" fill="currentColor" />
          <circle cx="10" cy="4" r="1.5" fill="currentColor" />
          <circle cx="6" cy="8" r="1.5" fill="currentColor" />
          <circle cx="10" cy="8" r="1.5" fill="currentColor" />
          <circle cx="6" cy="12" r="1.5" fill="currentColor" />
          <circle cx="10" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <WebsiteCard
        website={website}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewMore={onViewMore}
        onToggleStarred={onToggleStarred}
      />
    </div>
  );
}
