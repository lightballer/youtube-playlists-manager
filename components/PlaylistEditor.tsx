"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  DragEndEvent,
  DragStartEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import DroppableContainer from "./DroppableContainer";
import SortablePlaylistItem from "./SortablePlaylistItem";
import PlaylistItemCard from "./PlaylistItemCard";
import { Playlist, PlaylistItem } from "@/types/playlist";
import { usePlaylistStore } from "@/services/providers/playlist.provider";
import { updatePlaylist } from "@/services/actions/youtube/update-playlist";
import { EditorContainer, EditorContainers } from "@/types/editor";

type PlaylistEditorProps = {
  playlistId: Playlist["id"];
};

export default function PlaylistEditor({ playlistId }: PlaylistEditorProps) {
  const { playlist, bag, initialItemsOrder, moveItem, resetPlaylist } =
    usePlaylistStore((state) => state);

  const [activeItem, setActiveItem] = useState<PlaylistItem | null>(null);
  const [isPlaylistUpdating, setIsPlaylistUpdating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = playlist.find((item) => item.id === active.id)
      ? playlist.find((item) => item.id === active.id)
      : bag.find((item) => item.id === active.id);

    setActiveItem(item || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainerName = playlist.find((i) => i.id === activeId)
      ? EditorContainers.playlist
      : EditorContainers.bag;

    let overContainerName: EditorContainer | null = null;
    if (
      overId === EditorContainers.playlist ||
      playlist.find((i) => i.id === overId)
    ) {
      overContainerName = EditorContainers.playlist;
    } else if (
      overId === EditorContainers.bag ||
      bag.find((i) => i.id === overId)
    ) {
      overContainerName = EditorContainers.bag;
    }

    if (!overContainerName || activeContainerName === overContainerName) return;

    const activeIndex = (
      activeContainerName === EditorContainers.playlist ? playlist : bag
    ).findIndex((i) => i.id === activeId);

    const overItems =
      overContainerName === EditorContainers.playlist ? playlist : bag;
    const overItemIndex = overItems.findIndex((i) => i.id === overId);
    const newIndex = overItemIndex >= 0 ? overItemIndex : overItems.length;

    moveItem(activeContainerName, activeIndex, overContainerName, newIndex);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveItem(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainerName = playlist.find((i) => i.id === activeId)
      ? EditorContainers.playlist
      : EditorContainers.bag;
    const overContainerName = playlist.find((i) => i.id === overId)
      ? EditorContainers.playlist
      : EditorContainers.bag;

    if (activeContainerName === overContainerName && activeId !== overId) {
      const currentItems =
        activeContainerName === EditorContainers.playlist ? playlist : bag;
      const oldIndex = currentItems.findIndex((i) => i.id === activeId);
      const newIndex = currentItems.findIndex((i) => i.id === overId);

      moveItem(activeContainerName, oldIndex, activeContainerName, newIndex);
    }

    setActiveItem(null);
  };

  const customCollisionDetection = (
    args: Parameters<typeof closestCenter>[0]
  ) => {
    const { collisionRect, droppableContainers } = args;

    const containerDroppables = Array.from(droppableContainers.values()).filter(
      (container) =>
        container.id === EditorContainers.playlist ||
        container.id === EditorContainers.bag
    );

    let targetContainer: EditorContainer | null = null;

    for (const container of containerDroppables) {
      const containerRect = container.rect.current;
      if (!containerRect) continue;

      if (
        collisionRect.left < containerRect.right &&
        collisionRect.right > containerRect.left &&
        collisionRect.top < containerRect.bottom &&
        collisionRect.bottom > containerRect.top
      ) {
        targetContainer = container.id as EditorContainer;
        break;
      }
    }

    if (!targetContainer) {
      return closestCenter(args);
    }

    const targetItems =
      targetContainer === EditorContainers.playlist ? playlist : bag;

    if (targetItems.length === 0) {
      return [{ id: targetContainer }];
    }

    const itemsInContainer = Array.from(droppableContainers.values()).filter(
      (container) => targetItems.some((item) => item.id === container.id)
    );

    return closestCenter({
      ...args,
      droppableContainers: itemsInContainer,
    });
  };

  const handleUpdatePlaylist = async () => {
    if (bag.length > 0) {
      alert("You can't save changes while adding to the bag");
      return;
    }
    if (playlist.length === 0) {
      alert("You can't save an empty playlist");
      return;
    }

    try {
      setIsPlaylistUpdating(true);
      const { error } = await updatePlaylist(
        playlistId,
        playlist,
        initialItemsOrder
      );
      if (error) throw error;
      alert("Playlist updated successfully");
    } catch (error) {
      console.error("Failed to update playlist", error);
      alert("Failed to update playlist");
    } finally {
      setIsPlaylistUpdating(false);
      window.location.reload();
    }
  };

  const handleResetPlaylist = async () => {
    resetPlaylist();
  };

  if (isPlaylistUpdating) return <div>Updating playlist...</div>;

  return (
    <div className="flex flex-col gap-4 min-h-150 w-full justify-center items-end">
      <div className="flex flex-row gap-4">
        <button onClick={handleResetPlaylist}>Reset</button>
        <button onClick={handleUpdatePlaylist} className="bg-amber-500!">
          Save changes
        </button>
      </div>

      <div className="w-full flex gap-4">
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <DroppableContainer
            id={EditorContainers.playlist}
            title="Current Playlist"
          >
            <SortableContext
              items={playlist.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {playlist.map((item) => (
                <SortablePlaylistItem key={item.id} id={item.id} item={item} />
              ))}
            </SortableContext>
          </DroppableContainer>

          <DroppableContainer
            id={EditorContainers.bag}
            title="Bag"
            className="sticky self-start top-4"
          >
            <SortableContext
              items={bag.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {bag.map((item) => (
                <SortablePlaylistItem key={item.id} id={item.id} item={item} />
              ))}
            </SortableContext>
          </DroppableContainer>

          <DragOverlay adjustScale={true}>
            {activeItem ? (
              <div className="opacity-80 shadow-2xl">
                <PlaylistItemCard item={activeItem} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
