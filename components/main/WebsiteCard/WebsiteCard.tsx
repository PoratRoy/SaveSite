import styles from "./WebsiteCard.module.css";
import { Website } from "@/models/types/website";
import { LinkIcon } from "@/styles/Icons";

interface WebsiteCardProps {
  website: Website;
}

export default function WebsiteCard({ website }: WebsiteCardProps) {
  const coverStyle = website.image
    ? { backgroundImage: `url(${website.image})` }
    : { backgroundColor: website.color || "#3b82f6" };

  const isIconUrl = website.icon && website.icon.startsWith('http');

  return (
    <div className={styles.card}>
      {/* Cover Image or Color */}
      <div className={styles.cover} style={coverStyle}></div>

      {/* Favicon Icon */}
      <div className={styles.iconContainer}>
        {website.icon ? (
          isIconUrl ? (
            <img 
              src={website.icon} 
              alt={website.title} 
              className={styles.icon}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="' + styles.iconEmoji + '">🌐</div>';
                }
              }}
            />
          ) : (
            <div className={styles.iconEmoji}>{website.icon}</div>
          )
        ) : (
          <div className={styles.iconPlaceholder}>
            <LinkIcon size={20} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{website.title}</h3>
        <a
          href={website.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkButton}
        >
          Visit Website
        </a>
      </div>
    </div>
  );
}
