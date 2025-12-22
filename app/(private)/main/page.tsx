"use client";

import styles from "./main.module.css";
import Header from "@/components/Header/Header";
import SideNav from "@/components/folderStructure/SideNav/SideNav";
import Dashboard from "@/components/main/Dashboard/Dashboard";
import SlidePanel from "@/components/ui/SlidePanel/SlidePanel";
import { DataProvider, SelectionProvider, SearchProvider, useSelection } from "@/context";
import { SlidePanelProvider, useSlidePanel } from "@/context/SlidePanelContext";

function MainContent() {
  const { updateSelection } = useSelection();
  const { isOpen, title, content, closePanel } = useSlidePanel();

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
        
        <SlidePanel isOpen={isOpen} onClose={closePanel} title={title}>
          {content}
        </SlidePanel>
      </SearchProvider>
    </DataProvider>
  );
}

export default function Main() {
  return (
    <SelectionProvider>
      <SlidePanelProvider>
        <MainContent />
      </SlidePanelProvider>
    </SelectionProvider>
  );
}
