"use client";

import styles from "./main.module.css";
import SideNav from "@/components/folderStructure/SideNav/SideNav";
import Dashboard from "@/components/Dashboard/Dashboard";
import { DataProvider, SelectionProvider, useSelection } from "@/context";

function MainContent() {
  const { updateSelection } = useSelection();

  return (
    <DataProvider onDataChange={updateSelection}>
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

export default function Main() {
  return (
    <SelectionProvider>
      <MainContent />
    </SelectionProvider>
  );
}
