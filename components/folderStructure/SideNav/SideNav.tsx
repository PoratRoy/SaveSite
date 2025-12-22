import styles from "./SideNav.module.css";
import FolderTree from "../FolderTree/FolderTree";

export default function SideNav() {
  return (
    <aside className={styles.sidenav}>
      <div className={styles.sidenavContent}>
        <h2 className={styles.sidenavTitle}>Explorer</h2>
        <FolderTree />
      </div>
    </aside>
  );
}
