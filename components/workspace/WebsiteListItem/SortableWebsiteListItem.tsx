import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Website } from "@/models/types/website";
import WebsiteRow from "../elements/WebsiteRow/WebsiteRow";

interface SortableWebsiteListItemProps {
  website: Website;
  onEdit: (website: Website) => void;
  onDelete: (websiteId: string) => void;
  onViewMore: (website: Website) => void;
  onToggleStarred: (websiteId: string, starred: boolean) => void;
}

export default function SortableWebsiteListItem(props: SortableWebsiteListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.website.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <WebsiteRow {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}
