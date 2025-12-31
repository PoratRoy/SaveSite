"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./SideNav.module.css";
import FolderTree from "../FolderTree/FolderTree";
import { useSidebar } from "@/context/SidebarContext";
import { COLLAPSED_WIDTH } from "@/context/SidebarContext";
import Icon from "@/styles/Icons";

export default function SideNav() {
  const { isOpen, width, toggleSidebar, setWidth } = useSidebar();
  const sidebarRef = useRef<HTMLElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setWidth]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  // Collapsed state - show only arrow icon
  if (!isOpen) {
    return (
      <aside 
        className={`${styles.sidenav} ${styles.collapsed}`}
        style={{ width: `${COLLAPSED_WIDTH}px` }}
      >
        <button 
          className={styles.expandButton}
          onClick={toggleSidebar}
          title="Expand sidebar"
        >
          <Icon type="arrowRight" size={20} />
        </button>
      </aside>
    );
  }

  return (
    <aside 
      ref={sidebarRef}
      className={styles.sidenav} 
      style={{ width: `${width}px` }}
    >
      <div className={styles.sidenavContent}>
        <div className={styles.sidenavHeader}>
          <h2 className={styles.sidenavTitle}>EXPLORER</h2>
          <button 
            className={styles.collapseButton}
            onClick={toggleSidebar}
            title="Collapse sidebar"
          >
            <Icon type="arrowLeft" size={20} />
          </button>
        </div>
        <FolderTree />
      </div>
      
      <div 
        className={styles.resizeHandle}
        onMouseDown={handleMouseDown}
      />
    </aside>
  );
}
