"use client";

import styles from "./Header.module.css";
import SearchSelect from "@/components/topBar/SearchSelect/SearchSelect";
import ProfileMenu from "@/components/topBar/ProfileMenu/ProfileMenu";
import Icon from "@/styles/Icons";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Icon type="saveLogo" />
        <h1 className={styles.projectName}>SaveSite</h1>
      </div>
      
      <div className={styles.searchContainer}>
        <SearchSelect />
      </div>

      <ProfileMenu />
    </header>
  );
}
