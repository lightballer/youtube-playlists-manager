"use server";

import { getYoutubeSdkObject } from "@/services/youtube-sdk";
import { ServerActionReturnValue } from "@/types/common";
import { Playlist, PlaylistItem } from "@/types/playlist";

export const updatePlaylist = async (
  playlistId: Playlist["id"],
  playlist: PlaylistItem[],
  initialItemsOrder: Map<PlaylistItem["id"], number>
): Promise<ServerActionReturnValue<void>> => {
  try {
    const youtube = await getYoutubeSdkObject();
    if (!youtube)
      return { error: new Error("Youtube SDK not found"), data: null };

    const itemsToDelete = playlist.filter(
      (item) => item.isDeleted && !item.isNew
    );
    for (const item of itemsToDelete) {
      await youtube.playlistItems.delete({ id: item.id });
      console.log("Playlist item with ID " + item.id + " deleted.");
    }

    const activeItems = playlist.filter((item) => !item.isDeleted);

    for (const [i, item] of activeItems.entries()) {
      if (item.isNew) {
        await youtube.playlistItems.insert({
          part: ["snippet"],
          requestBody: {
            snippet: {
              playlistId,
              position: i,
              resourceId: {
                kind: "youtube#video",
                videoId: item.videoId,
              },
            },
          },
        });
        console.log(
          "New playlist item with videoId " +
            item.videoId +
            " inserted at position " +
            i
        );
      } else if (initialItemsOrder.get(item.id) !== i) {
        await youtube.playlistItems.update({
          part: ["snippet"],
          requestBody: {
            id: item.id,
            snippet: {
              playlistId,
              position: i,
              resourceId: {
                kind: "youtube#video",
                videoId: item.videoId,
              },
            },
          },
        });
        console.log(
          "Playlist item with ID " + item.id + " updated successfully."
        );
      }
    }

    console.log("Playlist updated successfully.");

    return {
      error: null,
      data: null,
    };
  } catch (error) {
    return {
      error: error as Error,
      data: null,
    };
  }
};
