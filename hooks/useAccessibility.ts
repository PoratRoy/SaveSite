import { useEffect, RefObject } from "react";

interface UseClickOutsideOptions {
  ref: RefObject<HTMLElement | null>;
  onClickOutside: () => void;
  enabled?: boolean;
}

/**
 * Hook for accessibility features like click outside detection
 */
export function useAccessibility() {
  /**
   * Detects clicks outside a referenced element and triggers a callback
   * @param ref - React ref to the element to monitor
   * @param onClickOutside - Callback function to execute when clicking outside
   * @param enabled - Whether the click outside detection is active (default: true)
   */
  const useClickOutside = ({ ref, onClickOutside, enabled = true }: UseClickOutsideOptions) => {
    useEffect(() => {
      if (!enabled) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          onClickOutside();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, onClickOutside, enabled]);
  };

  return {
    useClickOutside,
  };
}
