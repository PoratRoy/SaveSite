"use client";

import styles from "./SearchResults.module.css";
import { SearchResult } from "@/context";

interface SearchResultsProps {
  searchQuery: string;
  searchResults: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  onClose: () => void;
}

export default function SearchResults({
  searchQuery,
  searchResults,
  onResultClick,
  onClose,
}: SearchResultsProps) {
  return (
    <div className={styles.searchOverlay}>
      <div className={styles.searchModal}>
        <div className={styles.searchHeader}>
          <h2 className={styles.searchTitle}>
            Search Results for "{searchQuery}"
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>
        
        {searchResults.length === 0 ? (
          <p className={styles.placeholder}>No results found</p>
        ) : (
          <div className={styles.searchResults}>
            {searchResults.map((result, index) => (
              <div
                key={`${result.type}-${result.item.id}-${index}`}
                className={styles.searchResultItem}
                onClick={() => onResultClick(result)}
              >
                <div className={styles.resultHeader}>
                  <span className={styles.resultType}>
                    {result.type === "folder" ? "📁 Folder" : "🔗 Website"}
                  </span>
                  <span className={styles.resultTitle}>
                    {result.type === "folder" 
                      ? (result.item as any).name 
                      : (result.item as any).title}
                  </span>
                </div>
                <span className={styles.resultPath}>{result.path}</span>
                {result.type === "website" && (result.item as any).link && (
                  <span className={styles.resultUrl}>{(result.item as any).link}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
