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
    <>
      <label className={styles.label}>Icon/Favicon</label>
      <div className={styles.iconSelector}>
        <div className={styles.iconPreview}>
          {isUrl ? (
            <img
              src={currentIcon}
              alt="Icon preview"
              className={styles.iconImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="' + styles.noIcon + '">🌐</div>';
                }
              }}
            />
          ) : (
            <div className={styles.emojiIcon}>{currentIcon}</div>
          )}
        </div>
        <div className={styles.emojiOptions}>
          {hasFavicon && (
            <button
              type="button"
              className={`${styles.faviconOption} ${currentIcon === faviconUrl ? styles.selected : ''}`}
              onClick={() => onChange(faviconUrl)}
              title="Use favicon"
            >
              <img
                src={faviconUrl}
                alt="Favicon"
                className={styles.faviconImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>
          )}
          {websiteEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={`${styles.emojiOption} ${currentIcon === emoji ? styles.selected : ''}`}
              onClick={() => onChange(emoji)}
              title={`Use ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
