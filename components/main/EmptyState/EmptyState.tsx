import styles from "./EmptyState.module.css";

export default function EmptyState() {
  return (
    <>
      <h2 className={styles.title}>My Websites</h2>
      <p className={styles.placeholder}>
        Select a folder or website from the sidebar to view details
      </p>
    </>
  );
}
