"use client";

import styles from "./main.module.css";
import Header from "@/components/Header/Header";
import SideNav from "@/components/folderStructure/SideNav/SideNav";
import ContentArea from "@/components/workspace/ContentArea/ContentArea";
import SlidePanel from "@/components/ui/SlidePanel/SlidePanel";
import { useSlidePanel } from "@/context/SlidePanelContext";

export default function Main() {
  const { isOpen, title, content, closePanel } = useSlidePanel();
  return (
    <>
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
    </>
  );
}
