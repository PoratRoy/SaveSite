import { useState, useMemo, useRef, useCallback, useEffect } from "react";
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
import styles from "./FolderView.module.css";
import { Folder } from "@/models/types/folder";
import { Website } from "@/models/types/website";
import EditWebsiteForm from "@/components/workspace/EditWebsiteForm/EditWebsiteForm";
import { useData, useFilter, useSelection } from "@/context";
import { useSlidePanel } from "@/context/SlidePanelContext";
import SortableWebsiteCard from "../WebsiteCard/SortableWebsiteCard";
import FolderGrid from "./FolderGrid";

interface FolderViewProps {
  folder: Folder;
}

export default function FolderView({ folder }: FolderViewProps) {
  const { updateWebsite, removeWebsite, updateWebsitePositions, toggleWebsiteStarred } = useData();
  const { openPanel, closePanel } = useSlidePanel();
  const { selectedTagIds, hasActiveFilters } = useFilter();
  const { selectWebsite } = useSelection();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Filter and sort websites based on selected tags and position
  const filteredWebsites = useMemo(() => {
    let websites = folder.websites || [];
    
    if (hasActiveFilters) {
      websites = websites.filter((website) => {
        // Website must have at least one of the selected tags
        return website.tags?.some((tag) => selectedTagIds.includes(tag.id));
      });
    }
    
    // Sort by position (handle undefined positions)
    return [...websites].sort((a, b) => {
      const posA = a.position ?? 0;
      const posB = b.position ?? 0;
      return posA - posB;
    });
  }, [folder.websites, selectedTagIds, hasActiveFilters]);
  
  const [orderedWebsites, setOrderedWebsites] = useState<Website[]>(filteredWebsites);
  const previousOrderRef = useRef<Website[]>(filteredWebsites);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sync orderedWebsites with filteredWebsites
  useEffect(() => {
    setOrderedWebsites(filteredWebsites);
    previousOrderRef.current = filteredWebsites;
  }, [filteredWebsites]);
  
  const hasChildren = folder.children && folder.children.length > 0;
  const hasWebsites = filteredWebsites.length > 0;
  const isEmpty = !hasChildren && !hasWebsites;

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
        closePanel();
      } catch (err) {
        throw err;
      }
    };

    openPanel(
      "Edit Website",
      <EditWebsiteForm
        website={website}
        onSubmit={handleUpdate}
        onCancel={closePanel}
      />
    );
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    if (confirm("Are you sure you want to delete this website?")) {
      try {
        await removeWebsite(websiteId);
      } catch (err) {
        console.error("Failed to delete website:", err);
        alert("Failed to delete website");
      }
    }
  };

  const handleViewMore = (website: Website) => {
    selectWebsite(website);
  };

  const handleToggleStarred = async (websiteId: string, starred: boolean) => {
    try {
      await toggleWebsiteStarred(websiteId, starred);
    } catch (error) {
      console.error("Error toggling starred status:", error);
      alert("Failed to update starred status");
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
        setOrderedWebsites(previousOrderRef.current);
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

  return (
    <section className={styles.folderView}>
      {hasChildren && (
        <FolderGrid folders={folder.children!} />
      )}

      {hasWebsites && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            {hasActiveFilters && folder.websites && folder.websites.length !== orderedWebsites.length && (
              <span className={styles.filterInfo}> (filtered from {folder.websites.length})</span>
            )}
          </h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedWebsites.map((w) => w.id)}
              strategy={rectSortingStrategy}
            >
              <div className={styles.websitesGrid}>
                {orderedWebsites.map((website) => (
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

      {isEmpty && (
        <p className={styles.placeholder}>This folder is empty</p>
      )}
    </section>
  );
}
