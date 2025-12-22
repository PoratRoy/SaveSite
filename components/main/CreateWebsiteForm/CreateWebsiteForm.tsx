"use client";

import { useState } from "react";
import styles from "./CreateWebsiteForm.module.css";

interface CreateWebsiteFormProps {
  folderId: string;
  onSubmit: (data: {
    title: string;
    link: string;
    description?: string;
    image?: string;
    icon?: string;
    color?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function CreateWebsiteForm({
  folderId,
  onSubmit,
  onCancel,
}: CreateWebsiteFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    description: "",
    image: "",
    icon: "",
    color: "#3b82f6",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      await onSubmit({
        title: formData.title.trim(),
        link: formData.link.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image.trim() || undefined,
        icon: formData.icon.trim() || undefined,
        color: formData.color || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create website");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

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

      <div className={styles.formGroup}>
        <label htmlFor="link" className={styles.label}>
          URL <span className={styles.required}>*</span>
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

      <div className={styles.formGroup}>
        <label htmlFor="image" className={styles.label}>
          Cover Image URL
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className={styles.input}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="icon" className={styles.label}>
          Icon/Favicon URL
        </label>
        <input
          type="url"
          id="icon"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          placeholder="https://example.com/favicon.ico"
          className={styles.input}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="color" className={styles.label}>
          Brand Color
        </label>
        <div className={styles.colorInputGroup}>
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className={styles.colorInput}
            disabled={isSubmitting}
          />
          <input
            type="text"
            value={formData.color}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, color: e.target.value }))
            }
            placeholder="#3b82f6"
            className={styles.colorTextInput}
            disabled={isSubmitting}
          />
        </div>
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
