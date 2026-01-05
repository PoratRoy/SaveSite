"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * Query parameter keys in order of priority
 */
const PARAM_KEYS = {
  FOLDER: "folder",
  WEBSITE: "website",
  TAGS: "tags",
  SEARCH: "search",
  VIEW: "view",
} as const;

/**
 * Type for query parameters
 */
export interface QueryParams {
  folder?: string;
  website?: string;
  tags?: string[];
  search?: string;
  view?: "grid" | "list";
}

/**
 * Encodes tags array to comma-separated string
 */
function encodeTags(tags: string[]): string {
  return tags.join(",");
}

/**
 * Decodes comma-separated string to tags array
 */
function decodeTags(tagsString: string): string[] {
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/**
 * Builds a clean URL search string from query params
 * Maintains order: folder, website, tags, search, view
 */
function buildSearchString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  // Add params in order
  if (params.folder) {
    searchParams.set(PARAM_KEYS.FOLDER, params.folder);
  }
  if (params.website) {
    searchParams.set(PARAM_KEYS.WEBSITE, params.website);
  }
  if (params.tags && params.tags.length > 0) {
    searchParams.set(PARAM_KEYS.TAGS, encodeTags(params.tags));
  }
  if (params.search) {
    searchParams.set(PARAM_KEYS.SEARCH, params.search);
  }
  if (params.view) {
    searchParams.set(PARAM_KEYS.VIEW, params.view);
  }

  const searchString = searchParams.toString();
  return searchString ? `?${searchString}` : "";
}

/**
 * Parses URLSearchParams into QueryParams object
 */
function parseSearchParams(searchParams: URLSearchParams): QueryParams {
  const params: QueryParams = {};

  const folder = searchParams.get(PARAM_KEYS.FOLDER);
  if (folder) params.folder = folder;

  const website = searchParams.get(PARAM_KEYS.WEBSITE);
  if (website) params.website = website;

  const tags = searchParams.get(PARAM_KEYS.TAGS);
  if (tags) params.tags = decodeTags(tags);

  const search = searchParams.get(PARAM_KEYS.SEARCH);
  if (search) params.search = search;

  const view = searchParams.get(PARAM_KEYS.VIEW);
  if (view === "grid" || view === "list") params.view = view;

  return params;
}

/**
 * Hook to manage query parameters in Next.js App Router
 * 
 * @example
 * const { queryParams, updateQueryParams, clearQueryParams } = useQueryParams();
 * 
 * // Update single param
 * updateQueryParams({ folder: "my-folder" });
 * 
 * // Update multiple params
 * updateQueryParams({ folder: "my-folder", tags: ["tag1", "tag2"] });
 * 
 * // Remove a param by setting it to undefined
 * updateQueryParams({ website: undefined });
 * 
 * // Clear all params
 * clearQueryParams();
 */
export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current query params
  const queryParams = parseSearchParams(searchParams);

  /**
   * Updates query parameters in the URL
   * Merges with existing params and removes undefined values
   */
  const updateQueryParams = useCallback(
    (updates: Partial<QueryParams>, options?: { replace?: boolean }) => {
      const currentParams = parseSearchParams(searchParams);

      // Merge updates with current params
      const newParams: QueryParams = { ...currentParams };

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          // Remove param if value is undefined/null
          delete newParams[key as keyof QueryParams];
        } else {
          // Update param
          newParams[key as keyof QueryParams] = value as any;
        }
      });

      // Build new URL
      const searchString = buildSearchString(newParams);
      const newUrl = `${pathname}${searchString}`;

      // Navigate
      if (options?.replace) {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }
    },
    [pathname, router, searchParams]
  );

  /**
   * Clears all query parameters
   */
  const clearQueryParams = useCallback(
    (options?: { replace?: boolean }) => {
      if (options?.replace) {
        router.replace(pathname, { scroll: false });
      } else {
        router.push(pathname, { scroll: false });
      }
    },
    [pathname, router]
  );

  /**
   * Sets query parameters (replaces all existing params)
   */
  const setQueryParams = useCallback(
    (params: QueryParams, options?: { replace?: boolean }) => {
      const searchString = buildSearchString(params);
      const newUrl = `${pathname}${searchString}`;

      if (options?.replace) {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }
    },
    [pathname, router]
  );

  return {
    queryParams,
    updateQueryParams,
    setQueryParams,
    clearQueryParams,
  };
}

/**
 * Hook to sync query params with application state
 * This should be used at the top level of your app to keep URL in sync with contexts
 * 
 * @example
 * useQueryParamsSync({
 *   onFolderChange: (folder) => selectFolder(folder),
 *   onWebsiteChange: (website) => selectWebsite(website),
 *   onTagsChange: (tags) => setSelectedTags(tags),
 *   onSearchChange: (search) => setSearchQuery(search),
 *   onViewChange: (view) => setViewMode(view),
 * });
 */
export function useQueryParamsSync(handlers: {
  onFolderChange?: (folder: string | undefined) => void;
  onWebsiteChange?: (website: string | undefined) => void;
  onTagsChange?: (tags: string[]) => void;
  onSearchChange?: (search: string | undefined) => void;
  onViewChange?: (view: "grid" | "list") => void;
}) {
  const { queryParams } = useQueryParams();

  useEffect(() => {
    if (handlers.onFolderChange) {
      handlers.onFolderChange(queryParams.folder);
    }
  }, [queryParams.folder, handlers.onFolderChange]);

  useEffect(() => {
    if (handlers.onWebsiteChange) {
      handlers.onWebsiteChange(queryParams.website);
    }
  }, [queryParams.website, handlers.onWebsiteChange]);

  useEffect(() => {
    if (handlers.onTagsChange) {
      handlers.onTagsChange(queryParams.tags || []);
    }
  }, [queryParams.tags, handlers.onTagsChange]);

  useEffect(() => {
    if (handlers.onSearchChange) {
      handlers.onSearchChange(queryParams.search);
    }
  }, [queryParams.search, handlers.onSearchChange]);

  useEffect(() => {
    if (handlers.onViewChange && queryParams.view) {
      handlers.onViewChange(queryParams.view);
    }
  }, [queryParams.view, handlers.onViewChange]);
}
