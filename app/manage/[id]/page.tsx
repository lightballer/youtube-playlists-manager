import PlaylistEditorWrapper from "@/components/PlaylistEditorWrapper";
import { getPlaylistDetails } from "@/services/actions/youtube/get-playlist-details";
import { getPlaylistItems } from "@/services/actions/youtube/get-playlist-items";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const { error, data: playlist } = await getPlaylistDetails(id);
  if (error) redirect("/auth/sign-out");
  if (!playlist) return <div>Playlist not found</div>;

  const { error: playlistItemsError, data: playlistItems } =
    await getPlaylistItems(id);
  if (playlistItemsError) redirect("/auth/sign-out");
  if (!playlistItems) return <div>No items found</div>;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col items-center">
        <Link href="/manage">Back to manage playlists</Link>
        <h1 className="text-2xl">
          Manage playlist: <span className="font-bold">{playlist.title}</span>
        </h1>
      </div>

      <PlaylistEditorWrapper playlistId={id} items={playlistItems} />
    </div>
  );
}
