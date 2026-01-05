"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Website } from "@/models/types/website";
import WebsiteCard from "./WebsiteCard";
import styles from "./WebsiteCard.module.css";
import Icon from "@/styles/Icons";

interface SortableWebsiteCardProps {
  website: Website;
  onEdit?: (website: Website) => void;
  onDelete?: (websiteId: string) => void;
  onViewMore?: (website: Website) => void;
  onToggleStarred?: (websiteId: string, starred: boolean) => void;
  onMove?: (website: Website) => void;
}

export default function SortableWebsiteCard({
  website,
  onEdit,
  onDelete,
  onViewMore,
  onToggleStarred,
  onMove,
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
        <Icon type="dnd" />
      </div>
      <WebsiteCard
        website={website}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewMore={onViewMore}
        onToggleStarred={onToggleStarred}
        onMove={onMove}
      />
    </div>
  );
}
