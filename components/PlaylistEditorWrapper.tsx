"use client";

import { usePlaylistStore } from "@/services/providers/playlist.provider";
import { useEffect } from "react";
import PlaylistEditor from "./PlaylistEditor";
import { Playlist, PlaylistItem } from "@/types/playlist";

type PlaylistEditorWrapperProps = {
  items: PlaylistItem[];
  playlistId: Playlist["id"];
};

export default function PlaylistEditorWrapper({
  items,
  playlistId,
}: PlaylistEditorWrapperProps) {
  const { playlist, loadPlaylist } = usePlaylistStore((state) => state);

  useEffect(() => {
    loadPlaylist(Object.values(items));
  }, []);

  if (playlist.length > 0) {
    return <PlaylistEditor playlistId={playlistId} />;
  }
}
