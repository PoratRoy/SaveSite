"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import styles from "./StarredView.module.css";
import { Website } from "@/models/types/website";
import SortableWebsiteCard from "@/components/workspace/elements/WebsiteCard/SortableWebsiteCard";
import EditWebsiteForm from "@/components/forms/EditWebsiteForm/EditWebsiteForm";
import { useData, useSelection, useFilter } from "@/context";
import { useSlidePanel } from "@/context/SlidePanelContext";
import { getStarredWebsitesAction } from "@/app/actions/GET/getStarredWebsitesAction";
import { Tag } from "@/models/types/tag";

export default function StarredView() {
  const { updateWebsite, removeWebsite, updateWebsitePositions, toggleWebsiteStarred, userId } = useData();
  const { openPanel, closePanel } = useSlidePanel();
  const { selectWebsite } = useSelection();
  const { selectedTagIds, hasActiveFilters } = useFilter();
  
  const [starredWebsites, setStarredWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const previousOrderRef = useRef<Website[]>([]);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch starred websites
  useEffect(() => {
    const fetchStarredWebsites = async () => {
      try {
        setIsLoading(true);
        const websites = await getStarredWebsitesAction({ userId });
        setStarredWebsites(websites);
      } catch (error) {
        console.error("Error fetching starred websites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStarredWebsites();
  }, [userId]);

  // Filter and sort starred websites based on selected tags
  const filteredWebsites = useMemo(() => {
    let websites = starredWebsites;
    
    if (hasActiveFilters && selectedTagIds.length > 0) {
      websites = websites.filter((website: Website) => {
        if (!website.tags || website.tags.length === 0) {
          return false;
        }
        
        // Get all tag IDs from the website
        const websiteTagIds = website.tags.map((tag: Tag) => tag.id);
        
        // Check if website has at least one of the selected tags (OR logic)
        return selectedTagIds.some((selectedTagId: string) => 
          websiteTagIds.includes(selectedTagId)
        );
      });
    }
    
    // Sort by position
    return [...websites].sort((a, b) => {
      const posA = a.position ?? 0;
      const posB = b.position ?? 0;
      return posA - posB;
    });
  }, [starredWebsites, selectedTagIds, hasActiveFilters]);

  const [orderedWebsites, setOrderedWebsites] = useState<Website[]>(filteredWebsites);

  // Sync orderedWebsites with filteredWebsites
  useEffect(() => {
    setOrderedWebsites(filteredWebsites);
    previousOrderRef.current = filteredWebsites;
  }, [filteredWebsites]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleEditWebsite = (website: Website) => {
    const handleUpdate = async (websiteData: {
      title: string;
      link: string;
      description?: string;
      image?: string;
      icon?: string;
      color?: string;
      tagIds?: string[];
    }) => {
      try {
        await updateWebsite(website.id, websiteData);
        // Refresh starred websites
        const websites = await getStarredWebsitesAction({ userId });
        setStarredWebsites(websites);
        closePanel();
      } catch (error) {
        console.error("Error updating website:", error);
        alert("Failed to update website");
      }
    };

    openPanel(
      "Edit Website",
      <EditWebsiteForm website={website} onSubmit={handleUpdate} onCancel={closePanel} />
    );
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    try {
      await removeWebsite(websiteId);
      // Refresh starred websites
      const websites = await getStarredWebsitesAction({ userId });
      setStarredWebsites(websites);
    } catch (error) {
      console.error("Error deleting website:", error);
      alert("Failed to delete website");
    }
  };

  const handleViewMore = (website: Website) => {
    selectWebsite(website);
  };

  const handleToggleStarred = async (websiteId: string, starred: boolean) => {
    try {
      await toggleWebsiteStarred(websiteId, starred);
      // Refresh starred websites
      const websites = await getStarredWebsitesAction({ userId });
      setStarredWebsites(websites);
    } catch (error) {
      console.error("Error toggling starred status:", error);
      alert("Failed to update starred status");
    }
  };

  // Debounced save function
  const debouncedSave = useCallback(async (newOrder: Website[]) => {
    const changedWebsites: { id: string; position: number }[] = [];
    
    newOrder.forEach((website, newIndex) => {
      const oldIndex = previousOrderRef.current.findIndex(w => w.id === website.id);
      if (oldIndex !== newIndex) {
        changedWebsites.push({
          id: website.id,
          position: newIndex,
        });
      }
    });

    if (changedWebsites.length > 0) {
      try {
        console.log("Updating website positions:", changedWebsites);
        await updateWebsitePositions(changedWebsites);
        previousOrderRef.current = newOrder;
        console.log("Website positions updated successfully");
      } catch (err) {
        console.error("Error updating website positions:", err);
        alert("Failed to update website positions. Please try again.");
        setStarredWebsites(previousOrderRef.current);
      }
    }
  }, [updateWebsitePositions]);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedWebsites.findIndex((w) => w.id === active.id);
      const newIndex = orderedWebsites.findIndex((w) => w.id === over.id);

      const newOrder = arrayMove(orderedWebsites, oldIndex, newIndex);
      setOrderedWebsites(newOrder);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        debouncedSave(newOrder);
      }, 800);
    }
  };

  if (isLoading) {
    return (
      <section className={styles.starredView}>
        <h2 className={styles.title}>Starred</h2>
        <p className={styles.placeholder}>Loading...</p>
      </section>
    );
  }

  return (
    <section className={styles.starredView}>
      <h2 className={styles.title}>Starred</h2>

      {starredWebsites.length === 0 ? (
        <p className={styles.placeholder}>No starred websites yet</p>
      ) : (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Websites ({orderedWebsites.length})
            {hasActiveFilters && starredWebsites.length !== orderedWebsites.length && (
              <span className={styles.filterInfo}> (filtered from {starredWebsites.length})</span>
            )}
          </h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedWebsites.map((w: Website) => w.id)}
              strategy={rectSortingStrategy}
            >
              <div className={styles.websitesGrid}>
                {orderedWebsites.map((website: Website) => (
                  <SortableWebsiteCard
                    key={website.id}
                    website={website}
                    onEdit={handleEditWebsite}
                    onDelete={handleDeleteWebsite}
                    onViewMore={handleViewMore}
                    onToggleStarred={handleToggleStarred}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </section>
  );
}
