"use client";

import { signOut } from "next-auth/react";
import styles from "./Header.module.css";
import SearchSelect from "@/components/ui/SearchSelect/SearchSelect";

export default function Header() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/sign-in" });
  };

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

      <button onClick={handleLogout} className={styles.logoutButton} title="Logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </header>
  );
}
