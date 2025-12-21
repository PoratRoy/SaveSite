import styles from "./main.module.css";

export default function Main() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>SaveSite - Main Dashboard</h1>
        <p className={styles.description}>Welcome to your saved websites dashboard!</p>
      </div>
    </main>
  );
}
