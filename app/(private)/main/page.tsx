"use client";

import styles from "./main.module.css";
import SideNav from "@/components/folderTree/SideNav/SideNav";
import SlidePanel from "@/components/ui/SlidePanel/SlidePanel";
import ConfirmDialog from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { useSlidePanel } from "@/context/SlidePanelContext";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import HeaderLayout from "@/components/header/HeaderLayout/HeaderLayout";
import WorkspaceLayout from "@/components/workspace/WorkspaceLayout/WorkspaceLayout";

export default function Main() {
  const { isOpen, title, content, closePanel } = useSlidePanel();
  const { isOpen: dialogOpen, options, confirm, cancel } = useConfirmDialog();

  return (
    <>
      <section className={styles.layout}>
        <HeaderLayout />
        <div className={styles.mainContent}>
          <SideNav />
          <WorkspaceLayout />
        </div>
      </section>

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
    </>
  );
}
