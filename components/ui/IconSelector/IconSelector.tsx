"use client";

import styles from "./IconSelector.module.css";
import { websiteEmojis, defaultWebsiteEmoji } from "@/resources/emojis";

interface IconSelectorProps {
  value?: string | null;
  onChange: (icon: string) => void;
  faviconUrl?: string | null;
}

export default function IconSelector({ value, onChange, faviconUrl }: IconSelectorProps) {
  const currentIcon = value || defaultWebsiteEmoji;
  const isUrl = currentIcon.startsWith('http');
  const hasFavicon = faviconUrl && faviconUrl.startsWith('http');

  return (
    <div className={styles.iconSelectorContainer}>
      <label className={styles.label}>Select Emoji Icon</label>
      <div className={styles.iconSelector}>
        {/* Preview Circle */}
        <div className={styles.iconPreview}>
          {isUrl ? (
            <img
              src={currentIcon}
              alt="Icon preview"
              className={styles.previewImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className={styles.previewEmoji}>{currentIcon}</div>
          )}
        </div>
        
        {/* Icon Grid */}
        <div className={styles.iconGrid}>
          {/* Favicon first if available */}
          {hasFavicon && (
            <button
              type="button"
              className={`${styles.iconOption} ${currentIcon === faviconUrl ? styles.selected : ''}`}
              onClick={() => onChange(faviconUrl)}
              title="Use favicon"
            >
              <img
                src={faviconUrl}
                alt="Favicon"
                className={styles.iconImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>
          )}
          {/* Emoji options */}
          {websiteEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={`${styles.iconOption} ${currentIcon === emoji ? styles.selected : ''}`}
              onClick={() => onChange(emoji)}
              title={`Use ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
