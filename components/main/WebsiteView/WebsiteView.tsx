import styles from "./WebsiteView.module.css";
import { Website } from "@/models/types/website";

interface WebsiteViewProps {
  website: Website;
}

export default function WebsiteView({ website }: WebsiteViewProps) {
  return (
    <>
      <h2 className={styles.title}>{website.title}</h2>
      
      <div className={styles.section}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>URL:</span>
          <a 
            href={website.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.detailLink}
          >
            {website.link}
          </a>
        </div>

        {website.description && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Description:</span>
            <span className={styles.detailValue}>{website.description}</span>
          </div>
        )}

        {website.image && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Image:</span>
            <img 
              src={website.image} 
              alt={website.title}
              className={styles.websiteImage}
            />
          </div>
        )}

        {website.icon && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Icon:</span>
            <img 
              src={website.icon} 
              alt="icon"
              className={styles.websiteIcon}
            />
          </div>
        )}

        {website.color && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Color:</span>
            <div 
              className={styles.colorSwatch}
              style={{ backgroundColor: website.color }}
            ></div>
          </div>
        )}
      </div>
    </>
  );
}
