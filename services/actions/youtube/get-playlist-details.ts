"use server";

import { getYoutubeSdkObject } from "@/services/youtube-sdk";
import { ServerActionReturnValue } from "@/types/common";
import { Playlist } from "@/types/playlist";

export const getPlaylistDetails = async (
  id: string
): Promise<ServerActionReturnValue<Playlist>> => {
  try {
    const youtube = await getYoutubeSdkObject();
    if (!youtube)
      return { error: new Error("Youtube SDK not found"), data: null };

    const { data: playlist } = await youtube.playlists.list({
      part: ["snippet"],
      id: [id],
    });

    if (!playlist || !playlist.items?.[0]?.snippet?.title)
      return { error: new Error("Playlist not found"), data: null };

    const normalizedPlaylist: Playlist = {
      id,
      title: playlist.items[0].snippet.title ?? null,
      thumbnailUrl: playlist.items[0].snippet.thumbnails?.medium?.url ?? null,
    };

    return {
      error: null,
      data: normalizedPlaylist,
    };
  } catch (error) {
    console.error("Failed to get playlist details", error);
    return {
      error: error as Error,
      data: null,
    };
  }
};
