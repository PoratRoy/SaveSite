"use client";

import { useState, ChangeEvent, useEffect } from "react";
import styles from "./EditWebsiteForm.module.css";
import { Website } from "@/models/types/website";
import { BannerObj } from "@/models/types/thumbnail";
import { defaultBannerColor, BannerColorOptions } from "@/styles/colors";
import { useData } from "@/context/DataContext";

interface EditWebsiteFormProps {
  website: Website;
  onSubmit: (data: {
    title: string;
    link: string;
    description?: string;
    image?: string;
    icon?: string;
    color?: string;
    tagIds?: string[];
  }) => Promise<void>;
  onCancel: () => void;
}

export default function EditWebsiteForm({
  website,
  onSubmit,
  onCancel,
}: EditWebsiteFormProps) {
  const { tags } = useData();
  const [formData, setFormData] = useState({
    title: website.title,
    link: website.link,
    description: website.description || "",
    icon: website.icon || "",
  });
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    website.tags?.map((tag) => tag.id) || []
  );
  const [banner, setBanner] = useState<BannerObj>({
    type: website.image ? 'banner' : 'color',
    value: website.image || website.color || defaultBannerColor,
  });
  const [hasBannerUrl, setHasBannerUrl] = useState<string | undefined>(website.image || undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isIconUrl = formData.icon && formData.icon.startsWith('http');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.link.trim()) {
      setError("Title and URL are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const image = banner.type === 'banner' ? banner.value : undefined;
      const color = banner.type === 'color' ? banner.value : undefined;
      
      await onSubmit({
        title: formData.title.trim(),
        link: formData.link.trim(),
        description: formData.description.trim() || undefined,
        image,
        icon: formData.icon.trim() || undefined,
        color,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update website");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="link" className={styles.label}>
          Website URL <span className={styles.required}>*</span>
        </label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="https://example.com"
          className={styles.input}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="My Awesome Website"
          className={styles.input}
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Icon Preview */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Icon/Favicon
        </label>
        <div className={styles.iconSelector}>
          <div className={styles.iconPreview}>
            {formData.icon && isIconUrl ? (
              <img
                src={formData.icon}
                alt="Icon preview"
                className={styles.iconImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="' + styles.noIcon + '">🌐</div>';
                  }
                }}
              />
            ) : (
              <div className={styles.emojiIcon}>{formData.icon || '🌐'}</div>
            )}
          </div>
          <div className={styles.emojiOptions}>
            {['🌐', '🔗', '⭐', '💼', '📱', '💻', '🎨', '🎯', '🚀', '📚', '🎵', '🎮'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`${styles.emojiOption} ${formData.icon === emoji ? styles.selected : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, icon: emoji }))}
                title={`Use ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Banner Selector */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Select banner or placeholder color
        </label>
        <div className={styles.bannerSelector}>
          {hasBannerUrl && (
            <div
              className={`${styles.bannerOption} ${
                banner.type === 'banner' ? styles.selected : ''
              }`}
              onClick={() => setBanner({ type: 'banner', value: hasBannerUrl })}
              title="Use banner image"
            >
              <img
                src={hasBannerUrl}
                alt="Banner preview"
                className={styles.bannerImage}
              />
            </div>
          )}
          {BannerColorOptions.map((colorOption) => (
            <div
              key={colorOption}
              className={`${styles.colorOption} ${
                banner.type === 'color' && banner.value === colorOption
                  ? styles.selected
                  : ''
              }`}
              onClick={() => setBanner({ type: 'color', value: colorOption })}
              title={colorOption}
            >
              <div
                className={styles.colorPreview}
                style={{ backgroundColor: colorOption }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tags Selection */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Tags
        </label>
        {tags.length === 0 ? (
          <p className={styles.noTagsMessage}>No tags available. Create tags first.</p>
        ) : (
          <div className={styles.tagsGrid}>
            {tags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  className={`${styles.tagButton} ${isSelected ? styles.tagSelected : ''}`}
                  onClick={() => {
                    setSelectedTagIds((prev) =>
                      isSelected
                        ? prev.filter((id) => id !== tag.id)
                        : [...prev, tag.id]
                    );
                  }}
                  disabled={isSubmitting}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="A brief description of the website..."
          className={styles.textarea}
          disabled={isSubmitting}
          rows={3}
        />
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Website"}
        </button>
      </div>
    </form>
  );
}
