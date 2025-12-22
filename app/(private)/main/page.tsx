"use client";

import styles from "./main.module.css";
import Header from "@/components/Header/Header";
import SideNav from "@/components/folderStructure/SideNav/SideNav";
import Dashboard from "@/components/Dashboard/Dashboard";
import { DataProvider, SelectionProvider, SearchProvider, useSelection } from "@/context";

function MainContent() {
  const { updateSelection } = useSelection();

  return (
    <DataProvider onDataChange={updateSelection}>
      <SearchProvider>
        <div className={styles.layout}>
          <Header />
          <div className={styles.mainContent}>
            <SideNav />
            <Dashboard />
          </div>
        </div>
      </SearchProvider>
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
