import PlaylistEditorWrapper from "@/components/PlaylistEditorWrapper";
import { getPlaylistDetails } from "@/services/actions/youtube/get-playlist-details";
import { getPlaylistItems } from "@/services/actions/youtube/get-playlist-items";
import Link from "next/link";
import { redirect } from "next/navigation";
import ErrorDisplay from "@/components/ErrorDisplay";
import Image from "next/image";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const { error, data: playlist } = await getPlaylistDetails(id);

  if (error?.message === "Youtube SDK not found") {
    redirect("/auth/sign-out");
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!playlist) return <div>Playlist not found</div>;

  const { error: playlistItemsError, data: playlistItems } =
    await getPlaylistItems(id);

  if (playlistItemsError?.message === "Youtube SDK not found") {
    redirect("/auth/sign-out");
  }

  if (playlistItemsError) {
    return <ErrorDisplay error={playlistItemsError} />;
  }

  if (!playlistItems) return <div>No items found</div>;

  return (
    <div className="w-full">
      <div className="sticky top-0 backdrop-blur-xl bg-white/5 z-10 py-4 border-b border-white/10 mb-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/manage"
              className="text-text-secondary hover:text-cyan-500 transition-colors inline-flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="hidden md:inline">Back to playlists</span>
            </Link>

            {playlist.thumbnailUrl && (
              <Image
                width={48}
                height={48}
                src={playlist.thumbnailUrl}
                alt={playlist.title ?? "Playlist cover"}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-text-primary truncate">
                {playlist.title}
              </h1>
              <p className="text-sm text-text-secondary">
                {playlistItems.length}{" "}
                {playlistItems.length === 1 ? "video" : "videos"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <PlaylistEditorWrapper playlistId={id} items={playlistItems} />
      </div>
    </div>
  );
}
