"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import styles from "./ProfileMenu.module.css";
import Icon from "@/styles/Icons";

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
            <Icon type="logout" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
