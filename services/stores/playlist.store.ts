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
        const newSource = [
          ...(sourceContainer === EditorContainers.playlist
            ? state.playlist
            : state.bag),
        ];
        const newDest =
          sourceContainer === destinationContainer
            ? newSource
            : [
                ...(destinationContainer === EditorContainers.playlist
                  ? state.playlist
                  : state.bag),
              ];

        const [item] = newSource.splice(sourceIndex, 1);
        if (!item) return state;

        newDest.splice(destinationIndex, 0, item);

        return {
          playlist:
            sourceContainer === EditorContainers.playlist
              ? newSource
              : destinationContainer === EditorContainers.playlist
              ? newDest
              : state.playlist,
          bag:
            sourceContainer === EditorContainers.bag
              ? newSource
              : destinationContainer === EditorContainers.bag
              ? newDest
              : state.bag,
        };
      }),
    resetPlaylist: () =>
      set((state) => {
        const unsotrtedPlaylist = [...state.playlist, ...state.bag];
        const sortedPlaylist = unsotrtedPlaylist.sort((a, b) => {
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
  }));
};
