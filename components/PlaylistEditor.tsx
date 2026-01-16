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
import LoadingOverlay from "./LoadingOverlay";
import Spinner from "./Spinner";
import { Playlist, PlaylistItem } from "@/types/playlist";
import { usePlaylistStore } from "@/services/providers/playlist.provider";
import { updatePlaylist } from "@/services/actions/youtube/update-playlist";
import { EditorContainer, EditorContainers } from "@/types/editor";
import { useDialog } from "@/hooks/useDialog";
import { extractVideoId } from "@/utils/youtube-url-parser";
import { getVideoDetails } from "@/services/actions/youtube/get-video-details";
import { getPlaylistItems } from "@/services/actions/youtube/get-playlist-items";

type PlaylistEditorProps = {
  playlistId: Playlist["id"];
};

export default function PlaylistEditor({ playlistId }: PlaylistEditorProps) {
  const {
    playlist,
    bag,
    initialItemsOrder,
    moveItem,
    resetPlaylist,
    addNewItem,
    markAsDeleted,
    loadPlaylist,
  } = usePlaylistStore((state) => state);

  const [activeItem, setActiveItem] = useState<PlaylistItem | null>(null);
  const [isPlaylistUpdating, setIsPlaylistUpdating] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const { showError, showSuccess, showWarning } = useDialog();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
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

    const centerX = collisionRect.left + collisionRect.width / 2;
    const centerY = collisionRect.top + collisionRect.height / 2;

    let targetContainer: EditorContainer | null = null;

    for (const container of containerDroppables) {
      const containerRect = container.rect.current;
      if (!containerRect) continue;

      if (
        centerX >= containerRect.left &&
        centerX <= containerRect.right &&
        centerY >= containerRect.top &&
        centerY <= containerRect.bottom
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
    const activeBagItems = bag.filter((item) => !item.isDeleted);
    if (activeBagItems.length > 0) {
      showWarning(
        "You can't save changes while adding to the bag",
        "Cannot Save"
      );
      return;
    }
    const activePlaylistItems = playlist.filter((item) => !item.isDeleted);
    if (activePlaylistItems.length === 0) {
      showWarning("You can't save an empty playlist", "Cannot Save");
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

      const { data: freshItems, error: fetchError } = await getPlaylistItems(
        playlistId
      );
      if (fetchError || !freshItems) {
        throw fetchError || new Error("Failed to fetch updated playlist");
      }
      loadPlaylist(freshItems);
      showSuccess("Playlist updated successfully");
    } catch (error) {
      console.error("Failed to update playlist", error);
      showError("Failed to update playlist. Please try again.");
    } finally {
      setIsPlaylistUpdating(false);
    }
  };

  const handleResetPlaylist = async () => {
    resetPlaylist();
  };

  const handleAddNewItem = async () => {
    const videoId = extractVideoId(urlInputValue);
    if (!videoId) {
      showError("Invalid YouTube URL. Please paste a valid video link.");
      return;
    }

    setIsLoadingVideo(true);
    try {
      const { data, error } = await getVideoDetails(videoId);
      if (error || !data) {
        showError("Failed to fetch video details. Please try again.");
        return;
      }
      addNewItem(data);
      setUrlInputValue("");
      setIsAddingItem(false);
    } catch {
      showError("Failed to add video. Please try again.");
    } finally {
      setIsLoadingVideo(false);
    }
  };

  const handleCancelAddItem = () => {
    setIsAddingItem(false);
    setUrlInputValue("");
  };

  if (isPlaylistUpdating)
    return <LoadingOverlay message="Saving playlist..." />;

  return (
    <div className="flex flex-col gap-4 min-h-150 w-full justify-center items-end">
      <div className="flex flex-row gap-4 mb-2">
        <button
          onClick={handleResetPlaylist}
          className="bg-slate-600 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(71,85,105,0.3)] hover:shadow-[0_0_30px_rgba(71,85,105,0.5)] hover:-translate-y-0.5"
        >
          Reset
        </button>
        <button
          onClick={handleUpdatePlaylist}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:-translate-y-0.5"
        >
          Save changes
        </button>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4">
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
            className="md:w-1/2"
          >
            <SortableContext
              items={playlist
                .filter((item) => !item.isDeleted)
                .map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {playlist
                .filter((item) => !item.isDeleted)
                .map((item, index) => (
                  <SortablePlaylistItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    orderNumber={index + 1}
                    onDelete={() => markAsDeleted(item.id)}
                  />
                ))}
            </SortableContext>
          </DroppableContainer>

          <DroppableContainer
            id={EditorContainers.bag}
            title="Bag"
            className="md:w-1/2 md:sticky md:self-start md:top-24"
            headerAction={
              !isAddingItem && (
                <button
                  onClick={() => setIsAddingItem(true)}
                  className="px-3 py-1.5 text-sm border border-dashed border-white/20 rounded-lg text-white/60 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-200 flex items-center gap-1.5"
                >
                  <span className="text-base">+</span>
                  <span>Add from URL</span>
                </button>
              )
            }
          >
            {isAddingItem && (
              <div className="flex flex-col gap-2 mb-2 p-3 border border-emerald-500/30 rounded-xl bg-emerald-500/5">
                <input
                  type="text"
                  value={urlInputValue}
                  onChange={(e) => setUrlInputValue(e.target.value)}
                  placeholder="Paste YouTube URL..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-500/50"
                  disabled={isLoadingVideo}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddNewItem}
                    disabled={isLoadingVideo || !urlInputValue.trim()}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {isLoadingVideo ? (
                      <span className="flex items-center gap-2">
                        <Spinner size="sm" />
                        <span>Loading</span>
                      </span>
                    ) : (
                      "Add"
                    )}
                  </button>
                  <button
                    onClick={handleCancelAddItem}
                    disabled={isLoadingVideo}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-600/50 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <SortableContext
              items={bag
                .filter((item) => !item.isDeleted)
                .map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {bag
                .filter((item) => !item.isDeleted)
                .map((item, index) => (
                  <SortablePlaylistItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    orderNumber={index + 1}
                    onDelete={() => markAsDeleted(item.id)}
                  />
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
