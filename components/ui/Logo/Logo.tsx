import Icon from "@/styles/Icons";
import styles from "./Logo.module.css";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  small: 20,
  medium: 24,
  large: 32,
};

export default function Logo({ size = "medium", showText = true, className }: LogoProps) {
  const iconSize = sizeMap[size];

  return (
    <div className={`${styles.logo} ${styles[size]} ${className || ""}`}>
      <Icon type="saveLogo" size={iconSize} color="#2663EB" />
      {showText && <span className={styles.logoText}>SaveSite</span>}
    </div>
  );
}
