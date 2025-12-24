"use client";

import { useState, ChangeEvent } from "react";
import styles from "./CreateWebsiteForm.module.css";
import { LinkPreviewResponse, BannerObj } from "@/models/types/thumbnail";
import { getFaviconUrl } from "@/utils/images";
import { defaultBannerColor, BannerColorOptions } from "@/styles/colors";
import { useData } from "@/context/DataContext";
import IconSelector from "@/components/ui/IconSelector/IconSelector";
import TagsSelector from "@/components/ui/TagsSelector/TagsSelector";

interface CreateWebsiteFormProps {
  folderId: string;
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

export default function CreateWebsiteForm({
  folderId,
  onSubmit,
  onCancel,
}: CreateWebsiteFormProps) {
  const { tags, addTag: addTagBase, checkDuplicateUrl } = useData();
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    description: "",
    icon: "",
  });
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Wrapper to create folder-specific tags and auto-select them
  const addTag = async (tagName: string) => {
    // Create as folder-specific tag
    const newTag = await addTagBase(tagName, { userId: null, folderId }, folderId);
    
    // Auto-select the newly created tag
    setSelectedTagIds(prev => [...prev, newTag.id]);
  };
  const [banner, setBanner] = useState<BannerObj>({
    type: 'color',
    value: defaultBannerColor,
  });
  const [hasBannerUrl, setHasBannerUrl] = useState<string | undefined>();
  const [faviconUrl, setFaviconUrl] = useState<string | undefined>();
  const [isFetchingThumbnail, setIsFetchingThumbnail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const handleThumbnail = async (url: string): Promise<LinkPreviewResponse> => {
    setIsFetchingThumbnail(true);
    const response = await fetch('/api/thumbnail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch link preview');
    }
    const data = (await response.json()) as LinkPreviewResponse;
    setIsFetchingThumbnail(false);
    return data;
  };

  const isValidURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setFormData((prev) => ({ ...prev, link: url }));
    
    try {
      if (isValidURL(url)) {
        setError(null);
        
        // Check for duplicate URL
        const { isDuplicate, existingWebsite } = checkDuplicateUrl(url);
        if (isDuplicate && existingWebsite) {
          setDuplicateWarning(
            `This URL already exists: "${existingWebsite.title}". You can still create it, but it may be a duplicate.`
          );
        } else {
          setDuplicateWarning(null);
        }
        const data = await handleThumbnail(url);
        const favicon = getFaviconUrl(url, 32);
        setFaviconUrl(favicon);
        setFormData((prev) => ({
          ...prev,
          title: data.title,
          description: data.description,
          icon: favicon,
        }));
        
        const isThumbnailValid = data.image && isValidURL(data.image);
        setHasBannerUrl(isThumbnailValid ? data.image : undefined);
        setBanner(
          isThumbnailValid
            ? { type: 'banner', value: data.image }
            : { type: 'color', value: defaultBannerColor }
        );
      }
    } catch {
      setError('Failed to fetch link preview');
      setIsFetchingThumbnail(false);
    }
  };

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
      setError(err instanceof Error ? err.message : "Failed to create website");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}
      {duplicateWarning && <div className={styles.warning}>{duplicateWarning}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="link" className={styles.label}>
          Website URL <span className={styles.required}>*</span>
        </label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleUrlChange}
          placeholder="https://example.com"
          className={styles.input}
          disabled={isSubmitting || isFetchingThumbnail}
          required
        />
        {isFetchingThumbnail && (
          <span className={styles.loadingText}>Fetching website data...</span>
        )}
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
          disabled={isSubmitting || isFetchingThumbnail}
          required
        />
      </div>

      {formData.link && isValidURL(formData.link) && !isFetchingThumbnail && (
        <>
          {/* Icon Selector */}
          <IconSelector
            value={formData.icon}
            onChange={(icon) => setFormData((prev) => ({ ...prev, icon }))}
            faviconUrl={faviconUrl}
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
        </>
      )}

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
          {isSubmitting ? "Creating..." : "Create Website"}
        </button>
      </div>
    </form>
  );
}
