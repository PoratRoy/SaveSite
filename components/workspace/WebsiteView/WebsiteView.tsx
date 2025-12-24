import Icon from "@/styles/Icons";
import styles from "./WebsiteView.module.css";
import { Website } from "@/models/types/website";
import { Tag } from "@/models/types/tag";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface WebsiteViewProps {
  website: Website;
}

export default function WebsiteView({ website }: WebsiteViewProps) {
  const isIconUrl = website.icon && website.icon.startsWith("http");

  return (
    <div className={styles.websiteView}>
      {/* Hero Section */}
      <div className={styles.hero}>
        {website.image && (
          <div
            className={styles.heroBackground}
            style={{ backgroundImage: `url(${website.image})` }}
          />
        )}
        <div
          className={styles.heroOverlay}
          style={{
            backgroundColor: website.color
              ? `${website.color}cc`
              : "rgba(243, 244, 246, 0.7)",
          }}
        />
        <div className={styles.heroContent}>
          <div className={styles.iconContainer}>
            {website.icon ? (
              isIconUrl ? (
                <img
                  src={website.icon}
                  alt="icon"
                  className={styles.iconImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span className={styles.iconEmoji}>{website.icon}</span>
              )
            ) : (
              <Icon type="siteTree" className={styles.iconFallback} />
            )}
          </div>
          <h1 className={styles.title}>{website.title}</h1>
          <a
            href={website.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.heroLink}
          >
            {new URL(website.link).hostname} ↗
          </a>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Description Card */}
        {website.description && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Description</h3>
            <div className={styles.description}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {website.description}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className={styles.detailsGrid}>
          {/* URL Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Website URL</h3>
            <a
              href={website.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.urlLink}
            >
              {website.link}
            </a>
          </div>

          {/* Tags Card */}
          {website.tags && website.tags.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Tags</h3>
              <div className={styles.tagsContainer}>
                {website.tags.map((tag: Tag) => (
                  <span key={tag.id} className={styles.tag}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
