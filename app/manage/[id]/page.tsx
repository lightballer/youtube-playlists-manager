import PlaylistItemsList from "@/components/PlaylistItemsList";
import { getYoutubeSdkObject } from "@/services/youtube-sdk";
import { youtube_v3 } from "googleapis";
import Link from "next/link";
import { redirect } from "next/navigation";

async function fetchAllPlaylistItems(
  playlistId: string,
  fetchedItems: youtube_v3.Schema$PlaylistItem[] = [],
  nextPageToken?: string
) {
  const youtube = await getYoutubeSdkObject();
  if (!youtube) return null;

  const { data: playlistItems } = await youtube.playlistItems.list({
    part: ["snippet"],
    pageToken: nextPageToken ?? undefined,
    maxResults: 50,
    playlistId: playlistId,
  });

  if (playlistItems.nextPageToken) {
    if (!playlistItems.items) return fetchedItems;

    return await fetchAllPlaylistItems(
      playlistId,
      [...fetchedItems, ...playlistItems.items],
      playlistItems.nextPageToken
    );
  }
  if (!playlistItems.items) return fetchedItems;
  return [...fetchedItems, ...playlistItems.items];
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const youtube = await getYoutubeSdkObject();
  if (!youtube) redirect("/login");

  const { data: playlist } = await youtube.playlists.list({
    part: ["snippet"],
    id: [id],
  });

  const playlistItems = await fetchAllPlaylistItems(id);
  if (!playlistItems) return <div>No items found</div>;

  return (
    <div>
      <Link href="/manage">Back to manage playlists</Link>
      <h1>Manage playlist {playlist?.items?.[0].snippet?.title}</h1>
      <p>Items:</p>
      <div className="flex flex-row justify-between w-full h-max">
        <PlaylistItemsList items={playlistItems} />
        <div className="w-100 border border-amber-500 rounded-lg"></div>
      </div>
    </div>
  );
}
