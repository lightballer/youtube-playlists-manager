import { EditorContainer, EditorContainers } from "@/types/editor";
import { PlaylistItem } from "@/types/playlist";
import { createStore } from "zustand/vanilla";

export type PlaylistState = {
  initialItemsOrder: Map<PlaylistItem["id"], number>;
  playlist: PlaylistItem[];
  bag: PlaylistItem[];
};

export type PlaylistActions = {
  loadPlaylist: (initialPlaylistState: PlaylistItem[]) => void;
  moveItem: (
    sourceContainer: EditorContainer,
    sourceIndex: number,
    destinationContainer: EditorContainer,
    destinationIndex: number
  ) => void;
  resetPlaylist: () => void;
  addNewItem: (item: PlaylistItem) => void;
  markAsDeleted: (itemId: PlaylistItem["id"]) => void;
};

export type PlaylistStore = PlaylistState & PlaylistActions;

export const defaultInitState: PlaylistState = {
  initialItemsOrder: new Map(),
  playlist: [],
  bag: [],
};

export const createPlaylistStore = (
  initState: PlaylistState = defaultInitState
) => {
  return createStore<PlaylistStore>()((set) => ({
    ...initState,
    loadPlaylist: (initialPlaylistState: PlaylistItem[]) =>
      set({
        playlist: initialPlaylistState,
        bag: [],
        initialItemsOrder: new Map(
          initialPlaylistState.map((item, index) => [item.id, index])
        ),
      }),
    moveItem: (
      sourceContainer,
      sourceIndex,
      destinationContainer,
      destinationIndex
    ) =>
      set((state) => {
        const getArray = (container: EditorContainer) =>
          container === EditorContainers.playlist ? state.playlist : state.bag;

        const newSource = [...getArray(sourceContainer)];
        const newDest =
          sourceContainer === destinationContainer
            ? newSource
            : [...getArray(destinationContainer)];

        const [item] = newSource.splice(sourceIndex, 1);
        if (!item) return state;

        newDest.splice(destinationIndex, 0, item);

        const result: Partial<PlaylistState> = {};

        if (sourceContainer === EditorContainers.playlist) {
          result.playlist = newSource;
        } else {
          result.bag = newSource;
        }

        if (sourceContainer !== destinationContainer) {
          if (destinationContainer === EditorContainers.playlist) {
            result.playlist = newDest;
          } else {
            result.bag = newDest;
          }
        }

        return result;
      }),
    resetPlaylist: () =>
      set((state) => {
        const allItems = [...state.playlist, ...state.bag];
        const existingItems = allItems.filter((item) =>
          state.initialItemsOrder.has(item.id)
        );
        const sortedPlaylist = existingItems
          .map((item) => ({ ...item, isDeleted: false }))
          .sort((a, b) => {
            const aIndex = state.initialItemsOrder.get(a.id);
            const bIndex = state.initialItemsOrder.get(b.id);

            if (aIndex === undefined || bIndex === undefined) return 0;

            return aIndex - bIndex;
          });

        return {
          playlist: sortedPlaylist,
          bag: [],
        };
      }),
    addNewItem: (item: PlaylistItem) =>
      set((state) => ({
        bag: [...state.bag, item],
      })),
    markAsDeleted: (itemId: PlaylistItem["id"]) =>
      set((state) => {
        const updateItem = (items: PlaylistItem[]) =>
          items.map((item) =>
            item.id === itemId ? { ...item, isDeleted: true } : item
          );
        return {
          playlist: updateItem(state.playlist),
          bag: updateItem(state.bag),
        };
      }),
  }));
};
