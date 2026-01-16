"use server";

import { getYoutubeSdkObject } from "@/services/youtube-sdk";
import { ServerActionReturnValue } from "@/types/common";
import { PlaylistItem } from "@/types/playlist";
import { youtube_v3 } from "googleapis";
import { GaxiosResponseWithHTTP2 } from "googleapis-common";

export const getPlaylistItems = async (
  playlistId: string
): Promise<ServerActionReturnValue<PlaylistItem[]>> => {
  try {
    const youtube = await getYoutubeSdkObject();
    if (!youtube)
      return { error: new Error("Youtube SDK not found"), data: null };
    const fetchedItems: Map<string, youtube_v3.Schema$PlaylistItem> = new Map();

    let nextPageToken = null;
    let isFetchingFinished = false;

    while (!isFetchingFinished) {
      const {
        data,
      }: GaxiosResponseWithHTTP2<youtube_v3.Schema$PlaylistItemListResponse> =
        await youtube.playlistItems.list({
          part: ["snippet"],
          pageToken: nextPageToken ?? undefined,
          maxResults: 50,
          playlistId,
        });

      if (data.nextPageToken) {
        nextPageToken = data.nextPageToken;
      } else {
        isFetchingFinished = true;
      }
      if (!data.items?.length) break;
      for (const item of data.items) {
        fetchedItems.set(item.id!, item);
      }
    }

    const normalizedPlaylistItems = normalizePlaylistItems([
      ...fetchedItems.values(),
    ]);
    return {
      error: null,
      data: normalizedPlaylistItems,
    };
  } catch (error) {
    console.error("Failed to get playlist items", error);
    return {
      error: error as Error,
      data: null,
    };
  }
};

const normalizePlaylistItems = (
  playlistItems: youtube_v3.Schema$PlaylistItem[]
): PlaylistItem[] => {
  return playlistItems.map((item) => ({
    id: item.id!,
    videoId: item.snippet?.resourceId?.videoId ?? null,
    title: item.snippet?.title ?? null,
    thumbnailUrl: item.snippet?.thumbnails?.default?.url ?? null,
    isNew: false,
    isDeleted: false,
  }));
};
