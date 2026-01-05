import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  Bookmark1Solid,
  StarFatSolid,
  StarFatOutlined,
  Folder1Solid,
  Folder1Outlined,
  Globe1Bulk,
  ExitOutlined,
  Search1Outlined,
  ChevronLeftOutlined,
  ChevronDownOutlined,
  ChevronUpOutlined,
  PlusOutlined,
  Bookmark1Outlined,
  Pencil1Outlined,
  Trash3Outlined,
  XmarkOutlined,
  CheckOutlined,
  MenuMeatballs1Solid,
  MenuHamburger1Bulk,
  EyeOutlined,
} from "@lineiconshq/free-icons";

const iconMap = {
  saveLogo: Bookmark1Solid,
  starRow: StarFatSolid,
  star: StarFatOutlined,
  folderTree: Folder1Solid,
  folder: Folder1Outlined,
  siteTree: Globe1Bulk,
  logout: ExitOutlined,
  search: Search1Outlined,
  arrowUp: ChevronUpOutlined,
  arrowDown: ChevronDownOutlined,
  arrowLeft: ChevronLeftOutlined,
  add: PlusOutlined,
  tag: Bookmark1Outlined,
  edit: Pencil1Outlined,
  delete: Trash3Outlined,
  close: XmarkOutlined,
  ok: CheckOutlined,
  menu: MenuMeatballs1Solid,
  dnd: MenuHamburger1Bulk,
  link: EyeOutlined,
};

export type IconType = keyof typeof iconMap | "arrowRight" | "options" | "grid" | "list" | "move";

interface IconProps {
  type: IconType;
  color?: string;
  size?: number | string;
  className?: string;
}

export const Icon = ({ type, color, size, className }: IconProps) => {
  let iconData = iconMap[type as keyof typeof iconMap];
  let transform = undefined;

  if (type === "arrowRight" && !iconData) {
    iconData = iconMap.arrowLeft;
    transform = "rotate(180deg)";
  }
  if (type === "options" && !iconData) {
    iconData = iconMap.menu;
    transform = "rotate(90deg)";
  }
  
  // Custom SVG icons for grid and list
  if (type === "grid") {
    return (
      <span className={className} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      </span>
    );
  }
  
  if (type === "list") {
    return (
      <span className={className} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      </span>
    );
  }

  if (type === "move") {
    return (
      <span className={className} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="5 9 2 12 5 15"/>
          <polyline points="9 5 12 2 15 5"/>
          <polyline points="15 19 12 22 9 19"/>
          <polyline points="19 9 22 12 19 15"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
        </svg>
      </span>
    );
  }

  if (!iconData) {
    console.warn(`Icon type "${type}" not found`);
    return null;
  }

  const styles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transform: transform,
  };

  return (
    <span className={className} style={styles}>
      <Lineicons
        icon={iconData}
        size={size}
        color={color}
      />
    </span>
  );
};

export default Icon;
