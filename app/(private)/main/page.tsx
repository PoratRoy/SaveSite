import styles from "./main.module.css";
import SideNav from "@/components/folderStructure/SideNav/SideNav";

export default function Main() {
  return (
    <div className={styles.layout}>
      {/* Fixed Header */}
      <header className={styles.header}>
        <h1 className={styles.projectName}>SaveSite</h1>
      </header>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Side Navigation */}
        <SideNav />

        {/* Dashboard Content */}
        <main className={styles.dashboard}>
          <div className={styles.dashboardContent}>
            <h2 className={styles.dashboardTitle}>My Websites</h2>
            <p className={styles.placeholder}>Website links grid will be built here</p>
          </div>
        </main>
      </div>
    </div>
  );
}
