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

export type IconType = keyof typeof iconMap | "arrowRight" | "options";

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
