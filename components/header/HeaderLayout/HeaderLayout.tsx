"use client";

import styles from "./HeaderLayout.module.css";
import SearchSelect from "@/components/header/SearchSelect/SearchSelect";
import ProfileMenu from "@/components/header/ProfileMenu/ProfileMenu";
import Logo from "@/components/ui/Logo/Logo";

export default function HeaderLayout() {
  return (
    <header className={styles.header}>
      <div className={styles.leftSide}>
        <Logo size="medium" className={styles.logo} />
        <SearchSelect />
      </div>

      <ProfileMenu />
    </header>
  );
}
