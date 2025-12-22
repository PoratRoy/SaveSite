"use client";

import { useState } from "react";
import styles from "./Header.module.css";
import { useSearch, useData } from "@/context";
import { SearchIcon } from "@/styles/Icons";

export default function Header() {
  const [inputValue, setInputValue] = useState("");
  const { performSearch, setSearchQuery } = useSearch();
  const { rootFolder } = useData();

  const handleSearch = () => {
    if (inputValue.trim()) {
      setSearchQuery(inputValue);
      performSearch(inputValue, rootFolder);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.projectName}>SaveSite</h1>
      
      <div className={styles.searchContainer}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search folders and websites..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
        />
        {inputValue && (
          <button onClick={handleClear} className={styles.clearButton}>
            ✕
          </button>
        )}
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
      </div>
    </header>
  );
}
