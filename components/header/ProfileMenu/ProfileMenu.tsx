"use client";

import { useState, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import styles from "./ProfileMenu.module.css";
import Icon from "@/styles/Icons";
import { useAccessibility } from "@/hooks/useAccessibility";

export default function ProfileMenu() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { useClickOutside } = useAccessibility();

  // Close dropdown when clicking outside
  useClickOutside({
    ref: dropdownRef,
    onClickOutside: () => setShowDropdown(false),
    enabled: showDropdown,
  });

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
