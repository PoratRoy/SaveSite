"use client";

import styles from "./Header.module.css";
import SearchSelect from "@/components/ui/SearchSelect/SearchSelect";

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.projectName}>SaveSite</h1>
      
      <div className={styles.searchContainer}>
        <SearchSelect />
      </div>
    </header>
  );
}
