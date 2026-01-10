"use server";

import { getYoutubeSdkObject } from "@/services/youtube-sdk";
import { Playlist } from "@/types/playlist";
import { youtube_v3 } from "googleapis";

export const getPlaylists = async (): Promise<{
  error: Error | null;
  data: Playlist[] | null;
}> => {
  try {
    const youtube = await getYoutubeSdkObject();
    if (!youtube)
      return { error: new Error("Youtube SDK not found"), data: null };

    const playlists = await youtube.playlists.list({
      part: ["snippet"],
      mine: true,
    });
    if (!playlists.data.items || playlists.data.items.length === 0) {
      return {
        error: null,
        data: [],
      };
    }

    const normalizedPlaylists: Playlist[] = normalizePlaylists(
      playlists.data.items
    );

    return {
      error: null,
      data: normalizedPlaylists,
    };
  } catch (error) {
    console.error("Failed to get youtube sdk object", error);
    return {
      error: error as Error,
      data: null,
    };
  }
};

const normalizePlaylists = (
  playlists: youtube_v3.Schema$Playlist[]
): Playlist[] => {
  return playlists.map((item) => ({
    id: item.id!,
    title: item.snippet?.title ?? null,
  }));
};
