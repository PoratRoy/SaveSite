"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./SideNav.module.css";
import FolderTree from "../FolderTree/FolderTree";
import { useSidebar } from "@/context/SidebarContext";
import { COLLAPSED_WIDTH } from "@/context/SidebarContext";

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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
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
