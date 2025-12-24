"use client";

import { useState } from "react";
import styles from "./EditWebsiteForm.module.css";
import { Website } from "@/models/types/website";
import { BannerObj } from "@/models/types/thumbnail";
import { defaultBannerColor, BannerColorOptions } from "@/styles/colors";
import { useData } from "@/context/DataContext";
import IconSelector from "@/components/ui/IconSelector/IconSelector";
import TagsSelector from "@/components/ui/TagsSelector/TagsSelector";
import { Tag } from "@/models/types/tag";

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
  const { tags, addTag: addTagBase } = useData();
  // Get first folder ID from website's folders for tag refresh context
  const currentFolderId = website.folders?.[0]?.id;
  const [formData, setFormData] = useState({
    title: website.title,
    link: website.link,
    description: website.description || "",
    icon: website.icon || "",
  });
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    website.tags?.map((tag: Tag) => tag.id) || []
  );

  // Wrapper to create folder-specific tags and auto-select them
  const addTag = async (tagName: string) => {
    // Create as folder-specific tag
    const newTag = await addTagBase(tagName, { userId: null, folderId: currentFolderId }, currentFolderId);
    
    // Auto-select the newly created tag
    setSelectedTagIds(prev => [...prev, newTag.id]);
  };
  const [banner, setBanner] = useState<BannerObj>({
    type: website.image ? 'banner' : 'color',
    value: website.image || website.color || defaultBannerColor,
  });
  const [hasBannerUrl] = useState<string | undefined>(website.image || undefined);
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
      
      // When switching between banner and color, explicitly set the other to empty string
      // Empty string will be treated as null/undefined in the backend
      const submitData: {
        title: string;
        link: string;
        description?: string;
        image?: string;
        icon?: string;
        color?: string;
        tagIds?: string[];
      } = {
        title: formData.title.trim(),
        link: formData.link.trim(),
        description: formData.description.trim() || undefined,
        icon: formData.icon.trim() || undefined,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      };

      // Always set both image and color to ensure one is cleared when the other is selected
      if (banner.type === 'banner') {
        submitData.image = banner.value;
        submitData.color = ''; // Clear color
      } else {
        submitData.color = banner.value;
        submitData.image = ''; // Clear image
      }
      
      await onSubmit(submitData);
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

      {/* Icon Selector */}
      <IconSelector
        value={formData.icon}
        onChange={(icon) => setFormData((prev) => ({ ...prev, icon }))}
        faviconUrl={isIconUrl ? website.icon : undefined}
      />

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
          {BannerColorOptions.map((colorOption: string) => (
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
      <TagsSelector
        tags={tags}
        selectedTagIds={selectedTagIds}
        onChange={setSelectedTagIds}
        onCreateTag={addTag}
        disabled={isSubmitting}
      />

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
          <span className={styles.hint}> (Markdown supported)</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="A brief description of the website...&#10;&#10;Supports **bold**, *italic*, [links](url), and line breaks"
          className={styles.textarea}
          disabled={isSubmitting}
          rows={5}
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
