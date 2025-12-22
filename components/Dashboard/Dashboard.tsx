import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <main className={styles.dashboard}>
      <div className={styles.dashboardContent}>
        <h2 className={styles.dashboardTitle}>My Websites</h2>
        <p className={styles.placeholder}>Website links grid will be built here</p>
      </div>
    </main>
  );
}
