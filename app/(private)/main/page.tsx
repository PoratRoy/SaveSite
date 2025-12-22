"use client";

import styles from "./main.module.css";
import SideNav from "@/components/folderStructure/SideNav/SideNav";
import Dashboard from "@/components/Dashboard/Dashboard";
import { DataProvider } from "@/context/DataContext";

export default function Main() {
  return (
    <DataProvider>
      <div className={styles.layout}>
        <header className={styles.header}>
          <h1 className={styles.projectName}>SaveSite</h1>
        </header>
        <div className={styles.mainContent}>
          <SideNav />
          <Dashboard />
        </div>
      </div>
    </DataProvider>
  );
}
