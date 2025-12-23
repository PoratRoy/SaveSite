"use client";

import { Reorder, useDragControls } from "framer-motion";
import { Website } from "@/models/types/website";
import WebsiteCard from "./WebsiteCard";
import styles from "./WebsiteCard.module.css";

interface WebsiteCardItemProps {
  website: Website;
  onEdit?: (website: Website) => void;
  onDelete?: (websiteId: string) => void;
  onViewMore?: (website: Website) => void;
}

export default function WebsiteCardItem({
  website,
  onEdit,
  onDelete,
  onViewMore,
}: WebsiteCardItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={website}
      dragListener={false}
      dragControls={dragControls}
      className={styles.cardWrapper}
    >
      <div
        className={styles.dragHandle}
        onPointerDown={(e) => dragControls.start(e)}
      >
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
      />
    </Reorder.Item>
  );
}
