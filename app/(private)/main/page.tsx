"use client";

import styles from "./main.module.css";
import Header from "@/components/Header/Header";
import SideNav from "@/components/folderStructure/SideNav/SideNav";
import ContentArea from "@/components/workspace/ContentArea/ContentArea";
import SlidePanel from "@/components/ui/SlidePanel/SlidePanel";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { useSlidePanel } from "@/context/SlidePanelContext";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import { DataProvider, FilterProvider, SearchProvider, useSelection } from "@/context";

export default function Main() {
  const { updateSelection } = useSelection();
  const { isOpen, title, content, closePanel } = useSlidePanel();
  const { isOpen: dialogOpen, options, confirm, cancel } = useConfirmDialog();
  
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

          <ConfirmDialog
            isOpen={dialogOpen}
            title={options?.title || ""}
            message={options?.message || ""}
            confirmText={options?.confirmText}
            cancelText={options?.cancelText}
            variant={options?.variant}
            onConfirm={confirm}
            onCancel={cancel}
          />
        </FilterProvider>
      </SearchProvider>
    </DataProvider>
  );
}
