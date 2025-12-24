"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import styles from "./ProfileMenu.module.css";

export default function ProfileMenu() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    setShowDropdown(false);
    signOut({ callbackUrl: "/sign-in" });
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={styles.profileMenu} ref={dropdownRef}>
      <button
        className={styles.profileButton}
        onClick={toggleDropdown}
        title={session?.user?.name || "Profile"}
      >
        {session?.user?.image ? (
          <img src={session.user.image} alt={session.user.name || "User"} />
        ) : (
          <div className={styles.profilePlaceholder}>
            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </button>

      {showDropdown && (
        <div className={styles.dropdown}>
          <button className={styles.dropdownItem} onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
