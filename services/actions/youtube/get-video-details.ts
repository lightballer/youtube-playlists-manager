"use server";

import { getYoutubeSdkObject } from "@/services/youtube-sdk";
import { ServerActionReturnValue } from "@/types/common";
import { PlaylistItem } from "@/types/playlist";

export const getVideoDetails = async (
  videoId: string
): Promise<ServerActionReturnValue<PlaylistItem>> => {
  try {
    const youtube = await getYoutubeSdkObject();
    if (!youtube)
      return { error: new Error("Youtube SDK not found"), data: null };

    const { data } = await youtube.videos.list({
      part: ["snippet"],
      id: [videoId],
    });

    if (!data.items?.length) {
      return { error: new Error("Video not found"), data: null };
    }

    const video = data.items[0];
    const temporaryId = `new-${videoId}-${Date.now()}`;

    return {
      error: null,
      data: {
        id: temporaryId,
        videoId: video.id ?? null,
        title: video.snippet?.title ?? null,
        thumbnailUrl: video.snippet?.thumbnails?.default?.url ?? null,
        isNew: true,
        isDeleted: false,
      },
    };
  } catch (error) {
    console.error("Failed to get video details", error);
    return {
      error: error as Error,
      data: null,
    };
  }
};
