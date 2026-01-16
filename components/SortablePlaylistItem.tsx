import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlaylistItemCard from "./PlaylistItemCard";
import { PlaylistItem } from "@/types/playlist";

const SortablePlaylistItem = ({
  id,
  item,
  orderNumber,
  onDelete,
}: {
  id: string;
  item: PlaylistItem;
  orderNumber?: number;
  onDelete?: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PlaylistItemCard
        item={item}
        orderNumber={orderNumber}
        onDelete={onDelete}
      />
    </div>
  );
};

export default SortablePlaylistItem;
