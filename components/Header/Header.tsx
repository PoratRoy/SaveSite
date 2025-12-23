"use client";

import styles from "./Header.module.css";
import SearchSelect from "@/components/ui/SearchSelect/SearchSelect";
import ProfileMenu from "@/components/ui/ProfileMenu/ProfileMenu";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <h1 className={styles.projectName}>SaveSite</h1>
      </div>
      
      <div className={styles.searchContainer}>
        <SearchSelect />
      </div>

      <ProfileMenu />
    </header>
  );
}
