"use client";

import styles from "./main.module.css";
import Header from "@/components/Header/Header";
import SideNav from "@/components/folderStructure/SideNav/SideNav";
import ContentArea from "@/components/workspace/ContentArea/ContentArea";
import SlidePanel from "@/components/ui/SlidePanel/SlidePanel";
import { useSlidePanel } from "@/context/SlidePanelContext";
import { DataProvider, FilterProvider, SearchProvider, useSelection } from "@/context";

export default function Main() {
    const { updateSelection } = useSelection();
  const { isOpen, title, content, closePanel } = useSlidePanel();
  return (
    <DataProvider onDataChange={updateSelection}>
      <SearchProvider>
        <FilterProvider>
          <div className={styles.layout}>
            <Header />
            <div className={styles.mainContent}>
              <SideNav />
              <ContentArea />
            </div>
          </div>

          <SlidePanel isOpen={isOpen} onClose={closePanel} title={title}>
            {content}
          </SlidePanel>
        </FilterProvider>
      </SearchProvider>
    </DataProvider>
  );
}
